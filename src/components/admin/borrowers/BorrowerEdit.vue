<template>
  <div class="container">
    <h1>
      {{ id ? $t("Edit borrower") : $t("Create new borrower") }}
    </h1>
    <Loading v-if="loading" />
    <form v-else @submit="validate">
      <div class="mb-3">
        <label class="form-label">
          {{ $t("Firstname") }}
        </label>
        <input
          v-model="edit.firstname"
          name="firstname"
          type="text"
          :placeholder="$t('Firstname')"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label class="form-label">
          {{ $t("Lastname") }} ({{ $t("optional") }})
        </label>
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

      <div class="mb-3">
        <button
          type="submit"
          class="btn btn-primary me-3"
          :disabled="$demoMode()"
        >
          {{ id ? $t("Save changes") : $t("Create borrower") }}
        </button>
        <a href="./" class="btn btn-outline-secondary">
          {{ $t("Cancel") }}
        </a>
      </div>
    </form>
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue"

export default {
  components: {
    Loading,
  },

  data() {
    return {
      loading: false,
      id: this.$route.params.id,
      edit: {},
    }
  },

  created() {
    // if new borrower, stop here
    if (!this.id) {
      return
    }

    this.loading = true

    // get borrower profile
    this.$apiGet("borrowers/" + this.id)
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

      // API call
      if (this.id) {
        // modify borrower
        this.$apiPatch("borrowers/" + this.id, data).then(() => {
          document.location.href = "./"
        })
      } else {
        // create new borrower
        this.$apiPost("borrowers", data).then(() => {
          document.location.href = "./"
        })
      }
    },
  },
}
</script>
