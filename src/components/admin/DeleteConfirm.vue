<template>
  <div class="container delete-confirm">
    <h5>
      {{ $t("Confirm delete " + obj) }} <span class="object-id">{{ id }}</span> ?
    </h5>

    <p v-if="consequences">{{ $t("Delete " + obj + " consequences") }}</p>

    <p>{{ $t("Operation cannot be undone") }}</p>

    <button
      type="button"
      id="deleteButton"
      class="btn btn-danger"
      @click="clickConfirm"
      :disabled="$demoMode() || loading"
    >
      {{ $t("Delete " + obj) }}
    </button>
    &nbsp;
    <a :href="cancelUrl" id="cancelButton" class="btn btn-outline-secondary">
      {{ $t("Cancel") }}
    </a>
    <Loading v-if="loading" class="mt-3" />
  </div>
</template>

<style scoped>
.delete-confirm {
  text-align: center;
  margin-top: 100px;
}

.object-id {
  font-weight: bold;
  font-style: italic;
}
</style>

<script>
import Loading from "@/components/Loading.vue"

export default {
  props: {
    obj: {
      required: true,
    },
    id: {
      required: true,
    },
    action: {
      required: true,
    },
    consequences: {
      default: false,
    },
    cancelUrl: {
      default: ".",
    },
  },
  components: {
    Loading,
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    clickConfirm() {
      this.loading = true
      // run parent function
      this.$parent[this.action]()
    }
  },
}
</script>
