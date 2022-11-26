<template>
  <main class="form-signin container">
    <h1 class="h3 mb-3 fw-normal">{{ $t("Please sign in") }}</h1>
    <DemoWarning />
    <form @submit="login" class="container">
      <div class="form-floating">
        <input
          v-model="username"
          name="username"
          type="text"
          class="form-control"
          :placeholder="$t('Username')"
          required
        />
        <label>{{ $t("Username") }}</label>
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
      <div v-if="error" class="alert alert-danger" role="alert">
        {{ $t("Login failed") }} {{ $t("Please retry") }}
      </div>
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

export default {
  components: {
    DemoWarning,
  },
  data() {
    return {
      username: null,
      password: null,
      error: null,
    }
  },
  methods: {
    login(e) {
      // prevent form to reload page
      e.preventDefault()

      this.$apiPost("login", { username: this.username, password: btoa(this.password) })
        .then((response) => {
          localStorage.setItem("onmyshelf_token", response.data.token)
          localStorage.setItem("onmyshelf_userID", response.data.userid)
          localStorage.setItem("onmyshelf_username", this.username)
          localStorage.setItem("onmyshelf_readonly", response.data.readonly)
          document.location.href = "/"
        })
        .catch((e) => {
          if (e.response && e.response.status) {
            this.error = true
          }
        })
    },
  },
}
</script>
