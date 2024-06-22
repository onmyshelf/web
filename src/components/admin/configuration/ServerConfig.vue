<template>
  <div class="container">
    <Error v-if="error" :status="error" />
    <template v-else>
      <Loading v-if="loading" />
      <form v-else @submit="validate">
        <h3>{{ $t("Server configuration") }}</h3>

        <template v-for="(value, param) in config" :key="param">
          <div class="item-preview mb-3">
            <template v-if="param == 'loans'">
              <label class="form-label">{{ $t("Enable loans") }}:</label>
              <YesNo v-model="config[param]" />
            </template>

            <template v-else>
              <label class="form-label">{{ $t(param) }}:</label>
              <input v-model="config[param]" type="text" class="form-control" />
            </template>
          </div>
        </template>

        <div class="input-group mb-3">
          <button
            class="btn btn-outline-secondary"
            type="button"
            id="newKey"
            @click="addConfig()"
          >
            {{ $t("Add config key") }}:
          </button>
          <input
            v-model="newKey"
            type="text"
            class="form-control"
            :placeholder="$t('Config key exemple')"
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

      <SuccessMessage :status="success" :details="details" />
    </template>
  </div>
</template>

<script>
import Error from "@/components/Error.vue"
import Loading from "@/components/Loading.vue"
import SuccessMessage from "@/components/SuccessMessage.vue"
import YesNo from "@/components/admin/properties/YesNo.vue"

export default {
  components: {
    Error,
    Loading,
    SuccessMessage,
    YesNo,
  },
  data() {
    return {
      config: {},
      newKey: null,
      success: null,
      error: false,
      details: null,
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
        .catch((e) => {
          this.loading = false
          this.success = false
          if (e.response.data && e.response.data.error) {
            this.details = e.response.data.error
          }
        })
    },
  },
}
</script>
