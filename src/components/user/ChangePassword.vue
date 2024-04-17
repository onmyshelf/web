<template>
  <form @submit="changePassword">
    <div v-if="!resetToken" class="form-floating">
      <input
        v-model="oldPassword"
        type="password"
        class="form-control"
        id="oldPassword"
        :placeholder="$t('Current password')"
        required
      />
      <label for="oldPassword">{{ $t("Current password") }}</label>
    </div>

    <div class="form-floating">
      <input
        v-model="newPassword"
        type="password"
        class="form-control"
        id="newPassword"
        :placeholder="$t('New password')"
        required
      />
      <label for="newPassword">{{ $t("New password") }}</label>
    </div>

    <div class="form-floating">
      <input
        v-model="confirmPassword"
        type="password"
        class="form-control"
        id="confirmPassword"
        :placeholder="$t('Confirm new password')"
        required
      />
      <label for="confirmPassword">{{ $t("Confirm new password") }}</label>
    </div>

    <button class="w-100 btn btn-lg btn-primary" type="submit" :disabled="$demoMode()">
      {{ $t("Change password") }}
    </button>

    <div v-if="notSimilar" class="alert alert-danger" role="alert">
      {{ $t("Passwords not equals") }}
    </div>

    <SuccessMessage
      :status="success"
      :success="$t('Password changed')"
      :error="$t('Failed')"
    />
  </form>
</template>

<script>
import SuccessMessage from "@/components/SuccessMessage.vue"

export default {
  props: {
    resetToken: {
      type: String,
    },
  },
  components: {
    SuccessMessage,
  },
  data() {
    return {
      oldPassword: null,
      newPassword: null,
      confirmPassword: null,
      notSimilar: false,
      success: null,
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

      this.success = null

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
          this.success = true
          this.oldPassword = ""
          this.newPassword = ""
          this.confirmPassword = ""
        })
        .catch(() => {
          this.success = false
        })
    },
  },
}
</script>
