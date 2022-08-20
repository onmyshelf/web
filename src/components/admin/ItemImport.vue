<template>
  <div class="container">
    <Error v-if="errors.length > 0" />
    <template v-else>
      <h1>Import item from external sources</h1>
      <form @submit="validate">
        <div class="mb-3">
          <label class="form-label">Source:</label>
          <select v-model="search.module" class="form-select" aria-label="Type of import" required>
            <template v-for="(importModule, name) in search.modules" :key="name">
              <option v-if="importModule.search" :value="name">{{ importModule.name }} {{ moduleTags(importModule.tags) }}</option>
            </template>
          </select>
        </div>

        <div v-if="search.module && search.modules[search.module].requiredSource" class="mb-3">
          <MediaSelector v-model="search.source" :type="search.module" mandatory="true" />
        </div>

        <div class="mb-3">
          <label class="form-label">Search:</label>
          <input v-model="search.search" name="search" type="text" class="form-control" placeholder="Search your item here" required />
        </div>

        <div class="mb-3">
          <button class="btn btn-primary" type="submit">Search item</button>&nbsp;
          <a href=".." class="btn btn-outline-secondary">Cancel</a>
        </div>
      </form>
    </template>
    
    <Loading v-if="loading" />
    <div v-else>
      <div v-if="items" class="container items">
        <template v-if="items.length == 0">
          <Empty label="Nothing found" />
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
                  <a :id="'item-source-' + index" :href="item.source" target="_blank">
                    Source <i class="bi bi-box-arrow-up-right"></i>
                  </a>
                </p>
                <p>
                  <button @click="importItem(index)" class="btn btn-primary" :disabled="$demoMode()">
                    Import item
                  </button>
                </p>
              </div>
            </div>
            <div v-if="false" class="accordion" id="accordionExample">
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    Import item information
                  </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div class="accordion-body">
                    <table class="table">
                      <thead>
                        <tr>
                          <th scope="col">Property</th>
                          <th scope="col">Item property</th>
                          <th scope="col">Options</th>
                          <th scope="col">Preview</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">title</th>
                          <td>
                            <select class="form-select" aria-label="Destination property">
                              <option value="key">title</option>
                              <option value="key"></option>
                            </select>
                          </td>
                          <td>
                            <select class="form-select" aria-label="Options">
                              <option value="key"></option>
                            </select>
                          </td>
                          <td>{{ trimPreview(item.name) }}</td>
                        </tr>
                        <tr>
                          <th scope="row">cover</th>
                          <td>
                            <select class="form-select" aria-label="Destination property">
                              <option value="key">image</option>
                              <option value="key"></option>
                            </select>
                          </td>
                          <td>
                            <select class="form-select" aria-label="Options">
                              <option value="key"></option>
                              <option value="key">download</option>
                            </select>
                          </td>
                          <td>{{ trimPreview(item.image) }}</td>
                        </tr>
                        <tr>
                          <th scope="row">description</th>
                          <td>
                            <select class="form-select" aria-label="Destination property">
                              <option value="key">description</option>
                            </select>
                          </td>
                          <td>
                            <select class="form-select" aria-label="Options">
                              <option value="key">to string</option>
                            </select>
                          </td>
                          <td>{{ trimPreview(item.description) }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <p>
                      <button class="btn btn-primary">Import into item</button>
                    </p>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked>
                      <label class="form-check-label" for="flexCheckChecked">
                        Remember my choices
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue"
import Empty from "@/components/Empty.vue"
import Image from "@/components/properties/medias/Image.vue"
import MediaSelector from "./properties/MediaSelector.vue"

export default {
  components: {
    Empty,
    Error,
    Loading,
    Image,
    MediaSelector,
  },
  data() {
    return {
      search: {
        module: "",
        source: "",
        search: "",
        modules: [],
      },
      items: false,
      errors: [],
      loading: true,
      help: {},
    }
  },
  created() {
    // get import modules
    this.$apiGet("import/modules")
      .then((response) => {
        if (response.data) {
          this.search.modules = response.data
          this.loading = false
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
    trimPreview(string) {
      return String(string).substring(0, 50)
    },
    validate(e) {
      // prevent form to reload page
      e.preventDefault()

      this.loading = true

      let data = {
        params: {
          module: this.search.module,
          source: this.search.source,
          search: this.search.search,
        },
      }

      // search
      this.$apiGet("collections/" + this.$route.params.cid + "/import/search", data)
        .then((response) => {
          if (response.data) {
            this.items = response.data
            this.loading = false
          }
        })
        .catch(() => {
          this.result = {
            success: false,
            text: "Internal error. Please retry."
          }
        })
    },
    importItem(id) {
      this.loading = true

      let data = {
        module: this.search.module,
        source: document.getElementById("item-source-" + id).getAttribute("href"),
      }

      // search
      this.$apiPost("collections/" + this.$route.params.cid + "/import", data)
        .then((response) => {
          if (response.data) {
            this.items = response.data
            document.location.href = "../"
          }
        })
        .catch(() => {
          this.result = {
            success: false,
            text: "Internal error. Please retry."
          }
        })
    },
    moduleTags(tags) {
      if (tags) {
        return "(tags: " + tags.join(", ") + ")"
      } else {
        return ""
      }
    },
  },
}
</script>
