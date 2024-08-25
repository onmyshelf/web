<template>
  <div class="container">
    <a href="../">
      <i class="bi-arrow-left me-3" />{{ $t("Return to collection") }}
    </a>
    <h1>{{ $t("Import item from sources") }}</h1>
    <Empty
      v-if="Object.keys(search.modules).length == 0"
      :label="$t('No import modules found')"
    >
      <a :href="'../manage/edit'">
        {{ $t("Edit your collection tags") }}
      </a>
      {{ $t("or ask to install modules") }}
    </Empty>
    <form v-else @submit="validate">
      <div class="mb-3">
        <label class="form-label">Source</label>
        <select
          v-model="search.module"
          name="import-source"
          class="form-select"
          aria-label="Import module"
          required="true"
        >
          <option
            v-for="(module, name) in search.modules"
            :key="name"
            :value="name"
          >
            {{ module.name }}
            <template v-if="module.tags">
              ({{ $t("Tags") }}: {{ module.tags.join(", ") }})
            </template>
          </option>
        </select>
      </div>

      <div class="">
        <div class="btn-group card-body" role="group">
          <input
            type="radio"
            class="btn-check"
            id="import-search"
            name="import-search"
            autocomplete="off"
            @change="importType = 'search'"
            :checked="importType == 'search'"
          />
          <label class="btn btn-outline-primary" for="import-search">
            {{ $t("Search") }}
          </label>

          <input
            type="radio"
            class="btn-check"
            id="import-url"
            name="import-url"
            autocomplete="off"
            @change="importType = 'url'"
            :checked="importType == 'url'"
          />
          <label class="btn btn-outline-primary" for="import-url">
            {{ $t("External URL") }}
          </label>
        </div>
      </div>

      <div class="card mb-3">
        <div v-if="importType == 'search'" class="card-body">
          <input
            v-model="search.search"
            name="search"
            type="text"
            class="form-control"
            :placeholder="$t('Search item here')"
            required
          />
        </div>

        <div v-else-if="importType == 'url'" class="input-group card-body">
          <span class="input-group-text" id="import-url">
            {{ $t("Enter valid URL") }}
          </span>
          <input
            type="text"
            class="form-control"
            aria-describedby="import-url"
            :placeholder="$t('URL example')"
            v-model="search.source"
          />
          <a
            v-if="search.source"
            :href="search.source"
            class="btn btn-secondary"
            :title="$t('Open in new tab')"
            target="_blank"
          >
            <i class="bi bi-box-arrow-up-right"></i>
          </a>
        </div>
      </div>

      <div class="mb-3">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="$demoMode() || loading || (importType == 'url' && !search.source)"
        >
          <template v-if="importType == 'url'">
            {{ $t("Import item") }}
          </template>
          <template v-else>
            {{ $t("Search item") }}
          </template>
        </button>
      </div>

      <div v-if="$demoMode()" class="alert alert-warning">
        {{ $t("Search disabled in demo mode") }}
      </div>
    </form>

    <Loading v-if="loading" />
    <div v-if="items" class="container items">
      <div
        v-for="error in errors"
        :key="error"
        class="alert alert-danger"
        role="alert"
      >
        {{ error.text }}
      </div>
      <template v-if="items.length == 0">
        <Empty :label="$t('Nothing found')" />
      </template>
      <template v-else>
        <template v-for="(item, index) in items" :key="index">
          <div :id="'item-' + index" class="row">
            <div class="col-4 item-cover">
              <ImageView :url="item.image" :cover="true" />
            </div>
            <div class="col">
              <h1>{{ item.name }}</h1>
              <p>{{ item.description }}</p>
              <p>
                <a
                  :id="'item-source-' + index"
                  :href="item.source"
                  target="_blank"
                >
                  {{ $t("Source") }} <i class="bi bi-box-arrow-up-right" />
                </a>
              </p>
              <p>
                <Loading
                  v-if="item.load"
                  :info="$t('Importing item') + '...'"
                />
                <button
                  v-else
                  class="btn btn-primary me-2"
                  :disabled="$demoMode() || item.itemId"
                  @click="importItem(item.source, index)"
                >
                  {{ item.itemId ? $t("Imported") : $t("Import item") }}
                </button>
                <a
                  v-if="item.itemId"
                  :href="'../item/' + item.itemId + '/'"
                  class="btn btn-outline-secondary me-2"
                >
                  <i class="bi bi-eye me-1" /> {{ $t("See item") }}
                </a>
              </p>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import Empty from "@/components/Empty.vue"
import ImageView from "@/components/properties/ImageView.vue"
import Loading from "@/components/Loading.vue"

export default {
  components: {
    Empty,
    Loading,
    ImageView,
  },

  data() {
    return {
      importType: "search",
      search: {
        modules: {},
        module: "",
        source: "",
        search: "",
      },
      collection: null,
      items: false,
      errors: [],
      loading: true,
      help: {},
    }
  },

  // when page is loaded
  created() {
    // get collection
    this.$apiGet("collections/" + this.$route.params.cid)
      .then((response) => {
        if (response.data) {
          this.collection = response.data

          // get import modules
          this.$apiGet("modules/import")
            .then((response) => {
              if (response.data) {
                for (const [name, module] of Object.entries(response.data)) {
                  if (!module.search) {
                    continue
                  }

                  if (this.collection.tags.length > 0 && module.tags) {
                    if (!module.tags.some(tag => this.collection.tags.includes(tag))) {
                      continue
                    }
                  }

                  this.search.modules[name] = module
                }
              }

              let modules = Object.keys(this.search.modules)

              if (modules.length > 0) {
                this.search.module = modules[0]

                let lastModule = localStorage.getItem("onmyshelf_module_" + this.$route.params.cid)
                if (lastModule) {
                  this.search.module = lastModule
                }
              }

              this.loading = false
            })
            .catch(() => {
              this.result = {
                success: false,
                text: "Internal error. Please retry.",
              }
            })
        }
      })
      .catch(() => {
        this.result = {
          success: false,
          text: "Internal error. Please retry.",
        }
      })

    // default module
    if (this.$route.query.module) {
      this.search.module = this.$route.query.module
    }

    // default search
    if (this.$route.query.search) {
      this.search.search = this.$route.query.search
    }
  },
  methods: {
    validate(e) {
      // prevent form to reload page
      e.preventDefault()

      // save last used module
      localStorage.setItem("onmyshelf_module_" + this.$route.params.cid, this.search.module)

      // if url source mode, import item
      if (this.importType == "url") {
        this.importItem(this.search.module, this.search.source)
        return
      }

      // search
      this.loading = true

      let data = {
        module: this.search.module,
        source: this.search.source,
        search: this.search.search,
        options: {
          tags: this.collection.tags,
        },
      }

      this.items = false
      this.errors = []

      // search
      this.$apiPost("collections/" + this.$route.params.cid + "/import/search", data)
        .then((response) => {
          if (this.items === false) {
            this.items = []
          }

          if (response.data) {
            this.items = response.data
            this.loading = false
          }
        })
        .catch(() => {
          this.errors.push({
            text: this.$t("An error occured") + " " + this.$t("Please retry")
          })
        })
    },

    importItem(source, index = null) {
      let redirection = null

      if (index === null) {
        this.loading = true
        redirection = "../"
      } else {
        this.items[index].load = true
      }

      let data = {
        module: this.search.module,
        source: source,
      }

      // import
      this.$apiPost("collections/" + this.$route.params.cid + "/import/item", data)
        .then((response) => {
          if (response.data) {
            // if imported item id is defined, redirect to item page
            if (response.data.imported && response.data.imported.items.length > 0) {
              // get imported item ID
              let itemId = response.data.imported.items[0]

              if (index === null) {
                redirection += "item/" + itemId + "/"
              } else {
                this.items[index].itemId = itemId
                this.items[index].load = false
              }
            }
          }

          // redirect to item page or collection
          if (redirection) {
            document.location.href = redirection
          }
        })
        .catch(() => {
          this.result = {
            success: false,
            text: "Internal error. Please retry."
          }
        })
    },
  },
}
</script>
