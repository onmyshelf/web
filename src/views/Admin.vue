<template>
  <div v-if="isLoggedIn" class="container">
    <h1>Dashboard</h1>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false
    }
  },
  created() {
    // check if logged in
    if (this.$isLoggedIn()) {
      this.isLoggedIn = true
    } else {
      document.location.href="/login"
    }
  }
}
</script>
