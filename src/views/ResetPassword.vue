<template>
  <main class="form-signin container">
    <h1 class="h3 mb-3 fw-normal">Password recovery</h1>
    <ChangePassword v-if='resetToken' :resetToken="resetToken"/>
    <div v-else>
      <div v-if="success" class="alert alert-success" role="alert">
        Your request has been sent to the administrator.<br/>
        For more information, please <a href="https://docs.onmyshelf.cm/resetpassword">read documentation here</a>.
      </div>
      <form v-else @submit="askReset">
        <div class="form-floating">
          <input v-model="username" type="text" class="form-control" id="username" placeholder="Username" required>
          <label for="username">Username</label>
        </div>
        <button class="w-100 btn btn-lg btn-primary" type="submit">Ask a password reset</button>
        <div v-if="error" class="alert alert-danger" role="alert">
          Failed! Please retry.
        </div>
      </form>
    </div>
  </main>
</template>

<script>
import axios from 'axios'
import ChangePassword from '@/components/user/ChangePassword.vue'

export default {
  components: {
    ChangePassword
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
      error: false
    }
  },
  methods: {
    askReset(e) {
      // prevent form to reload page
      e.preventDefault()

      axios.post(import.meta.env.VITE_API_URL + '/resetpassword', { username: this.username })
      .then(() => {
        this.success = true
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
