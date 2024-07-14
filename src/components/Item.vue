<template>
  <div class="container">
    <Error v-if="error" :status="error" />
    <template v-else>
      <Breadcrumbs
        v-if="collection && item"
        :parents="breadcrumbs"
        :current="title"
      />

      <div v-if="item && collection && collection.properties" class="row item">
        <div class="col-4 item-cover">
          <ImageView
            v-if="properties && coverProperty && properties[coverProperty]"
            :url="properties[coverProperty]"
            cover="true"
            linked="true"
            id="itemImage"
          />
          <ImageView
            v-else
            :url="collection.cover"
            id="itemImage"
            cover="true"
          />

          <div v-if="gallery.length > 0" class="gallery">
            <template v-for="property in gallery" :key="property">
              <template v-if="properties[property] && !collection.properties[property].isCover">
                <template v-if="Array.isArray(properties[property])">
                  <ImageView
                    v-for="(img, i) in properties[property]" :key="i"
                    :url="img"
                    linked="true"
                    :id="'property-' + property + '-' + i"
                    :data-property="property"
                  />
                </template>
                <ImageView
                  v-else
                  :url="properties[property]"
                  linked="true"
                  :id="'property-' + property"
                />
              </template>
            </template>
          </div>
        </div>
        <div class="col">
          <h1 id="itemTitle">{{ title }}</h1>
          <h2
            v-if="subTitleProperty && properties[subTitleProperty]"
            id="itemSubtitle"
          >
            {{ properties[subTitleProperty] }}
          </h2>

          <div class="mb-3">
            <LoanBadge v-if="item.lent" state="lent" />
            <LoanBadge v-if="isMine && item.pendingLoans" state="accepted" />
            <LoanBadge v-if="isMine && item.askingLoans" state="asked" />
          </div>

          <div class="item-actions mb-4">
            <template v-if="isMine">
              <VisibilityIcon
                :level="item.visibility > collection.visibility ? item.visibility : collection.visibility"
                id="itemVisibility"
              />
              <EditItemButton />
              <LoanItemButton
                v-if="!item.lent && !pendingLoan && !askingLoan"
              />
              <LoanItemButton
                v-if="item.lent && currentLoan"
                :loan="currentLoan"
                state="returned"
              />
              <LoanItemButton
                v-if="!item.lent && pendingLoan"
                :loan="pendingLoan"
                state="lent"
              />
              <ActionItemButton
                v-if="askingLoan"
                :action="'loan/' + askingLoan"
                buttonStyle="secondary"
                icon="signpost-split"
                :label="$t('Manage loan request')"
              />
              <router-link
                to="delete"
                id="itemDeleteButton"
                class="btn btn-outline-danger"
              >
                <i class="bi-x-lg" /> {{ $t("Delete") }}
              </router-link>
            </template>
          </div>

          <TabsView :tabs="tabs" v-model="currentTab" class="mb-3" />

          <div v-if="currentTab == 'Properties'">
            <div v-if="itemCopies && itemCopies.length > 1" class="item-copies">
              {{ $t("Copies") }}:
              <li
                v-for="(itemCopy, i) in itemCopies"
                :key="i"
                @click="loadItemCopy(i)"
                :class="'btn btn-' + (i == currentItemCopy ? '' : 'outline-') + 'secondary'"
              >
                <template v-if="itemCopy.description">
                  {{ itemCopy.description }}
                </template>
                <template v-else>{{ $t("Copy") }} #{{ itemCopy.id }}</template>
              </li>
              <hr />
            </div>

            <template v-if="properties">
              <template
                v-for="(property, name) of collection.properties"
                :key="name"
              >
                <div
                  v-if="!property.shown && (properties[name] || property.default)"
                  :id="'property-' + name"
                  class="item-preview"
                >
                  <Property
                    :name="name"
                    :property="property"
                    :value="properties[name]"
                  />
                </div>
              </template>
            </template>

            <div v-if="isMine" class="item-dates">
              {{ $t("Item added on:") }} {{ item.created }}
              <template v-if="item.updated != item.created">
                <br />
                {{ $t("Last changes:") }} {{ item.updated }}
              </template>
            </div>
          </div>

          <div v-if="isMine && currentTab == 'Loans'">
            <router-link
              to="loan/new"
              class="btn btn-outline-success"
              :title="$t('Loans')"
            >
              <i class="bi-plus-lg me-2" />{{ $t("Create loan") }}
            </router-link>

            <table v-if="loans && loans.length > 0" class="table mt-2">
              <thead>
                <tr>
                  <th scope="col">{{ $t("Loan state") }}</th>
                  <th scope="col">{{ $t("Date") }}</th>
                  <th scope="col">{{ $t("Borrower") }}</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(loan, i) of loans" :key="i" :id="'loan-' + loan.id">
                  <td
                    scope="row"
                    class="loan-state"
                    :data-loan-state="loan.state"
                  >
                    <LoanBadge :state="loan.state" />
                  </td>

                  <td class="loan-date">
                    <template v-if="loan.state == 'lent'">
                      {{ new Date(loan.lent * 1000).toLocaleString() }}
                    </template>
                    <template v-else-if="loan.state == 'returned'">
                      {{ new Date(loan.returned * 1000).toLocaleString() }}
                    </template>
                    <template v-else>
                      {{ new Date(loan.date).toLocaleString() }}
                    </template>
                  </td>

                  <td class="loan-borrower">
                    {{ loan.borrower }}
                  </td>

                  <td class="loan-actions text-end">
                    <span v-if="loan.state == 'asked'" class="me-4">
                      <router-link
                        :to="'loan/' + loan.id + '?state=accepted'"
                        :title="$t('Accept')"
                        class="loan-accept me-3"
                      >
                        <i class="bi bi-check-square text-success" />
                      </router-link>
                      <router-link
                        :to="'loan/' + loan.id + '?state=rejected'"
                        :title="$t('Reject')"
                        class="loan-reject"
                      >
                        <i class="bi bi-x-square text-danger" />
                      </router-link>
                    </span>
                    <router-link
                      v-if="loan.state == 'accepted' && !item.lent"
                      :to="'loan/' + loan.id + '?state=lent'"
                      :title="$t('Loan item')"
                      class="loan-lent me-4"
                    >
                      <i class="bi bi-box-arrow-up text-success" />
                    </router-link>
                    <router-link
                      v-if="loan.state == 'lent'"
                      :to="'loan/' + loan.id + '?state=returned'"
                      :title="$t('Get back item')"
                      class="loan-return me-4"
                    >
                      <i class="bi bi-box-arrow-down text-success" />
                    </router-link>
                    <router-link
                      :to="'loan/' + loan.id"
                      :title="$t('Edit')"
                      class="loan-edit me-3"
                    >
                      <i class="bi bi-pencil" />
                    </router-link>
                    <router-link
                      :to="'loan/' + loan.id + '/delete'"
                      :title="$t('Delete')"
                      class="loan-delete"
                    >
                      <i class="bi bi-x-lg" />
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.item-actions {
  margin-bottom: 10px;
}

.item-actions a {
  margin-right: 10px;
}

.item-copies li {
  margin-left: 10px;
}

.item-dates {
  margin-top: 1em;
  text-align: right;
  font-style: italic;
}
</style>

<script>
import ActionItemButton from "./items/ActionItemButton.vue"
import Breadcrumbs from "./Breadcrumbs.vue"
import EditItemButton from "./items/EditItemButton.vue"
import ImageView from "./properties/ImageView.vue"
import LoanBadge from "./loans/LoanBadge.vue"
import LoanItemButton from "./loans/LoanItemButton.vue"
import Error from "./Error.vue"
import Property from "./Property.vue"
import TabsView from "./TabsView.vue"
import VisibilityIcon from "./properties/VisibilityIcon.vue"

export default {
  components: {
    ActionItemButton,
    Breadcrumbs,
    EditItemButton,
    ImageView,
    LoanBadge,
    LoanItemButton,
    Error,
    Property,
    TabsView,
    VisibilityIcon,
  },
  data() {
    return {
      breadcrumbs: [
        {
          url: "/collection/" + this.$route.params.cid + "/",
          label: "Collection " + this.$route.params.cid,
        },
      ],
      tabs: ["Properties"],
      currentTab: "Properties",
      collection: null,
      item: null,
      properties: null,
      loans: null,
      currentLoan: null,
      pendingLoan: null,
      askingLoan: null,
      error: false,
      titleProperty: null,
      subTitleProperty: null,
      coverProperty: null,
      gallery: [],
      itemCopies: [
        {
          id: 1,
          quantity: 1,
          properties: {},
        },
      ],
      currentItemCopy: 0,
    }
  },
  created() {
    // get collection
    this.$apiGet("collections/" + this.$route.params.cid)
      .then((response) => {
        this.collection = response.data

        // translate name
        if (response.data.name) {
          this.collection.name = this.$translate(response.data.name)
        } else {
          this.collection.name = "Collection " + this.$route.params.cid
        }
        this.breadcrumbs[0].label = this.collection.name

        // parse properties
        if (response.data.properties) {
          for (let key in response.data.properties) {
            // search title property
            if (response.data.properties[key].isTitle) {
              this.titleProperty = key
              this.collection.properties[key].shown = true
            }
            // search subtitle property
            if (response.data.properties[key].isSubTitle) {
              this.subTitleProperty = key
              this.collection.properties[key].shown = true
            }
            // search cover property
            if (response.data.properties[key].isCover) {
              this.coverProperty = key
              this.collection.properties[key].shown = true
            }
            // search images for gallery
            if (response.data.properties[key].type == "image") {
              this.gallery.push(key)
              this.collection.properties[key].shown = true
            }
          }
        }

        // if collection is mine,
        if (this.$matchUserId(this.collection.owner)) {
          this.tabs.push("Loans")
          this.getLoans()
        }
      })
      .catch((e) => {
        this.error = this.$apiErrorStatus(e)
      })

    // get item
    this.$apiGet("collections/" + this.$route.params.cid + "/items/" + this.$route.params.id)
      .then((response) => {
        this.item = response.data
        this.loadItemCopy(0)
      })
      .catch((e) => {
        this.error = this.$apiErrorStatus(e)
      })

    // get tab
    if (this.$route.query.tab) {
      this.currentTab = this.$route.query.tab
    }
  },
  computed: {
    // check if collection is mine
    isMine() {
      return this.$matchUserId(this.collection.owner)
    },
    title() {
      if (this.properties[this.titleProperty]) {
        return this.properties[this.titleProperty]
      } else {
        return "Item " + this.item.id
      }
    },
  },
  methods: {
    loadItemCopy(id) {
      // merge item properties and copy properties
      this.properties = {
        ...this.item.properties,
        ...this.itemCopies[id].properties,
      }

      this.currentItemCopy = id
    },
    getLoans() {
      // get loans history from API
      this.$apiGet("collections/" + this.$route.params.cid + "/items/" + this.$route.params.id + "/loans")
        .then((response) => {
          this.loans = response.data

          // search for current loan id
          response.data.forEach((loan) => {
            switch (loan.state) {
              case "lent":
                this.currentLoan = loan.id
                break;
              case "accepted":
                this.pendingLoan = loan.id
                break;
              case "asked":
                this.askingLoan = loan.id
                break;
              default:
                break;
            }
          })
        })
        .catch((e) => {
          this.error = this.$apiErrorStatus(e)
        })
    },
  },
}
</script>
