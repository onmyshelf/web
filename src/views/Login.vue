<template>
  <main class="form-signin container">
    <h1 class="h3 mb-3 fw-normal">Please sign in</h1>
    <form @submit="login">
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
      <p>
        <router-link to="/resetpassword">Forgot password?</router-link>
      </p>
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

      axios.post(process.env.VUE_APP_API_URL + '/login',
        { username: this.username, password: this.password }
      )
      .then(response => {
        localStorage.setItem('onmyshelf_token', response.data.token)
        localStorage.setItem('onmyshelf_userID', response.data.userid)
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
