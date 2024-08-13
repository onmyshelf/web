<template>
  <div class="container delete-confirm">
    <h5>
      {{ $t("Confirm delete " + obj) }} <span class="object-id">{{ id }}</span> ?
    </h5>

    <slot></slot>

    <p>{{ $t("Operation cannot be undone") }}</p>

    <div class="mb-3">
      <button
        type="button"
        id="deleteButton"
        class="btn btn-danger me-2"
        @click="clickConfirm"
        :disabled="$demoMode() || loading"
      >
        {{ $t("Delete " + obj) }}
      </button>
      <a :href="cancelUrl" id="cancelButton" class="btn btn-outline-secondary">
        {{ $t("Cancel") }}
      </a>
    </div>

    <Loading v-if="loading" class="mt-3" />
    <SuccessMessage :status="success" />
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
import SuccessMessage from "@/components/SuccessMessage.vue"

export default {
  props: {
    obj: {
      required: true,
    },
    id: {
      required: true,
    },
    url: {
      required: true,
    },
    successUrl: {
      default: "../..",
    },
    cancelUrl: {
      default: ".",
    },
  },
  components: {
    Loading,
    SuccessMessage,
  },
  data() {
    return {
      loading: false,
      success: null,
    }
  },
  methods: {
    clickConfirm() {
      this.loading = true
      this.success = null

      // API call
      this.$apiDelete(this.url + "/" + this.id)
        .then(() => {
          document.location.href = this.successUrl
        })
        .catch(() => {
          this.loading = false
          this.success = false
        })
    }
  },
}
</script>
