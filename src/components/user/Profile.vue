<template>
  <main class="form-signin container">
    <h1>My profile</h1>
    <p>Username: {{currentUser.username}}</p>
    <h3>Change password</h3>
    <ChangePassword />
  </main>
</template>

<script>
import ChangePassword from './ChangePassword.vue'

export default {
  components: {
    ChangePassword
  },
  created() {
    this.currentUser = this.$currentUser()
  }
}
</script>
