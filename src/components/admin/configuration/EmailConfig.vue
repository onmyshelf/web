<template>
  <div class="container">
    <Error v-if="error" :status="error" />
    <div v-else>
      <Loading v-if="loading" />
      <div v-else class="mb-3">
        <h2>{{ $t("Email configuration") }}</h2>
        <p>
          {{ $t("SMTP server") }}:
          {{ config.smtp_server ? $t("Yes") : $t("No") }}
        </p>
        <p>
          {{ $t("Email from") }}:
          {{ config.email_from }}
        </p>
        <button
          class="btn btn-primary"
          @click="sendEmail()"
          :disabled="$demoMode()"
        >
          <i class="bi bi-send me-1" /> {{ $t("Send me a test email") }}
        </button>
      </div>
    </div>
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
      config: null,
      error: false,
      loading: true,
      success: null,
    }
  },
  created() {
    this.$apiGet("config/email")
      .then((response) => {
        if (response.data) {
          this.config = response.data
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
    sendEmail() {
      this.loading = true

      this.$apiGet("config/email/test")
        .then(() => {
          this.success = true
          this.loading = false
        })
        .catch(() => {
          this.result = {
            error: true,
            text: "Internal error. Please retry.",
          }
        })
    },
  },
}
</script>
