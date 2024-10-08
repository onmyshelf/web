<template>
  <Error v-if="error" :status="error" />

  <div v-else class="container">
    <a href="../">
      <i class="bi-arrow-left me-3" />{{ $t("Return to collection") }}
    </a>
    <h1>
      {{ $t("Manage") + " " + (name ? $translate(name) : $t("Collection") + " " + $route.params.cid) }}
    </h1>
    <p v-if="description">{{ $translate(description) }}</p>
    <p v-if="visibility !== null">
      {{ $t("Visibility") }}:
      {{ $t("Visibility level " + $visibilityLevels[visibility].label) }}
    </p>
    <p>
      <router-link to="edit" class="btn btn-primary me-3">
        <i class="bi-pencil me-2" />{{ $t("Edit collection details") }}
      </router-link>
    </p>

    <h2>{{ $t("Properties") }}</h2>
    <div class="mb-3">
      <p>{{ $t("Items are defined by properties") }}</p>
      <router-link to="property/new" class="btn btn-success mb-3">
        <i class="bi-plus-lg me-1" />{{ $t("Create new property") }}
      </router-link>

      <template v-if="properties">
        <div
          v-if="Object.keys(properties).length == 0"
          class="alert alert-warning"
          role="alert"
        >
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
                <i
                  v-if="property.isTitle || property.isSubTitle || property.isCover || property.preview"
                  class="bi-bookmark-fill"
                  :title="$t('In item summary')"
                />
                {{ $translate(property.label) ? $translate(property.label) : name }}
              </td>
              <td scope="row">
                <strong v-if="property.isTitle">
                  {{ $t("Item title") }}
                </strong>
                <strong v-else-if="property.isSubTitle">
                  {{ $t("Item subtitle") }}
                </strong>
                <strong v-else-if="property.isCover">
                  {{ $t("Item cover") }}
                </strong>
                <template v-else>
                  <template v-if="$propertyTypes[property.type]">
                    {{ $translate($propertyTypes[property.type].label) }}
                  </template>
                </template>
              </td>
              <td>
                <i
                  v-if="property.hidden"
                  class="bi bi-eye-slash"
                  :title="$t('Visibility') + ': ' + $t('Visibility level Nobody')"
                />
                <VisibilityIcon
                  v-else
                  :level="property.visibility > visibility ? property.visibility : visibility"
                />
              </td>
              <td>
                <a
                  v-if="reloadOrder"
                  href="."
                  class="btn btn-sm btn-outline-success"
                >
                  <i class="bi bi-arrow-clockwise" /> {{ $t("Reload") }}
                </a>
                <template v-else>
                  <a
                    :title="$t('Move up')"
                    @click="orderProperty(name)"
                    class="me-3"
                  >
                    <i class="bi bi-arrow-up-circle-fill" />
                  </a>
                  <a :title="$t('Move down')" @click="orderProperty(name, -1)">
                    <i class="bi bi-arrow-down-circle" />
                  </a>
                </template>
              </td>
              <td>
                <router-link
                  :to="'property/' + name"
                  :title="$t('Edit')"
                  class="me-3"
                >
                  <i class="bi bi-pencil" />
                </router-link>
                <router-link
                  :to="'property/' + name + '/delete'"
                  :title="$t('Delete')"
                >
                  <i class="bi bi-x-lg" />
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <Loading v-else />
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
          <router-link to="import" class="btn btn-success">
            <i class="bi bi-box-arrow-in-down-left me-1" />
            {{ $t("Import collection") }}
          </router-link>
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-header">
          <strong>{{ $t("Export collection") }}</strong>
        </div>
        <div class="card-body">
          <p class="card-text">
            {{ $t("Export collection to") }}
          </p>
          <button class="btn btn-primary" @click="exportCollection()">
            <i class="bi bi-box-arrow-up me-1" />
            {{ $t("Export collection") }}
          </button>
          <SuccessMessage :status="exportStatus" class="mt-3" />
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <strong>{{ $t("Delete collection") }}</strong>
        </div>
        <div class="card-body">
          <p class="card-text">{{ $t("Delete collection details") }}</p>
          <router-link to="delete" class="btn btn-danger">
            <i class="bi bi-x-lg" />
            {{ $t("Delete collection") }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Error from "@/components/Error.vue"
import Loading from "@/components/Loading.vue"
import SuccessMessage from "@/components/SuccessMessage.vue"
import VisibilityIcon from "@/components/properties/VisibilityIcon.vue"

export default {
  components: {
    Error,
    Loading,
    SuccessMessage,
    VisibilityIcon,
  },
  data() {
    return {
      id: this.$route.params.cid,
      name: null,
      description: null,
      cover: null,
      visibility: null,
      properties: null,
      error: false,
      titleProperty: null,
      loading: true,
      exportStatus: null,
      reloadOrder: false,
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
        this.error = this.$apiErrorStatus(e)
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

      const swapElements = (array, index1, index2) => {
        let temp = array[index1]
        array[index1] = array[index2]
        array[index2] = temp
      }

      for (let i = 0; i < keys.length; i++) {
        if (keys[i] == name) {
          if (increment > 0) {
            if (i == 0) {
              return
            }
            swapElements(keys, i, i - 1)
          } else {
            if (i == keys.length - 1) {
              return
            }
            swapElements(keys, i + 1, i)
          }
          break
        }
      }

      for (let i = 0; i < keys.length; i++) {
        let order = keys.length - i - 1
        if (this.properties[keys[i]].order != order) {
          // API call to update property
          this.$apiPatch("collections/" + this.id + "/properties/" + keys[i], {order: order})
          .then(() => {
            this.reloadOrder = true
          })
        }
      }
    },

    exportCollection() {
      this.exportStatus = "started"

      // get collection details
      this.$apiGet("collections/" + this.id + "/export")
        .then((response) => {
          console.log(response)
          this.$downloadFile("collection.json", JSON.stringify(response.data, null, 2))
          this.exportStatus = true
        })
        .catch(() => {
          this.exportStatus = false
        })
    },
  },
}
</script>
