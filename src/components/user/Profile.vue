<template>
  <main class="form-signin container">
    <h1>{{ $t("My profile") }}</h1>
    <p>{{ $t("Username") }}: {{ currentUser.username }}</p>
    <h3>{{ $t("Change password") }}</h3>
    <ChangePassword />
    <div v-if="currentUser.username == 'onmyshelf'">
      <hr />
      <h3>{{ $t("Server configuration") }}</h3>
      <ServerConfig />
    </div>
  </main>
</template>

<script>
import ChangePassword from "./ChangePassword.vue"
import ServerConfig from "./ServerConfig.vue"

export default {
  components: {
    ChangePassword,
    ServerConfig,
  },
  created() {
    this.currentUser = this.$currentUser()
  },
}
</script>
