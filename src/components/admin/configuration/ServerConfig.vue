<template>
  <div class="container">
    <Error v-if="error" :status="error" />
    <template v-else>
      <Loading v-if="loading" />
      <form v-else @submit="validate">
        <template v-for="(value, param) in config" :key="param">
          <div class="item-preview mb-3">
            <label class="form-label">
              <template v-if="knownConfig[param]">
                {{ $t(knownConfig[param].label) }}:
              </template>
              <template v-else>{{ $t(param) }}:</template>
            </label>
            <YesNo
              v-if="knownConfig[param] && knownConfig[param].type == 'boolean'"
              v-model="config[param]"
            />
            <PasswordEdit
              v-else-if="param.includes('password') || param.includes('apikey')"
              v-model="config[param]"
              showButton="true"
            />
            <input
              v-else
              v-model="config[param]"
              type="text"
              :placeholder="$t('Value')"
              class="form-control"
            />
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
import PasswordEdit from "@/components/admin/properties/PasswordEdit.vue"
import SuccessMessage from "@/components/SuccessMessage.vue"
import YesNo from "@/components/admin/properties/YesNo.vue"

export default {
  components: {
    Error,
    Loading,
    PasswordEdit,
    SuccessMessage,
    YesNo,
  },
  data() {
    return {
      config: {},
      knownConfig: {
        loans: {
          type: "boolean",
          label: "Enable loans",
        },
      },
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
      if (this.newKey && !(this.newKey in this.config)) {
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
