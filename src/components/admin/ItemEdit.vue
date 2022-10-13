<template>
  <div class="container">
    <Error v-if="errors.length > 0" />
    <template v-else>
      <h1>
        <template v-if="id">{{ $t("Edit item") }} {{ id }}</template>
        <template v-else>{{ $t("New item") }}</template>
      </h1>
      <div v-if="id" class="mt-3 mb-3">
        <button class="btn btn-success" @click="duplicate()">
          <i class="bi bi-arrow-left-right"></i> Duplicate item
        </button>
      </div>

      <Loading v-if="loading" />
      <form v-else @submit="validate">
        <div v-for="(property, name) in collection.properties" :key="name" class="item-preview mb-3">
          <label :for="name" class="form-label">
            {{ label(property.label, name) }}:
            <span v-if="helpProperty(property)">
              <a href="#" @click="toggleHelp(name)"
                title="Informations about this property" data-bs-toggle="collapse"
                aria-expanded="false" :aria-controls="'help-' + name"
              >
                <i class="bi bi-info-circle"></i>
              </a>
              <div :id="'help-' + name" class="card card-body bg-light" style="display:none">
                <i class="bi bi-info-circle"></i> {{ $translate(property.description) }}
              </div>
            </span>
          </label>

          <template v-if="Array.isArray(edit.properties[name])">
            <PropertyInput v-for="(value, key) in edit.properties[name]" :key="key" v-model="edit.properties[name][key]" :name="name" :property="property" />
          </template>
          <PropertyInput v-else v-model="edit.properties[name]" :name="name" :property="property" />

          <button v-if="property.multiple" type="button" class="btn btn-outline-primary" @click="addValue(name)">
            + {{ $t("add value") }}
          </button>
        </div>

        <div class="mb-3">
          <label class="form-label">{{ $t("Who can see item") }}</label>
          <Visibility v-model="edit.visibility" max="3" />
        </div>

        <div class="mb-3">
          <button class="btn btn-primary" type="submit" :disabled="$demoMode()">
            <template v-if="id">{{ $t("Save changes") }}</template>
            <template v-else>{{ $t("Create item") }}</template>
          </button>&nbsp;
          <a v-if="id" href="." class="btn btn-outline-secondary">{{ $t("Cancel") }}</a>
          <a v-else href=".." class="btn btn-outline-secondary">{{ $t("Cancel") }}</a>
        </div>
      </form>
    </template>
  </div>
</template>

<script>
import Error from "@/components/Error.vue"
import Loading from "@/components/Loading.vue"
import PropertyInput from "./properties/PropertyInput.vue"
import Visibility from "./properties/Visibility.vue"

export default {
  components: {
    Error,
    Loading,
    PropertyInput,
    Visibility,
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
      },
      errors: [],
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
          this.loading = false
        }

        // check if collection is mine; if not, quit
        if (!this.$matchUserId(this.collection.owner)) {
          document.location.href = ".."
        }
      })
      .catch((e) => {
        this.errors.push(e)
      })

    // get item
    if (this.id) {
      this.$apiGet("collections/" + this.collection.id + "/items/" + this.id)
        .then((response) => {
          this.edit = response.data

          this.loading = false
        })
        .catch((e) => {
          this.errors.push(e)
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

      // API call
      if (this.id) {
        // modify item
        this.$apiPatch("collections/" + this.collection.id + "/items/" + this.id, data)
        .then(() => {
          document.location.href = "/collection/" + this.collection.id + "/item/" + this.id + "/"
        })
      } else {
        // create new collection
        this.$apiPost("collections/" + this.collection.id + "/items/", data)
        .then((response) => {
          document.location.href = "/collection/" + this.collection.id + "/item/" + response.data.id + "/"
        })
      }
    },
  },
}
</script>
