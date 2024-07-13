<template>
  <div class="container">
    <Error v-if="error" :status="error" />
    <template v-else>
      <h1>
        <template v-if="id">{{ $t("Edit item") }} {{ id }}</template>
        <template v-else>{{ $t("New item") }}</template>
      </h1>
      <div v-if="id" class="mt-3 mb-3">
        <button class="btn btn-success" @click="duplicate()">
          <i class="bi bi-copy"></i> {{ $t("Duplicate item") }}
        </button>
        <a class="btn btn-outline-danger ms-3" href="delete">
          <i class="bi bi-x-lg"></i> {{ $t("Delete item") }}
        </a>
      </div>

      <Loading v-if="loading" />
      <form v-else @submit="validate">
        <div class="card mb-3">
          <div class="card-header">{{ $t("Properties") }}</div>
          <div class="card-body">
            <div v-for="(property, name) in collection.properties" :key="name" class="item-preview mb-3">
              <label :for="name" class="form-label">
                {{ label(property.label, name) }}:
                <span v-if="helpProperty(property)">
                  <a
                    href="#"
                    @click="toggleHelp(name)"
                    title="Informations about this property"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    :aria-controls="'help-' + name"
                  >
                    <i class="bi bi-info-circle"></i>
                  </a>
                  <div :id="'help-' + name" class="card card-body bg-light" style="display:none">
                    <i class="bi bi-info-circle"></i> {{ $translate(property.description) }}
                  </div>
                </span>
                <span v-if="property.suffix">({{ property.suffix }})</span>
              </label>

              <template v-if="Array.isArray(edit.properties[name])">
                <PropertyInput v-for="(value, key) in edit.properties[name]" :key="key" v-model="edit.properties[name][key]" :name="name" :property="property" />
              </template>
              <PropertyInput v-else v-model="edit.properties[name]" :name="name" :property="property" />

              <button
                v-if="property.multiple"
                type="button"
                class="btn btn-outline-primary"
                @click="addValue(name)"
              >
                + {{ $t("Add value") }}
              </button>
            </div>
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-header">{{ $t("Display") }}</div>
          <div class="card-body">
            <label class="form-label">{{ $t("Who can see item") }}</label>
            <div class="form-check form-switch mb-2">
              <input
                v-model="customVisibility"
                type="checkbox"
                class="form-check-input"
                @change="toggleVisibility()"
              />
              <label class="form-check-label mb-2">
                {{ customVisibility ? $t("Custom item config") : $t("Default collection config") }}
              </label>
              <VisibilitySelector
                v-model="edit.visibility"
                :min="collection.visibility"
                max="3"
                :disabled="!customVisibility"
                @change="changeBorrowable()"
              />
            </div>

            <label class="form-label">{{ $t("Who can borrow item") }}</label>
            <div class="form-check form-switch mb-2">
              <input
                v-model="customBorrowable"
                type="checkbox"
                class="form-check-input"
                @change="toggleBorrowable()"
              />
              <label class="form-check-label mb-2">
                {{ customBorrowable ? $t("Custom item config") : $t("Default collection config") }}
              </label>
              <VisibilitySelector
                v-model="edit.borrowable"
                :min="collection.borrowable"
                max="3"
                :disabled="!customBorrowable"
              />
            </div>
          </div>
        </div>

        <div class="mb-3">
          <button
            type="submit"
            class="btn btn-primary me-3"
            :disabled="$demoMode()"
          >
            {{ id ? $t("Save changes") : $t("Create item") }}
          </button>
          <a :href="id ? '.' : '..'" class="btn btn-outline-secondary">
            {{ $t("Cancel") }}
          </a>
        </div>
      </form>
    </template>
  </div>
</template>

<script>
import Error from "@/components/Error.vue"
import Loading from "@/components/Loading.vue"
import PropertyInput from "./properties/PropertyInput.vue"
import VisibilitySelector from "./properties/VisibilitySelector.vue"

export default {
  components: {
    Error,
    Loading,
    PropertyInput,
    VisibilitySelector,
  },
  data() {
    return {
      id: this.$route.params.id,
      collection: {
        id: this.$route.params.cid,
      },
      edit: {
        properties: {},
        visibility: 0,
        borrowable: 0,
      },
      customVisibility: false,
      customBorrowable: false,
      error: false,
      loading: true,
      help: {},
    }
  },
  created() {
    // get collection
    this.$apiGet("collections/" + this.collection.id)
      .then((response) => {
        this.collection = response.data

        // translate name
        if (response.data.name) {
          this.collection.name = this.$translate(response.data.name)
        } else {
          this.collection.name = "Collection " + this.collection.id
        }

        if (!this.id) {
          this.edit.visibility = this.collection.visibility
          this.edit.borrowable = this.collection.borrowable
          this.loading = false
        }

        // check if collection is mine; if not, quit
        if (!this.$matchUserId(this.collection.owner)) {
          document.location.href = ".."
        }
      })
      .catch((e) => {
        this.error = this.$apiErrorStatus(e)
      })

    // get item
    if (this.id) {
      this.$apiGet("collections/" + this.collection.id + "/items/" + this.id)
        .then((response) => {
          this.edit = response.data

          if (this.edit.visibility > 0) {
            this.customVisibility = true
          }
          if (this.edit.visibility < this.collection.visibility) {
            this.edit.visibility = this.collection.visibility
          }

          if (this.edit.borrowable > 0) {
            this.customBorrowable = true
          }
          if (this.edit.borrowable < this.collection.borrowable) {
            this.edit.borrowable = this.collection.borrowable
          }

          this.loading = false
        })
        .catch((e) => {
          this.error = this.$apiErrorStatus(e)
        })
    }
  },
  methods: {
    addValue(propertyName) {
      // transform values to array if not
      if (!Array.isArray(this.edit.properties[propertyName])) {
        this.edit.properties[propertyName] = [ this.edit.properties[propertyName] ]
      }
      // append empty value
      this.edit.properties[propertyName].push("")
    },
    helpProperty(property) {
      let translation = this.$translate(property.description)
      if (translation) {
        return translation
      }

      return false
    },
    toggleHelp(property) {
      let obj = document.getElementById("help-" + property)
      if (obj.style.display === "none") {
        obj.style.display = "block"
      } else {
        obj.style.display = "none"
      }
    },
    toggleVisibility() {
      if (!this.customVisibility) {
        this.edit.visibility = this.collection.visibility
      }
    },
    toggleBorrowable() {
      if (!this.customBorrowable) {
        this.edit.borrowable = this.collection.borrowable
      }
    },
    changeBorrowable() {
      if (this.edit.borrowable < this.edit.visibility) {
        this.edit.borrowable = this.edit.visibility
      }
    },
    label(label, name) {
      let translation = this.$translate(label)
      if (translation) {
        return translation
      }
      return name
    },
    duplicate() {
      if (!this.id) {
        return
      }
      this.id = null
      this.edit.id = null
    },
    validate(e) {
      // prevent form to reload page
      e.preventDefault()

      // copy edit object (to avoid cloning events)
      let data = Object.assign({}, this.edit)

      // no custom visibility: reset changes
      if (!this.customVisibility) {
        data.visibility = 0
      }

      // API call
      if (this.id) {
        // modify item
        this.$apiPatch("collections/" + this.collection.id + "/items/" + this.id, data)
        .then(() => {
          document.location.href = "/collection/" + this.collection.id + "/item/" + this.id + "/"
        })
      } else {
        // create new item
        this.$apiPost("collections/" + this.collection.id + "/items/", data)
        .then((response) => {
          document.location.href = "/collection/" + this.collection.id + "/item/" + response.data.id + "/"
        })
      }
    },
  },
}
</script>
