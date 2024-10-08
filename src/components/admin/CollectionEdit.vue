<template>
  <div class="container">
    <h1>
      {{ id ? $t("Edit collection") : $t("New collection") }}
    </h1>
    <Loading v-if="loading" />
    <form v-else @submit="validate">
      <div class="mb-3">
        <label class="form-label">{{ $t("Collection type") }}</label>
        <select
          v-if="templates"
          v-model="edit.type"
          class="form-select"
          :aria-label="$t('Collection type')"
          @change="changeType()"
          required
        >
          <option
            v-for="(template, key) in templates"
            :key="key"
            :value="template.type"
          >
            {{ $translate(template.name) }}
          </option>
          <option value="">{{ $t("Other collection type") }}</option>
        </select>
      </div>

      <div class="mb-3">
        <label class="form-label">{{ $t("Collection name") }}</label>
        <input
          v-model="edit.name"
          name="collection-name"
          type="text"
          class="form-control"
          required
          :placeholder="placeholderName"
          :disabled="edit.type === null"
          @change="changedName = true"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">
          {{ $t("Collection description") }} ({{ $t("optional") }})
        </label>
        <textarea
          v-model="edit.description"
          rows="3"
          class="form-control"
        ></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">
          {{ $t("Collection image") }} ({{ $t("optional") }})
        </label>
        <MediaSelector type="image" v-model="edit.cover" />
      </div>

      <div class="mb-3">
        <label class="form-label">
          {{ $t("Tags") }}
        </label>

        <div>
          <div
            v-for="(tag, key) in edit.tags"
            :key="key"
            class="input-group mb-1"
          >
            <input
              v-model="edit.tags[key]"
              name="tags"
              type="text"
              class="form-control"
              :placeholder="$t('Collection tag example')"
              :disabled="edit.tags[key] != '' && edit.tags[key] == edit.type"
            />
            <button
              v-if="edit.tags[key] != edit.type"
              type="button"
              class="input-group-text"
              :title="$t('Remove tag')"
              @click="edit.tags.splice(key, 1)"
            >
              <i class="bi bi-x-lg" />
            </button>
          </div>
        </div>

        <button
          type="button"
          class="btn btn-outline-success"
          @click="edit.tags.push('')"
        >
          + {{ $t("Add new tag") }}
        </button>
      </div>

      <div class="mb-3">
        <label class="form-label">{{ $t("Who can see collection") }}</label>
        <VisibilitySelector
          v-model="edit.visibility"
          max="3"
          @change="changeBorrowable()"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">{{ $t("Who can borrow items") }}</label>
        <VisibilitySelector
          v-model="edit.borrowable"
          :min="edit.visibility"
          max="3"
        />
      </div>

      <div class="mb-3">
        <button
          type="submit"
          class="btn btn-primary me-3"
          :disabled="$demoMode()"
        >
          {{ id ? $t("Save changes") : $t("Create collection") }}
        </button>
        <router-link :to="id ? '.' : '/'" class="btn btn-outline-secondary">
          {{ $t("Cancel") }}
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue"
import MediaSelector from "./properties/MediaSelector.vue"
import VisibilitySelector from "./properties/VisibilitySelector.vue"

export default {
  components: {
    Loading,
    MediaSelector,
    VisibilitySelector,
  },

  data() {
    return {
      loading: true,
      id: this.$route.params.cid,
      edit: { type: null, tags: [""], visibility: 3, borrowable: 3 },
      templates: null,
      changedName: false,
      oldType: '',
      placeholderName: "",
    }
  },

  created() {
    // get collection templates
    this.$apiGet("collectiontemplates")
    .then((response) => {
      this.templates = response.data
      // end of loading
      this.loading = false
    })

    // if new collection, stop here
    if (!this.id) {
      return
    }

    // get collection details
    this.$apiGet("collections/" + this.id)
    .then((response) => {
      this.edit = response.data

      this.edit.name = this.$translate(response.data.name)
      this.edit.description = this.$translate(response.data.description)

      // force empty type if not defined
      if (!this.edit.type) {
        this.edit.type = ""
      }
      this.oldType = this.edit.type

      if (!this.edit.tags) {
        this.edit.tags = [this.edit.type]
      }

      // reload borrowable
      this.changeBorrowable()

      // end of loading
      this.loading = false
    })
  },
  methods: {
    validate(e) {
      // prevent form to reload page
      e.preventDefault()

      // copy edit object (to avoid cloning events)
      let data = Object.assign({}, this.edit)

      data.name = this.$i18nObject(data.name)
      data.description = this.$i18nObject(data.description)

      // if new collection & type is defined,
      if (!this.id && this.edit.type) {
        // get data from template
        this.templates.forEach((template) => {
          if (template.type != this.edit.type) {
            return
          }

          // append properties definition from the template
          data.properties = template.properties
        })
      }

      // API call
      if (this.id) {
        // modify collection
        this.$apiPatch("collections/" + this.id, data).then(() => {
          // redirect page
          document.location.href = "/collection/" + this.id + "/manage/"
        })
      } else {
        // create new collection
        this.$apiPost("collections", data).then((response) => {
          // redirect to collection page
          let redirect = "/collection/" + response.data.id + "/"

          // if custom type of collection, redirect to manage page
          // to create properties
          if (!this.edit.type) {
            redirect += "manage/"
          }

          document.location.href = redirect
        })
      }
    },

    changeType() {
      if (this.oldType != "") {
        for (let i = 0; i < this.edit.tags.length; i++) {
          if (this.edit.tags[i] == this.oldType) {
            this.edit.tags[i] = this.edit.type
          }
        }
      } else {
        this.edit.tags.push(this.edit.type)
      }

      this.oldType = this.edit.type

      if (this.id || this.changedName) {
        return
      }

      // default collection name: get translation
      let translationKey = "Collection name example for " + this.edit.type
      let translation = this.$t(translationKey)

      if (translation == translationKey) {
        // translation not found: empty
        this.edit.name = ""
        translation = this.$t("Collection name example")
      } else {
        this.edit.name = translation
      }

      this.placeholderName = this.$t("e.g.") + " " + translation
    },

    changeBorrowable() {
      if (this.edit.borrowable < this.edit.visibility) {
        this.edit.borrowable = this.edit.visibility
      }
    },
  },
}
</script>
