<template>
  <main class="form-signin container">
    <h1 class="h3 mb-3 fw-normal">{{ $t("Reset password") }}</h1>
    <ChangePassword v-if="resetToken" :resetToken="resetToken" />
    <div v-else>
      <SuccessMessage
        v-if="success !== null"
        :status="success"
        :success="$t('Reset password link sent') + ' ' + $t('Reset password link trouble')"
      />
      <form v-else @submit="askReset">
        <div class="form-floating">
          <input
            v-model="username"
            name="username"
            type="text"
            class="form-control"
            :placeholder="$t('Username')"
            required
          />
          <label>{{ $t("Username")}} </label>
        </div>
        <button
          class="w-100 btn btn-lg btn-primary"
          type="submit"
          :disabled="$demoMode()"
        >
          {{ $t("Ask password reset") }}
        </button>
      </form>
    </div>
  </main>
</template>

<script>
import ChangePassword from "@/components/user/ChangePassword.vue"
import SuccessMessage from "@/components/SuccessMessage.vue"

export default {
  components: {
    ChangePassword,
    SuccessMessage,
  },
  created() {
    if (this.$route.query.token) {
      this.resetToken = this.$route.query.token
    }
  },
  data() {
    return {
      username: null,
      resetToken: null,
      success: null,
    }
  },
  methods: {
    askReset(e) {
      // prevent form to reload page
      e.preventDefault()

      this.$apiPost("resetpassword", { username: this.username })
        .then(() => {
          this.success = true
        })
        .catch(() => {
          this.success = false
        })
    },
  },
}
</script>
