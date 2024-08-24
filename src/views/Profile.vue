<template>
  <main class="form-signin container">
    <h1>{{ $t("My profile") }}</h1>
    <UserProfile />
    <h3>{{ $t("Change password") }}</h3>
    <ChangePassword />
  </main>
</template>

<script>
import UserProfile from "@/components/user/UserProfile.vue"
import ChangePassword from "@/components/user/ChangePassword.vue"

export default {
  components: {
    ChangePassword,
    UserProfile,
  },
}
</script>
