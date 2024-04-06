<template>
  <Error v-if="error" :status="error" />
  <template v-else>
    <div v-if="profile">
      <p>{{ $t("Username") }}: {{ profile.username }}</p>

      <form @submit="validate">
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
          <input
            v-model="profile.password"
            type="password"
            class="form-control"
            :placeholder="$t('Current password')"
            required
          />
        </div>
        <div class="mb-3">
          <button class="btn btn-primary" type="submit" :disabled="$demoMode()">
            {{ $t("Save changes") }}
          </button>
        </div>
      </form>
      <div v-if="success" class="alert alert-success" role="alert">
        {{ $t("Profile updated") }}
      </div>
      <div v-if="success === false" class="alert alert-danger" role="alert">
        {{ $t("Failed!") }} {{ $t("Please retry") }}
      </div>
    </div>
  </template>
</template>

<script>
import Error from "@/components/Error.vue"

export default {
  components: {
    Error,
  },
  data() {
    return {
      profile: {
        password: "",
      },
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

      // copy edit object (to avoid cloning events)
      let data = Object.assign({}, this.profile)
      data.password = btoa(data.password)

      this.$apiPatch("users/" + this.$currentUser().id, data)
        .then(() => {
          this.success = true
        })
        .catch((e) => {
          if (e.response && e.response.status) {
            this.success = false
          }
        })
    },
  },
}
</script>
