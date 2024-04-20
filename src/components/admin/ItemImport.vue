<template>
  <div class="container">
    <h1>{{ $t("Import item from sources") }}</h1>
    <form @submit="validate">
      <div class="mb-3">
        <label class="form-label">Source</label>
        <select
          v-model="search.module"
          name="import-source"
          class="form-select"
          aria-label="Import module"
          :required="importType != 'search'"
        >
          <option v-if="importType == 'search'" value="" default>
            {{ $t("All import sources") }}
          </option>
          <template v-for="(importModule, name) in search.modules" :key="name">
            <option :value="name">
              {{ importModule.name }}
              <template v-if="importModule.tags">
                (tags: {{ importModule.tags.join(", ") }})
              </template>
            </option>
          </template>
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
          :disabled="$demoMode() || (importType == 'url' && !search.source)"
        >
          <template v-if="importType == 'url'">
            {{ $t("Import item") }}
          </template>
          <template v-else>
            {{ $t("Search item") }}
          </template>
        </button>
        &nbsp;
        <a href=".." class="btn btn-outline-secondary">
          {{ $t("Cancel") }}
        </a>
      </div>

      <div v-if="$demoMode()" class="alert alert-warning">
        {{ $t("Search disabled in demo mode") }}
      </div>
    </form>

    <Loading v-if="loading" />
    <div v-if="items" class="container items">
      <div v-for="(error, index) in errors" :key="index" class="alert alert-danger" role="alert">
        {{ search.modules[error.module].name + ": " + error.text }}
      </div>
      <template v-if="items.length == 0">
        <Empty :label="$t('Nothing found')" />
      </template>
      <template v-else>
        <template v-for="(item, index) in items" :key="index">
          <div :id="'item-' + index" class="row">
            <div class="col-4 item-cover">
              <Image :url="item.image" :cover="true" />
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
                  Source ({{ search.modules[item.importModule].name }}) <i class="bi bi-box-arrow-up-right"></i>
                </a>
              </p>
              <p>
                <button
                  class="btn btn-primary"
                  :disabled="$demoMode()"
                  @click="importItem(item.importModule, item.source)"
                >
                  {{ $t("Import item") }}
                </button>
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
import Image from "@/components/properties/medias/Image.vue"
import Loading from "@/components/Loading.vue"

export default {
  components: {
    Empty,
    Loading,
    Image,
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
          this.$apiGet("import/modules")
            .then((response) => {
              if (response.data) {
                for (const [name, module] of Object.entries(response.data)) {
                  if (!module.search) {
                    continue
                  }

                  if (this.collection.type && module.tags) {
                    if (!module.tags.includes(this.collection.type)) {
                      continue
                    }
                  }

                  this.search.modules[name] = module
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

      // if url source mode, import item
      if (this.importType == "url") {
        this.importItem(this.search.module, this.search.source)
        return
      }

      // search
      this.loading = true

      let data = {
        params: {
          module: this.search.module,
          source: this.search.source,
          search: this.search.search,
        },
      }

      let modules = [this.search.module]
      if (this.search.module == "") {
        modules = Object.keys(this.search.modules)
      }

      this.items = false
      this.errors = []

      // search
      modules.forEach((module) => {
        data.params.module = module
        this.$apiGet("collections/" + this.$route.params.cid + "/import/search", data)
          .then((response) => {
            if (this.items === false) {
              this.items = []
            }

            if (response.data) {
              response.data.forEach((item) => {
                item.importModule = module
              });
              this.items.push(...response.data)
              this.loading = false
            }
          })
          .catch(() => {
            this.errors.push({
              module: module,
              text: this.$t("An error occured") + " " + this.$t("Please retry")
            })
          })
      });
    },

    importItem(module, source) {
      this.loading = true

      let data = {
        module: module,
        source: source,
      }

      // import
      this.$apiPost("collections/" + this.$route.params.cid + "/import", data)
        .then((response) => {
          let redirection = "../"

          if (response.data) {
            // if imported item id is defined, redirect to item page
            if (response.data.imported && response.data.imported.items.length > 0) {
              redirection += "item/" + response.data.imported.items[0] + "/"
            }
          }

          // redirect to item page or collection
          document.location.href = redirection
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
