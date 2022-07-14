<template>
  <div class="container">
    <Error v-if="errors.length > 0" />
    <template v-else>
      <Loading v-if="loading"/>
      <form v-else @submit="validate">
        <template v-for="(value, param) in config" :key="param" >
          <div v-if="param != 'version'" class="item-preview mb-3">
            <label class="form-label">{{ param }}:</label>
            <input v-model="config[param]" type="text" class="form-control">
          </div>
        </template>

        <div class="mb-3">
          <button class="btn btn-primary" type="submit" :disabled="$demoMode()">
            Save changes
          </button>
        </div>
      </form>
      <div v-if="success" class="alert alert-success" role="alert">
        Config changed
      </div>
      <div v-if="error" class="alert alert-danger" role="alert">Failed!</div>
    </template>
  </div>
</template>

<script>
import Error from "@/components/Error.vue"
import Loading from "@/components/Loading.vue"

export default {
  components: {
    Error,
    Loading,
  },
  data() {
    return {
      config: {},
      success: false,
      error: false,
      errors: [],
      loading: true,
    }
  },
  created() {
    // get config
    this.$apiGet("config")
      .then((response) => {
        this.config = response.data
        this.loading = false
      })
      .catch((e) => {
        this.errors.push(e)
      })
  },
  methods: {
    validate(e) {
      // prevent form to reload page
      e.preventDefault()

      // copy edit object (to avoid cloning events)
      let data = Object.assign({}, this.config)

      // API call
      this.$apiPatch("config", data)
        .then(() => {
          this.success = true
        })
        .catch(() => {
          this.error = true
        })
    },
  },
}
</script>
