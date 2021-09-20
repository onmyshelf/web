<template>
  <main class="form-signin container">
    <h1>My profile</h1>
    <h3>Change password</h3>
    <ChangePassword />
  </main>
</template>

<script>
import ChangePassword from './ChangePassword.vue'

export default {
  components: {
    ChangePassword
  }
}
</script>
