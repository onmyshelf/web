<template>
  <main class="form-signin container">
    <h1 class="h3 mb-3 fw-normal">Please sign in</h1>
    <div v-if="$demoMode() && !$isLoggedIn()" class="alert alert-info" role="alert">
      <p>This is a demo instance. You can log in with the following credentials:</p>
      <ul>
        <li>Username: <strong>onmyshelf</strong></li>
        <li>Password: <strong>onmyshelf</strong></li>
      </ul>
      <p>Please note that in demo mode, you can explore all features, but not make any changes.</p>
    </div>
    <form @submit="login" class="container">
      <div class="form-floating">
        <input v-model="username" type="text" class="form-control" id="floatingInput" placeholder="Username" required>
        <label for="floatingInput">Username</label>
      </div>
      <div class="form-floating">
        <input v-model="password" type="password" class="form-control" id="floatingPassword" placeholder="Password" required>
        <label for="floatingPassword">Password</label>
      </div>
      <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
      <div v-if="error" class="alert alert-danger" role="alert">
        Login failed!
      </div>
      <div class="mt-3">
        <router-link to="/resetpassword">Forgot password?</router-link>
      </div>
    </form>
  </main>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      username: null,
      password: null,
      error: null
    }
  },
  methods: {
    login(e) {
      // prevent form to reload page
      e.preventDefault()

      axios.post(import.meta.env.VITE_API_URL + '/login',
        { username: this.username, password: this.password }
      )
      .then(response => {
        localStorage.setItem('onmyshelf_token', response.data.token)
        localStorage.setItem('onmyshelf_userID', response.data.userid)
        localStorage.setItem('onmyshelf_username', this.username)
        localStorage.setItem('onmyshelf_readonly', response.data.readonly)
        document.location.href = '/'
      })
      .catch(e => {
        if (e.response && e.response.status) {
          this.error = true
        }
      })
    }
  }
}
</script>
