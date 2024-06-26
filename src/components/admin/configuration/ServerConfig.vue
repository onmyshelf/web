<template>
  <div class="container">
    <Error v-if="error" :status="error" />
    <template v-else>
      <Loading v-if="loading" />
      <form v-else @submit="validate">
        <h3>{{ $t("Server configuration") }}</h3>

        <template v-for="(value, param) in config" :key="param">
          <div v-if="param != 'version'" class="item-preview mb-3">
            <label class="form-label">{{ $t(param) }}:</label>
            <input v-model="config[param]" type="text" class="form-control" />
          </div>
        </template>

        <div class="input-group mb-3">
          <button
            class="btn btn-outline-secondary"
            type="button"
            id="newKey"
            @click="addConfig()"
          >
            + {{ $t("Add new config key") }}
          </button>
          <input
            v-model="newKey"
            type="text"
            class="form-control"
            placeholder="e.g. custom_api_key"
            aria-label="Example text with button addon"
            aria-describedby="newKey"
          />
        </div>

        <div class="mb-3">
          <button class="btn btn-primary" type="submit" :disabled="$demoMode()">
            {{ $t("Save changes") }}
          </button>
        </div>
      </form>

      <SuccessMessage :status="success" />
    </template>
  </div>
</template>

<script>
import Error from "@/components/Error.vue"
import Loading from "@/components/Loading.vue"
import SuccessMessage from "@/components/SuccessMessage.vue"

export default {
  components: {
    Error,
    Loading,
    SuccessMessage,
  },
  data() {
    return {
      config: {},
      newKey: null,
      success: null,
      error: false,
      loading: true,
    }
  },
  created() {
    // get config
    this.$apiGet("config")
      .then((response) => {
        this.config = response.data
        delete this.config.version
        this.loading = false
      })
      .catch((e) => {
        this.error = this.$apiErrorStatus(e)
      })
  },
  methods: {
    addConfig() {
      if (this.newKey) {
        this.config[this.newKey] = ""
        this.newKey = null
      }
    },
    validate(e) {
      // prevent form to reload page
      e.preventDefault()

      this.loading = true
      this.success = null

      // copy edit object (to avoid cloning events)
      let data = Object.assign({}, this.config)

      // API call
      this.$apiPatch("config", data)
        .then(() => {
          this.loading = false
          this.success = true
        })
        .catch(() => {
          this.loading = false
          this.success = false
        })
    },
  },
}
</script>
