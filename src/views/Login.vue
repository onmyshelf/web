<template>
  <main class="form-signin container">
    <DemoWarning v-if="$demoMode() && !$isLoggedIn()" />

    <h1 class="h3 mb-3 fw-normal">{{ $t("Please sign in") }}</h1>

    <form @submit="validate" class="container">
      <div class="form-floating">
        <input
          v-model="login"
          name="login"
          type="text"
          class="form-control"
          :placeholder="$t('Username or email')"
          required
        />
        <label>{{ $t("Username or email") }}</label>
      </div>

      <div class="form-floating">
        <input
          v-model="password"
          type="password"
          class="form-control"
          :placeholder="$t('Password')"
          required
        />
        <label>{{ $t("Password") }}</label>
      </div>

      <button class="w-100 btn btn-lg btn-primary" type="submit">
        {{ $t("Sign in") }}
      </button>

      <SuccessMessage
        :status="success"
        :error="$t('Login failed') + ' ' + $t('Please retry')"
      />

      <div class="mt-3">
        <router-link to="/resetpassword">
          {{ $t("Forgot password") }}
        </router-link>
      </div>
    </form>
  </main>
</template>

<script>
import DemoWarning from "@/components/DemoWarning.vue"
import SuccessMessage from "@/components/SuccessMessage.vue"

export default {
  components: {
    DemoWarning,
    SuccessMessage,
  },
  data() {
    return {
      login: null,
      password: null,
      success: null,
    }
  },
  created() {
    // if already logged in, redirect to homepage
    if (this.$isLoggedIn()) {
      location.href = "/"
    }
  },
  methods: {
    validate(e) {
      // prevent form to reload page
      e.preventDefault()

      this.success = null

      let data = {
        login: this.login,
        password: this.password,
      }

      this.$apiPost("login", data)
        .then((response) => {
          localStorage.setItem("onmyshelf_token", response.data.token)
          localStorage.setItem("onmyshelf_userID", response.data.userid)
          localStorage.setItem("onmyshelf_username", response.data.username)
          localStorage.setItem("onmyshelf_readonly", response.data.readonly)
          location.href = "/"
        })
        .catch(() => {
          this.success = false
        })
    },
  },
}
</script>
