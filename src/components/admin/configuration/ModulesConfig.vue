<template>
  <div class="container">
    <Error v-if="error" :status="error" />
    <div v-else>
      <Loading v-if="loading" />
      <div v-else class="mb-3">
        <h2>{{ $t("Import modules") }}</h2>

        <div v-if="upgradable" class="mb-3 text-end">
          <button
            class="btn btn-success"
            :disabled="$demoMode() || upgrade"
            @click="upgradeModule()"
          >
            <span
              v-if="upgrade"
              class="spinner-border spinner-border-sm"
              aria-hidden="true"
            />
            <i v-else class="bi bi-cloud-arrow-down" />
            <span class="ms-2">{{ $t("Upgrade all modules") }}</span>
          </button>
        </div>

        <Empty v-if="!modules" :label="$t('No modules found')" />
        <template v-else>
          <ModuleCard
            v-for="(module, name) of modules"
            :key="name"
            :name="name"
            :module="module"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Empty from "@/components/Empty.vue"
import Error from "@/components/Error.vue"
import Loading from "@/components/Loading.vue"
import ModuleCard from "./modules/ModuleCard.vue"

export default {
  components: {
    Empty,
    Error,
    Loading,
    ModuleCard,
  },
  data() {
    return {
      modules: null,
      upgradable: false,
      error: false,
      loading: true,
      upgrade: false,
    }
  },
  created() {
    // get installed modules
    this.$apiGet("modules/import")
      .then((response) => {
        if (response.data) {
          this.modules = response.data
          Object.keys(this.modules).forEach((name) => {
            if (this.modules[name].external) {
              this.upgradable = true
              return
            }
          })
        }

        this.loading = false
      })
      .catch(() => {
        this.result = {
          error: true,
          text: "Internal error. Please retry.",
        }
      })
  },
  methods: {
    upgradeModule() {
      this.upgrade = true

      this.$apiGet("modules/upgrade")
        .then((response) => {
          if (response.data) {
            location.reload()
          }
        })
        .catch(() => {
          this.result = {
            error: true,
            text: "Internal error. Please retry.",
          }
        })
    }
  },
}
</script>
