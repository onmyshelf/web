<template>
  <main class="form-signin container">
    <h1 class="h3 mb-3 fw-normal">Password recovery</h1>
    <ChangePassword v-if='resetToken' :resetToken="resetToken"/>
    <div v-else>
      <div v-if="success" class="alert alert-success" role="alert">
        Your request has been sent to the administrator.<br/>
        For more information, please <a href="https://docs.onmyshelf.cm/user-guide/#reset-user-password">read documentation here</a>.
      </div>
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
          <label>Username</label>
        </div>
        <button class="w-100 btn btn-lg btn-primary" type="submit" :disabled="$demoMode()">
          {{ $t("Ask password reset") }}
        </button>
        <div v-if="error" class="alert alert-danger" role="alert">
          {{ $t("Failed, please retry") }}
        </div>
      </form>
    </div>
  </main>
</template>

<script>
import ChangePassword from "@/components/user/ChangePassword.vue"

export default {
  components: {
    ChangePassword,
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
      success: false,
      error: false,
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
        .catch(e => {
          if (e.response && e.response.status) {
            this.error = true
          }
        })
    },
  },
}
</script>
