<template>
  <div class="container">
    <Error v-if="errors.length > 0" />
    <template v-else>
      <Breadcrumbs v-if="collection && item" :parents="breadcrumbs" :current="title" />
      <div v-if="item && collection && collection.properties" class="row item">
        <div class="col-4 item-cover">
          <Image v-if="properties && coverProperty && properties[coverProperty]" :url="properties[coverProperty]"
            :cover="true" :linked="true" />
          <Image v-else :url="collection.cover" :cover="true" />

          <div v-if="gallery.length > 0" class="gallery">
            <template v-for="property in gallery" :key="property">
              <Image v-if="properties[property] && !collection.properties[property].isCover" :url="properties[property]" :linked="true" />
            </template>
          </div>
        </div>
        <div class="col">
          <h1>{{ title }}</h1>
          <h2 v-if="subTitleProperty && properties[subTitleProperty]">
            {{ properties[subTitleProperty] }}
          </h2>
          <a href="#loans"><span v-if="item.lent" class="badge text-bg-danger mb-2">{{ $t("Lent") }}</span></a>
          <div v-if="isMine" class="item-actions">
            <Visibility :level="item.visibility > collection.visibility ? item.visibility : collection.visibility" />
            <router-link to="edit" class="btn btn-outline-primary">
              <i class="bi-pencil"></i> {{ $t("Edit") }}
            </router-link>
            &nbsp;
            <router-link to="delete" class="btn btn-outline-danger">
              <i class="bi-x-lg"></i> {{ $t("Delete") }}
            </router-link>
            <hr />
          </div>
          <div v-if="itemCopies && itemCopies.length > 1" class="item-copies">
            {{ $t("Copies") }}:
            <li v-for="(itemCopy, i) in itemCopies" :key="i" @click="loadItemCopy(i)"
              :class="'btn btn-' + (i == currentItemCopy ? '' : 'outline-') + 'secondary'"
            >
              <template v-if="itemCopy.description">{{ itemCopy.description }}</template>
              <template v-else>{{ $t("Copy") }} #{{ itemCopy.id }}</template>
            </li>
            <hr />
          </div>
          <template v-if="properties">
            <template v-for="(property, name) of collection.properties" :key="name">
              <div v-if="!property.shown && (properties[name] || property.default)" class="item-preview">
                <Property :name="name" :property="property" :value="properties[name]" />
              </div>
            </template>
          </template>
          <div id="loans" class="loans">
            <hr />
            <h2>{{ $t("Loans") }}</h2>
            <router-link to="loan/new" class="btn btn-outline-success">
              <i class="bi bi-plus-lg"></i> {{ $t("Create a loan") }}
            </router-link>
            <table v-if="loans && loans.length > 0" class="table">
              <thead>
                <tr>
                  <th scope="col">{{ $t("Loan state") }}</th>
                  <th scope="col">{{ $t("Date") }}</th>
                  <th scope="col">{{ $t("Borrower") }}</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(loan, i) of loans" :key="i">
                  <td scope="row">
                    <span v-if="loan.state == 'asked'" class="badge text-bg-info">
                      {{ $translate($loanStates[loan.state].label) }}
                    </span>
                    <span v-else-if="loan.state == 'rejected'" class="badge text-bg-warning">
                      {{ $translate($loanStates[loan.state].label) }}
                    </span>
                    <span v-else-if="loan.state == 'accepted'" class="badge text-bg-secondary">
                      {{ $translate($loanStates[loan.state].label) }}
                    </span>
                    <span v-else-if="loan.state == 'lent'" class="badge text-bg-danger">
                      {{ $translate($loanStates[loan.state].label) }}
                    </span>
                    <span v-else-if="loan.state == 'returned'" class="badge text-bg-success">
                      {{ $translate($loanStates[loan.state].label) }}
                    </span>
                  </td>
                  <td>
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
                  <td>
                    {{ loan.borrower }}
                  </td>
                  <td>
                    <router-link :to="'loan/' + loan.id" :title="$t('Edit')"><i class="bi bi-pencil"></i></router-link>&nbsp;&nbsp;
                    <router-link :to="'loan/' + loan.id + '/delete'" :title="$t('Delete')"><i class="bi bi-x-lg"></i></router-link>
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

<script>
import Breadcrumbs from "./Breadcrumbs.vue"
import Image from "./properties/medias/Image.vue"
import Error from "./Error.vue"
import Property from "./Property.vue"
import Visibility from "./properties/Visibility.vue"

export default {
  components: {
    Breadcrumbs,
    Image,
    Error,
    Property,
    Visibility,
  },
  data() {
    return {
      breadcrumbs: [
        {
          url: "/collection/" + this.$route.params.cid + "/",
          label: "Collection " + this.$route.params.cid,
        },
      ],
      collection: null,
      item: null,
      properties: null,
      loans: null,
      errors: [],
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

        // we get the loans only if we are sure collection is mine
        if (this.$matchUserId(this.collection.owner)) {
          this.getLoans()
        }
      })
      .catch((e) => {
        this.errors.push(e)
      })

    // get item
    this.$apiGet("collections/" + this.$route.params.cid + "/items/" + this.$route.params.id)
      .then((response) => {
        this.item = response.data
        this.loadItemCopy(0)
      })
      .catch((e) => {
        this.errors.push(e)
      })
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
        })
        .catch((e) => {
          this.errors.push(e)
        })
    },
  },
}
</script>
