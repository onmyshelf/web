<template>
  <Error v-if="error" :status="error" />
  <template v-else>
    <div v-if="profile">
      <p>{{ $t("Username") }}: {{ profile.username }}</p>

      <form @submit="validate">
        <div class="mb-3">
          <label class="form-label">{{ $t("Firstname/Lastname") }}</label>
          <input
            v-model="profile.firstname"
            name="firstname"
            type="text"
            :placeholder="$t('Firstname')"
            class="form-control"
          />
          <input
            v-model="profile.lastname"
            name="lastname"
            type="text"
            :placeholder="$t('Lastname')"
            class="form-control"
          />
        </div>
        <div class="mb-3">
          <label class="form-label">{{ $t("Email address") }}</label>
          <input
            v-model="profile.email"
            name="email"
            type="email"
            :placeholder="$t('Email address')"
            class="form-control"
          />
        </div>
        <div class="mb-3">
          <button class="btn btn-primary" type="submit" :disabled="$demoMode()">
            {{ $t("Save changes") }}
          </button>
        </div>
      </form>

      <SuccessMessage :status="success" :success="$t('Profile updated')" />
    </div>
  </template>
</template>

<script>
import Error from "@/components/Error.vue"
import SuccessMessage from "@/components/SuccessMessage.vue"

export default {
  components: {
    Error,
    SuccessMessage,
  },
  data() {
    return {
      profile: {},
      error: false,
      success: null,
    }
  },
  created() {
    // get user profile
    this.$apiGet("users/" + this.$currentUser().id)
      .then((response) => {
        this.profile = response.data
      })
      .catch((e) => {
        this.error = this.$apiErrorStatus(e)
      })
  },
  methods: {
    validate(e) {
      // prevent form to reload page
      e.preventDefault()

      this.success = null

      // copy edit object (to avoid cloning events)
      let data = Object.assign({}, this.profile)

      this.$apiPatch("users/" + this.$currentUser().id, data)
        .then(() => {
          this.success = true
        })
        .catch(() => {
          this.success = false
        })
    },
  },
}
</script>
