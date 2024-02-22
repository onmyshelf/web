<template>
  <form @submit="changePassword">
    <div v-if="!resetToken" class="form-floating">
      <input v-model="oldPassword" type="password" class="form-control" id="oldPassword" :placeholder="$t('Current password')" required>
      <label for="oldPassword">{{ $t("Current password") }}</label>
    </div>
    <div class="form-floating">
      <input v-model="newPassword" type="password" class="form-control" id="newPassword" :placeholder="$t('New password')" required>
      <label for="newPassword">{{ $t("New password") }}</label>
    </div>
    <div class="form-floating">
      <input v-model="confirmPassword" type="password" class="form-control" id="confirmPassword" :placeholder="$t('Confirm new password')" required>
      <label for="confirmPassword">{{ $t("Confirm new password") }}</label>
    </div>
    <button class="w-100 btn btn-lg btn-primary" type="submit" :disabled="$demoMode()">{{ $t("Change password") }}</button>
    <div v-if="success" class="alert alert-success" role="alert">
      {{ $t("Password changed") }}
    </div>
    <div v-if="notSimilar" class="alert alert-danger" role="alert">
      {{ $t("Passwords not equals!") }}
    </div>
    <div v-if="error" class="alert alert-danger" role="alert">{{ $t("Failed!") }}</div>
  </form>
</template>

<script>
export default {
  props: {
    resetToken: {
      type: String,
    },
  },
  data() {
    return {
      oldPassword: null,
      newPassword: null,
      confirmPassword: null,
      notSimilar: false,
      success: false,
      error: false,
    }
  },
  methods: {
    changePassword(e) {
      // prevent form to reload page
      e.preventDefault()

      if (this.newPassword == this.confirmPassword) {
        this.notSimilar = false
      } else {
        this.notSimilar = true
        return
      }

      // API config
      let url = "resetpassword"
      let data = {
        resetToken: this.resetToken,
        newpassword: btoa(this.newPassword),
      }

      // if change password for connected user
      if (!this.resetToken) {
        url = "users/" + this.$currentUser().id + "/password"
        data.password = btoa(this.oldPassword)
      }

      // API request
      this.$apiPost(url, data)
        .then(() => {
          this.error = false
          this.success = true
          this.oldPassword = ""
          this.newPassword = ""
          this.confirmPassword = ""
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
