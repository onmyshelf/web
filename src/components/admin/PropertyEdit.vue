<template>
  <div class="container">
    <Error v-if="errors.length > 0" />
    <template v-else>
      <Breadcrumbs v-if="collection" :parents=breadcrumbs :current="id || $t('New property')" />
      <h1>
        <template v-if="id">{{ $t("Edit property") }} {{ id }}</template>
        <template v-else>{{ $t("New property") }}</template>
      </h1>
      <form @submit="validate">
        <div class="mb-3">
          <label class="form-label">Label</label>
          <input v-model="edit.label" type="text" placeholder="e.g. Name" class="form-control"
            @input="labelToNewId" />
        </div>

        <div class="form-check form-switch mb-3">
          <input v-model="edit.hideLabel" class="form-check-input" type="checkbox" />
          <label class="form-check-label">Do not show this label before value</label>
        </div>

        <div v-if="!id" class="mb-3">
          <label class="form-label">Property ID (<strong>{{ $t("required") }}</strong>). Use a short name and alphanumeric characters only</label>
          <input v-model="edit.name" type="text" placeholder="e.g. name" class="form-control"
            pattern="[a-z0-9_]+" maxlength="20" @input="checkNewId" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Description (used only in edition for your own information)</label>
          <textarea v-model="edit.description" placeholder="e.g. This property is used for..." class="form-control" rows="2"></textarea>
        </div>

        <div class="mb-3">
          <label class="form-label">
            Type of property (<strong>required</strong>)
          </label>
          <select v-model="edit.type" class="form-select" aria-label="Type of property" required @change="changedType=true">
            <option v-for="(obj,key) in $propertyTypes" :key="key" :value="key">
              {{ obj.label }} <template v-if="obj.description">({{ obj.description }})</template>
            </option>
          </select>
        </div>

        <div class="card mb-3">
          <div class="card-header">Summary</div>
          <div class="card-body">
            <div class="form-check form-switch">
              <input v-model="edit.preview" class="form-check-input" type="checkbox"
                :disabled="edit.visibility > 3 || edit.isCover || edit.isTitle || edit.isSubTitle" />
              <label class="form-check-label">
                Display in item summary (shown in collection list and on top of item page)
              </label>
            </div>

            <div v-if="canBeTitle" class="form-check form-switch">
              <input v-model="edit.isTitle" class="form-check-input" type="checkbox"
                :disabled=edit.isSubTitle @change="checkPreview" />
              <label class="form-check-label">
                Use as item title (main name)
              </label>
            </div>

            <div v-if="canBeTitle" class="form-check form-switch">
              <input v-model="edit.isSubTitle" class="form-check-input" type="checkbox"
                :disabled=edit.isTitle @change="checkPreview" />
              <label class="form-check-label">Use as item subtitle</label>
            </div>

            <div v-if="edit.type == 'image'" class="form-check form-switch">
              <input v-model="edit.isCover" class="form-check-input" type="checkbox" @change="checkPreview" />
              <label class="form-check-label">Use as cover image</label>
            </div>
          </div>
        </div>

        <div class="mt-3 mb-3">
          <label class="form-label">{{ $t("Who can see this property?") }}</label>
          <select v-model="edit.visibility" class="form-select" aria-label="Visibility">
            <template v-for="(name,key) in $visibilityLevels" :key="key">
              <option :value="key">{{ name.label }}</option>
            </template>
          </select>
        </div>

        <div class="form-check form-switch mb-3">
          <input v-model="edit.required" class="form-check-input" type="checkbox" />
          <label class="form-check-label">
            This property should never be empty
          </label>
        </div>

        <div class="mb-3">
          <label class="form-label">Default value if property is empty</label>
          <input v-model="edit.default" type="text" class="form-control" />
        </div>

        <div class="mb-3">
          <label class="form-label">Suffix to display after value</label>
          <input v-model="edit.suffix" type="text" class="form-control" placeholder="e.g. min, kg, m², ..." />
        </div>

        <div v-if="canBeFilterable || canBeSearchable || canBeSortable" class="card mb-3">
          <div class="card-header">Search and filters</div>
          <div class="card-body">
            <div v-if="canBeFilterable" class="form-check form-switch">
              <input v-model="edit.filterable" class="form-check-input" type="checkbox" />
              <label class="form-check-label">
                Collection can be filtered by this property
              </label>
            </div>

            <div v-if="canBeSearchable" class="form-check form-switch">
              <input v-model="edit.searchable" class="form-check-input" type="checkbox">
              <label class="form-check-label">
                Searching items will search in this property
              </label>
            </div>

            <div v-if="canBeSortable" class="form-check form-switch">
              <input v-model="edit.sortable" class="form-check-input" type="checkbox">
              <label class="form-check-label">
                Collection can be sorted by this property
              </label>
            </div>
          </div>
        </div>

        <div class="mt-3 mb-3">
          <label class="form-label">Order (increase to see this property above others)</label>
          <input v-model="edit.order" type="number" min="0"
            class="form-control"
          />
        </div>

        <div class="mb-3">
          <button class="btn btn-primary" type="submit" :disabled="$demoMode()">
            <template v-if="id">{{ $t("Save changes") }}</template>
            <template v-else>{{ $t("Create property") }}</template>
          </button>&nbsp;
          <a href=".." class="btn btn-outline-secondary">{{ $t("Cancel") }}</a>
        </div>
      </form>
    </template>
  </div>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs.vue"
import Error from "@/components/Error.vue"

export default {
  components: {
    Breadcrumbs,
    Error,
  },
  data() {
    return {
      breadcrumbs: [
        {
          url: "/collection/" + this.$route.params.cid + "/",
          label: "Collection " + this.$route.params.cid,
        },
        {
          url: "/collection/" + this.$route.params.cid + "/manage/",
          label: this.$t("Manage"),
        },
      ],
      id: this.$route.params.id,
      collection: null,
      // default form values
      edit: {
        type: "text",
        visibility: 0,
      },
      changedType: false,
      errors: [],
    }
  },
  created() {
    // new property: do not load data
    if (!this.id) {
      this.loading = false
      return
    }

    // get collection
    this.$apiGet("collections/" + this.$route.params.cid)
      .then((response) => {
        this.collection = response.data

        // translate name
        if (response.data.name) {
          this.collection.name = this.$translate(response.data.name)
        } else {
          this.collection.name = "Collection " + this.id
        }
        this.breadcrumbs[0].label = this.collection.name

        // check if collection is mine; if not, quit
        if (!this.$matchUserId(this.collection.owner)) {
          document.location.href = ".."
        }

        this.edit = this.collection.properties[this.id]

        // transform boolean values
        // TODO: remove this dirty work!
        let booleans = [
          "isCover",
          "isTitle",
          "preview",
          "hideLabel",
          "filterable",
          "searchable",
          "sortable",
        ]
        booleans.forEach((key) => {
          if (this.edit[key] == 1) {
            this.edit[key] = true
          }
        })

        // translate values
        this.edit.label = this.$translate(this.edit.label)
        this.edit.description = this.$translate(this.edit.description)

        // force preview if title or cover
        if (this.edit.isCover) {
          this.edit.preview = true
        }
        if (this.edit.isTitle) {
          this.edit.preview = true
        }
      })
      .catch((e) => {
        this.errors.push(e)
      })
  },
  computed: {
    canBeTitle() {
      switch (this.edit.type) {
        case "text":
        case "number":
        case "date":
        case "datetime":
          return true
      }
      return false
    },
    canBeFilterable() {
      switch (this.edit.type) {
        case "image":
        case "longtext":
        case "object":
        case "url":
          return false
      }
      return true
    },
    canBeSearchable() {
      switch (this.edit.type) {
        case "image":
        case "object":
        case "rating":
        case "yesno":
          return false
      }
      return true
    },
    canBeSortable() {
      switch (this.edit.type) {
        case "image":
        case "longtext":
        case "object":
        case "url":
          return false
      }
      return true
    }
  },
  methods: {
    labelToNewId() {
      if (this.id) {
        return
      }
      this.edit.name = this.edit.label
      this.checkNewId()
    },
    idToNewType() {
      // try to guess property type using property name
      if (this.id) {
        return
      }
      if (this.changedType) {
        return
      }

      switch (this.edit.name) {
        case "color":
        case "date":
        case "datetime":
        case "file":
        case "image":
        case "json":
        case "number":
        case "rating":
        case "url":
        case "video":
          this.edit.type = this.edit.name
          break

        case "colour":
        case "couleur":
          this.edit.type = "color"
          break

        case "uri":
          this.edit.type = "file"
          break

        case "link":
          this.edit.type = "url"
          break

        case "comment":
        case "description":
        case "resume":
        case "synopsis":
        case "text":
        case "texte":
          this.edit.type = "longtext"
          break

        case "cover":
        case "img":
        case "photo":
        case "picture":
          this.edit.type = "image"
          break

        case "id":
        case "year":
          this.edit.type = "number"
          break

        case "note":
          this.edit.type = "rating"
          break

        case "movie":
        case "teaser":
        case "trailer":
          this.edit.type = "video"
          break
      }
    },
    checkNewId() {
      if (this.id) {
        return
      }

      let newId = this.edit.name.toLowerCase().replace(/\s+/g, "") // delete spaces

      // remove accents, swap ñ for n, etc
      let from = "àáäâèéëêìíïîòóöôùúüûñç"
      let to   = "aaaaeeeeiiiioooouuuunc"
      for (let i=0, l = from.length; i < l; i++) {
        newId = newId.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
      }

      newId = newId.replace(/[^a-z0-9]/g, "").substring(0, 20) // remove invalid chars

      this.edit.name = newId

      this.idToNewType()
    },
    checkPreview() {
      if (this.edit.isCover || this.edit.isTitle || this.edit.isSubTitle) {
        this.edit.preview = true
      }

      if (this.edit.isTitle) {
        if (!this.edit.filterable) {
          this.edit.filterable = true
        }
        if (!this.edit.searchable) {
          this.edit.searchable = true
        }
      }
    },
    validate(e) {
      // prevent form to reload page
      e.preventDefault()

      // copy edit object (to avoid cloning events)
      let data = Object.assign({}, this.edit)

      if (data.label) {
        data.label = this.$i18nObject(data.label)
      }
      if (data.description) {
        data.description = this.$i18nObject(data.description)
      }

      // transform boolean values
      // TODO: remove this dirty work!
      let booleans = [
        "isCover",
        "isTitle",
        "preview",
        "hideLabel",
        "filterable",
        "searchable",
        "sortable",
      ]
      booleans.forEach((key) => {
        if (data[key]) {
          data[key] = 1
        } else {
          data[key] = 0
        }
      })

      let redirect = "/collection/" + this.$route.params.cid + "/manage/"

      // API call
      if (this.id) {
        // modify property
        this.$apiPatch("collections/" + this.$route.params.cid + "/properties/" + this.id, data)
          .then(() => {
            document.location.href = redirect
          })
      } else {
        // create new property
        this.$apiPost("collections/" + this.$route.params.cid + "/properties", data)
          .then(() => {
            document.location.href = redirect
          })
      }
    },
  },
}
</script>
