<template>
  <main class="form-signin container">
    <h1>{{ $t("My profile") }}</h1>
    <Profile />
    <h3>{{ $t("Change password") }}</h3>
    <ChangePassword />
  </main>
</template>

<script>
import Profile from "@/components/user/Profile.vue"
import ChangePassword from "@/components/user/ChangePassword.vue"

export default {
  components: {
    Profile,
    ChangePassword,
  },
}
</script>
