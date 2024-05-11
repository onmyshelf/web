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
      <form v-else @submit="validate">
        <div class="form-floating">
          <input
            v-model="login"
            name="username"
            type="text"
            class="form-control"
            :placeholder="$t('Username or email')"
            required
          />
          <label>{{ $t("Username or email")}} </label>
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
  data() {
    return {
      login: null,
      resetToken: null,
      success: null,
    }
  },
  created() {
    // if already logged in, redirect to homepage
    if (this.$isLoggedIn()) {
      location.href = "/"
    }

    if (this.$route.query.token) {
      this.resetToken = this.$route.query.token
    }
  },
  methods: {
    validate(e) {
      // prevent form to reload page
      e.preventDefault()

      this.$apiPost("resetpassword", { login: this.login })
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
