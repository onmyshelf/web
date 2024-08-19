<template>
  <div class="container">
    <Error v-if="error" :status="error" />
    <template v-else>
      <div v-if="collection" class="mt-2">
        <a
          :href="(this.$route.params.id ? '../../' : '') + '#item-' + id"
          @click="$parent.item = null"
        >
          <i class="bi-arrow-left me-3" />{{ $t("Return to collection") }}
          <strong>{{ collection.name }}</strong>
        </a>
      </div>

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
              <template
                v-if="properties[property] && !collection.properties[property].isCover"
              >
                <template v-if="Array.isArray(properties[property])">
                  <ImageView
                    v-for="(img, i) in properties[property]"
                    :key="i"
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
            <QuantityBadge :quantity="item.quantity" />
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
              <EditItemButton :collection="collection.id" :item="item.id" />
              <LoanItemButton
                v-if="!item.lent && !pendingLoan && !askingLoan"
                :collection="collection.id"
                :item="item.id"
              />
              <LoanItemButton
                v-if="item.lent && currentLoan"
                :collection="collection.id"
                :item="item.id"
                :loan="currentLoan"
                state="returned"
              />
              <LoanItemButton
                v-if="!item.lent && pendingLoan"
                :collection="collection.id"
                :item="item.id"
                :loan="pendingLoan"
                state="lent"
              />
              <ActionItemButton
                v-if="askingLoan"
                :collection="collection.id"
                :item="item.id"
                :action="'loan/' + askingLoan"
                :label="$t('Manage loan request')"
                buttonStyle="secondary"
                icon="signpost-split"
              />
              <ActionItemButton
                :collection="collection.id"
                :item="item.id"
                action="delete"
                :label="$t('Delete')"
                buttonStyle="danger"
                icon="x-lg"
              />
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
              {{ $t("Item added on") }}: {{ item.created }}
              <template v-if="item.updated != item.created">
                <br />
                {{ $t("Last changes") }}: {{ item.updated }}
              </template>
            </div>
          </div>

          <div v-if="isMine && currentTab == 'Loans'">
            <LoanItemButton
              :collection="collection.id"
              :item="item.id"
              :label="$t('Create loan')"
              buttonStyle="success"
              icon="plus-lg"
            />

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
                    <a :href="'/borrowers/' + loan.borrowerId + '/edit'">
                      {{ loan.borrower }}
                    </a>
                  </td>

                  <td class="loan-actions text-end">
                    <span v-if="loan.state == 'asked'" class="me-2">
                      <ActionLoanIcon
                        :collection="collection.id"
                        :item="item.id"
                        :loan="loan.id"
                        action="?state=accepted"
                        icon="check-square"
                        iconStyle="success"
                        :label="$t('Accept')"
                      />
                      <ActionLoanIcon
                        :collection="collection.id"
                        :item="item.id"
                        :loan="loan.id"
                        action="?state=rejected"
                        icon="x-square"
                        iconStyle="danger"
                        :label="$t('Reject')"
                      />
                    </span>
                    <ActionLoanIcon
                      v-if="loan.state == 'accepted' && !item.lent"
                      :collection="collection.id"
                      :item="item.id"
                      :loan="loan.id"
                      action="?state=lent"
                      icon="box-arrow-up"
                      iconStyle="success"
                      :label="$t('Loan item')"
                    />
                    <a
                      v-if="loan.state == 'lent' && loan.email"
                      :href="'mailto:' + loan.email"
                      class="me-3"
                      :title="$t('Send email to borrower')"
                    >
                      <i class="bi bi-send text-primary" />
                    </a>
                    <ActionLoanIcon
                      v-if="loan.state == 'lent'"
                      :collection="collection.id"
                      :item="item.id"
                      :loan="loan.id"
                      action="?state=returned"
                      icon="box-arrow-down"
                      iconStyle="success"
                      :label="$t('Get back item')"
                    />
                    <ActionLoanIcon
                      :collection="collection.id"
                      :item="item.id"
                      :loan="loan.id"
                      icon="pencil"
                      :label="$t('Edit')"
                    />
                    <ActionLoanIcon
                      :collection="collection.id"
                      :item="item.id"
                      :loan="loan.id"
                      action="delete"
                      icon="x-lg"
                      :label="$t('Delete')"
                    />
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
import ActionLoanIcon from "./loans/ActionLoanIcon.vue"
import EditItemButton from "./items/EditItemButton.vue"
import ImageView from "./properties/ImageView.vue"
import LoanBadge from "./loans/LoanBadge.vue"
import LoanItemButton from "./loans/LoanItemButton.vue"
import Error from "./Error.vue"
import Property from "./Property.vue"
import QuantityBadge from "./items/QuantityBadge.vue"
import TabsView from "./TabsView.vue"
import VisibilityIcon from "./properties/VisibilityIcon.vue"

export default {
  components: {
    ActionItemButton,
    ActionLoanIcon,
    EditItemButton,
    ImageView,
    LoanBadge,
    LoanItemButton,
    Error,
    Property,
    QuantityBadge,
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
      id: null,
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
    this.id = this.$route.params.id
    if (!this.id) {
      const hash = window.location.hash
      if (hash.substring(0, 6) == "#item-") {
        this.id = hash.split("-")[1]
      }
    }

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
    this.$apiGet("collections/" + this.$route.params.cid + "/items/" + this.id)
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
      this.$apiGet("collections/" + this.$route.params.cid + "/items/" + this.id + "/loans")
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
