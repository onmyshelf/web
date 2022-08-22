<template>
  <Error v-if="errors.length > 0" />
  <div v-else class="container">
    <Breadcrumbs v-if="name" :parents="breadcrumbs" :current="$t('Manage')" />
    <h1>
      <Translation v-if="name && Object.keys(name).length > 0" :text="name" />
      <template v-else>Collection {{ $route.params.cid }}</template>
    </h1>
    <p v-if="description && Object.keys(description).length > 0">
      <Translation :text="description" />
    </p>
    <p v-if="visibility !== null">{{ $t("Visibility") }}: <Visibility :level=visibility /></p>
    <p>
      <router-link to="edit" class="btn btn-primary">
        <i class="bi-pencil"></i>&nbsp;{{ $t("Edit collection details") }}
      </router-link>
    </p>

    <h2>{{ $t("Properties") }}</h2>
    <div class="mb-3">
      <router-link to="property/new" class="btn btn-success mb-3">
        <i class="bi-plus-lg"></i> {{ $t("Create new property") }}
      </router-link>

      <template v-if="properties">
        <div v-if="Object.keys(properties).length == 0" class="alert alert-warning" role="alert">
          {{ $t("Items are defined by properties") }}<br />
          {{ $t("Create your first property") }}
        </div>
        <table v-else class="table">
          <thead>
            <tr>
              <th scope="col">{{ $t("Property") }}</th>
              <th scope="col">{{ $t("Type") }}</th>
              <th scope="col">{{ $t("Visibility") }}</th>
              <th scope="col">{{ $t("Display order") }}</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(property, name) of properties" :key="name">
              <td scope="row">
                <template v-if="this.$translate(property.label)">{{ this.$translate(property.label) }}</template>
                <template v-else>{{ name }}</template>
              </td>
              <td scope="row">
                <template v-if="$propertyTypes[property.type]">
                  <strong v-if="property.isTitle">{{ $t("Item title") }}</strong>
                  <strong v-else-if="property.isSubTitle">{{ $t("Item subtitle") }}</strong>
                  <strong v-else-if="property.isCover">{{ $t("Item cover") }}</strong>
                  <template v-else>{{ $translate($propertyTypes[property.type].label) }}</template>
                </template>
              </td>
              <td>
                <Visibility :level="property.visibility > visibility ? property.visibility : visibility" />
                <template v-if="property.preview">
                  ,&nbsp;<a title="In item summary"><i class="bi-bookmark-fill"></i></a>
                </template>
              </td>
              <td>
                <a title="Move up" @click="orderProperty(name)"><i class="bi bi-arrow-up-circle-fill"></i></a>&nbsp;
                <a title="Move down" @click="orderProperty(name, -1)"><i class="bi bi-arrow-down-circle"></i></a>
              </td>
              <td>
                <router-link :to="'property/' + name" :title="$t('Edit')"><i class="bi bi-pencil"></i></router-link>&nbsp;&nbsp;
                <router-link :to="'property/' + name + '/delete'" :title="$t('Delete')"><i class="bi bi-x-lg"></i></router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <Loading v-else />
    </div>

    <div v-if="properties && Object.keys(properties).length > 0" class="mb-3">
      <h2>{{ $t("Items") }}</h2>
      <p>
        <router-link to="../item/new" class="btn btn-success">
          <i class="bi-plus-lg"></i> {{ $t("Create an item") }}
        </router-link>
        &nbsp;
        <router-link to="../" class="btn btn-outline-secondary">
          <i class="bi-eye"></i> {{ $t("Show collection") }}
        </router-link>
      </p>
    </div>

    <div class="mb-3">
      <h3>{{ $t("Advanced") }}</h3>
      <div class="card mb-3">
        <div class="card-header">
          <strong>{{ $t("Import collection") }}</strong>
        </div>
        <div class="card-body">
          <p class="card-text">
            {{ $t("Import collection from") }}
          </p>
          <router-link to="import" class="btn btn-primary">
            {{ $t("Import collection") }}
          </router-link>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <strong>{{ $t("Delete collection") }}</strong>
        </div>
        <div class="card-body">
          <p class="card-text">{{ $t("Delete collection details") }}</p>
          <router-link to="delete" class="btn btn-danger">{{ $t("Delete collection") }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs.vue"
import Error from "@/components/Error.vue"
import Loading from "@/components/Loading.vue"
import Translation from "@/components/properties/Translation.vue"
import Visibility from "@/components/properties/Visibility.vue"

export default {
  components: {
    Breadcrumbs,
    Error,
    Loading,
    Translation,
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
      id: this.$route.params.cid,
      name: null,
      description: null,
      cover: null,
      visibility: null,
      properties: null,
      errors: [],
      titleProperty: null,
      loading: true,
    }
  },
  created() {
    // get collection details
    this.$apiGet("collections/" + this.id)
      .then((response) => {
        // translate name & description
        if (response.data.name) {
          this.name = this.$translate(response.data.name)
        } else {
          this.name = "Collection " + this.collection.id
        }
        if (response.data.description) {
          this.description = this.$translate(response.data.description)
        }

        this.breadcrumbs[0].label = this.name

        this.cover = response.data.cover
        this.visibility = response.data.visibility
        this.properties = response.data.properties

        // search title property
        if (response.data.properties) {
          for (let key in response.data.properties) {
            if (response.data.properties[key].isTitle) {
              this.titleProperty = key
            }
          }
        }

        this.loading = false
      })
      .catch((e) => {
        this.errors.push(e)
      })
  },
  methods: {
    // order property
    orderProperty(name, increment = 1) {
      let keys = Object.keys(this.properties)

      // one property: do nothing
      if (keys.length <= 1) {
        return
      }

      for (let i = 0; i < keys.length; i++) {
        if (keys[i] != name) {
          continue
        }

        let data = {}
        let otherProperty = null
        let otherData = null

        // increment
        if (increment > 0) {
          // max: do nothing
          if (i == 0) {
            return
          }

          otherProperty = keys[i-1]
          if (this.properties[otherProperty].order > this.properties[name].order) {
            otherData = { order: this.properties[name].order }
          }
          data = { order: this.properties[name].order + 1 }
        } else {
          // decrement
          // min: do nothing
          if (i >= keys.length - 1) {
            return
          }

          otherProperty = keys[i + 1]
          if (this.properties[otherProperty].order < this.properties[name].order) {
            otherData = { order: this.properties[name].order }
          }
          data = { order: this.properties[name].order - 1 }
        }

        // API call to update property
        this.$apiPatch("collections/" + this.id + "/properties/" + name, data)
        .then(() => {
          document.location.reload()
        })

        if (otherData) {
          // API call to update other property
          this.$apiPatch("collections/" + this.id + "/properties/" + otherProperty, otherData)
          .then(() => {
            document.location.reload()
          })
        }

        // quit loop
        return
      }
    },
  },
}
</script>
