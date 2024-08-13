<template>
  <div class="container">
    <Error v-if="error" :status="error" />
    <div v-else>
      <Loading v-if="loading" />
      <div v-else class="mb-3">
        <h2>{{ $t("Import modules") }}</h2>
        <Empty v-if="!modules" :label="$t('No modules found')" />
        <template v-else>
          <div v-for="(module, name) of modules" :key="name" class="card mb-3">
            <div :id="'module-' + name" class="card-body">
              <h4 class="card-title">{{ module.name }}</h4>
              <p v-if="module.description" class="card-text">
                {{ module.description }}
              </p>
              <p v-if="module.version" class="card-text">
                {{ $t("Version") }}: {{ module.version }}
              </p>
              <p class="card-text">
                {{ $t("Features") }}:
                <span v-if="module.search" class="badge text-bg-primary ms-2">
                  search
                </span>
                <span
                  v-if="module.importCollection"
                  class="badge text-bg-secondary ms-2"
                >
                  collection import
                </span>
              </p>
              <p v-if="module.tags" class="card-text">
                {{ $t("Tags") }}:
                <span
                  v-for="tag in module.tags"
                  :key="tag"
                  class="badge rounded-pill text-bg-light ms-2"
                >
                  {{ tag }}
                </span>
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Empty from "@/components/Empty.vue"
import Error from "@/components/Error.vue"
import Loading from "@/components/Loading.vue"

export default {
  components: {
    Empty,
    Error,
    Loading,
  },
  data() {
    return {
      modules: null,
      error: false,
      loading: true,
    }
  },
  created() {
    // get import modules
    this.$apiGet("import/modules")
      .then((response) => {
        if (response.data) {
          this.modules = response.data
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
}
</script>
