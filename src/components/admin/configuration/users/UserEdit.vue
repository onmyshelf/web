<template>
  <div class="container">
    <h1>
      {{ id ? $t("Edit user") : $t("Create new user") }}
    </h1>
    <Loading v-if="loading" />
    <form v-else @submit="validate">
      <div class="mb-3">
        <label class="form-label">{{ $t("Username") }}</label>
        <input
          v-model="edit.username"
          name="username"
          type="text"
          class="form-control"
          required
          :disabled="id"
        />
      </div>

      <template v-if="!id">
        <div class="mb-3">
          <label class="form-label">{{ $t("New password") }}</label>
          <input
            v-model="edit.newPassword"
            type="password"
            class="form-control"
            :placeholder="$t('New password')"
            required
          />
          <input
            v-model="edit.confirmPassword"
            type="password"
            class="form-control"
            :placeholder="$t('Confirm new password')"
            required
          />
        </div>
      </template>

      <div class="mb-3">
        <label class="form-label">
          {{ $t("Firstname/Lastname") }} ({{ $t("optional") }})
        </label>
        <input
          v-model="edit.firstname"
          name="firstname"
          type="text"
          :placeholder="$t('Firstname')"
          class="form-control"
        />
        <input
          v-model="edit.lastname"
          name="lastname"
          type="text"
          :placeholder="$t('Lastname')"
          class="form-control"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">
          {{ $t("Email address") }} ({{ $t("optional") }})
        </label>
        <input
          v-model="edit.email"
          name="email"
          type="email"
          class="form-control"
          :placeholder="$t('Email example')"
        />
      </div>

      <YesNo
        v-model="edit.enabled"
        :label="edit.enabled ? $t('Account is enabled') : $t('Account is disabled')"
        class="mb-3"
      />

      <div class="mb-3">
        <label class="form-label">
          {{ $t("Avatar") }} ({{ $t("optional") }})
        </label>
        <MediaSelector type="image" v-model="edit.avatar" />
      </div>

      <div v-if="notSimilar" class="alert alert-danger" role="alert">
        {{ $t("Passwords not equals") }}
      </div>

      <div class="mb-3">
        <button
          type="submit"
          class="btn btn-primary me-3"
          :disabled="$demoMode()"
        >
          {{ id ? $t("Save changes") : $t("Create user") }}
        </button>
        <a href="." class="btn btn-outline-secondary">
          {{ $t("Cancel") }}
        </a>
      </div>
    </form>
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue"
import MediaSelector from "@/components/admin/properties/MediaSelector.vue"
import YesNo from "@/components/admin/properties/YesNo.vue"

export default {
  components: {
    Loading,
    MediaSelector,
    YesNo,
  },

  data() {
    return {
      loading: false,
      id: this.$route.params.id,
      edit: {
        username: null,
        newPassword: null,
        confirmPassword: null,
        email: null,
        enabled: true,
        avatar: null,
      },
      notSimilar: false,
    }
  },

  created() {
    // if new user, stop here
    if (!this.id) {
      return
    }

    this.loading = true

    // get user profile
    this.$apiGet("users/" + this.id)
    .then((response) => {
      this.edit = response.data

      // end of loading
      this.loading = false
    })
  },
  methods: {
    validate(e) {
      // prevent form to reload page
      e.preventDefault()

      // copy edit object (to avoid cloning events)
      let data = Object.assign({}, this.edit)

      if (data.newPassword) {
        if (data.newPassword == data.confirmPassword) {
          this.notSimilar = false
        } else {
          this.notSimilar = true
          return
        }

        delete data.confirmPassword
      }

      if (!data.enabled) {
        data.enabled = false
      }

      // API call
      if (this.id) {
        // modify user
        this.$apiPatch("users/" + this.id, data).then(() => {
          document.location.href = "/config/users/"
        })
      } else {
        // create new user
        this.$apiPost("users", data).then(() => {
          document.location.href = "/config/users/"
        })
      }
    },

    defaultName() {
      if (this.id || this.changedName) {
        return
      }

      let translationKey = "Collection name example for " + this.edit.type
      let translation = this.$t(translationKey)

      // default translation
      if (translation == translationKey) {
        this.edit.name = ""
        translation = this.$t("Collection name example")
      } else {
        this.edit.name = translation
      }

      this.placeholderName = this.$t("e.g.") + " " + translation
    },
  },
}
</script>
