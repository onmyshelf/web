<template>
  <main class="form-signin container">
    <h1 class="h3 mb-3 fw-normal">{{ $t("Ask for borrowing") }}</h1>
    <div v-if="success !== null">
      <SuccessMessage
        :status="success"
        :success="$t('Your borrow request has been sent')"
      />
      <a href="../../">
        <i class="bi-arrow-left me-3" />{{ $t("Return to collection") }}
      </a>
    </div>

    <div v-else>
      <form @submit="validate">
        <div class="mb-3">
          <label class="form-label">
            {{ $t("Firstname") }}
          </label>
          <input
            v-model="form.firstname"
            name="firstname"
            type="text"
            :placeholder="$t('Firstname')"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label">
            {{ $t("Lastname") }}
          </label>
          <input
            v-model="form.lastname"
            name="lastname"
            type="text"
            :placeholder="$t('Lastname')"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">
            {{ $t("Email address") }}
          </label>
          <input
            v-model="form.email"
            name="email"
            type="email"
            class="form-control"
            :placeholder="$t('Email example')"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">
            {{ $t("Borrow request message") }} ({{ $t("optional") }})
          </label>
          <textarea
            v-model="form.message"
            rows="5"
            class="form-control"
            :placeholder="$t('Borrow request message')"
          ></textarea>
        </div>

        <button
          class="w-100 btn btn-lg btn-primary"
          type="submit"
          :disabled="$demoMode() || loading"
        >
          {{ $t("Ask to borrow this item") }}
        </button>
      </form>

      <Loading v-if="loading" />
    </div>
  </main>
</template>

<script>
import Loading from "@/components/Loading.vue"
import SuccessMessage from "@/components/SuccessMessage.vue"

export default {
  components: {
    Loading,
    SuccessMessage,
  },
  data() {
    return {
      form: {},
      loading: false,
      success: null,
    }
  },
  created() {
    // if not logged in, stop here
    if (!this.$isLoggedIn()) {
      return
    }

    // fill form with user profile
    this.$apiGet("users/" + this.$currentUser().id)
    .then((response) => {
      this.form = response.data
    })
  },
  methods: {
    validate(e) {
      // prevent form to reload page
      e.preventDefault()

      this.loading = true

      // copy form object (to avoid cloning events)
      let data = Object.assign({}, this.form)

      this.$apiPost("collections/" + this.$route.params.cid + "/items/" + this.$route.params.id + "/borrow", data)
        .then(() => {
          this.loading = false
          this.success = true
        })
        .catch(() => {
          this.success = false
        })
    },
  },
}
</script>
