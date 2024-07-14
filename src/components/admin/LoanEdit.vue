<template>
  <div class="container">
    <Error v-if="error" :status="error" />
    <template v-else>
      <h1>{{ id ? $t("Edit loan") : $t("New loan") }}</h1>

      <Loading v-if="loading" />
      <form v-else @submit="validate">
        <div class="mb-3">
          <label class="form-label">{{ $t("Loan state") }}</label>
          <LoanState
            v-model="edit.state"
            @change="prepareDate()"
            :disabled="$route.query.state"
          />
        </div>

        <div
          v-if="edit.state == 'lent' || edit.state == 'returned'"
          class="mb-3"
        >
          <label class="form-label">{{ $t("Lent on") }}</label>
          <div class="input-group">
            <input
              v-model="lent.date"
              type="date"
              class="form-control"
              required
              @change="updateLent()"
            />
            <input
              v-model="lent.time"
              type="time"
              class="form-control"
              required
              @change="updateLent()"
            />
          </div>
        </div>

        <div v-if="edit.state == 'returned'" class="mb-3">
          <label class="form-label">{{ $t("Returned on") }}</label>
          <div class="input-group">
            <input
              v-model="returned.date"
              type="date"
              class="form-control"
              :min="lent.date"
              :max="currentDate().toISOString().split('T')[0]"
              required
              @change="updateReturned()"
            />
            <input
              v-model="returned.time"
              type="time"
              class="form-control"
              required
              @change="updateReturned()"
            />
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">{{ $t("Borrower name") }}</label>
          <input
            v-model="edit.borrower"
            name="borrower"
            type="text"
            class="form-control"
            :placeholder="$t('Borrower name example')"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">
            {{ $t("Notes") }} ({{ $t("optional") }})
          </label>
          <textarea
            v-model="edit.notes"
            :placeholder="$t('Loan notes example')"
            rows="3"
            class="form-control"
          ></textarea>
        </div>

        <div class="mb-3">
          <button
            type="submit"
            class="btn btn-primary me-3"
            :disabled="$demoMode()"
          >
            {{ id ? $t("Save changes") : $t("Create loan") }}
          </button>
          <a href="../?tab=Loans" class="btn btn-outline-secondary">
            {{ $t("Cancel") }}
          </a>
        </div>
      </form>
    </template>
  </div>
</template>

<script>
import Error from "@/components/Error.vue"
import Loading from "@/components/Loading.vue"
import LoanState from "./properties/LoanState.vue"

export default {
  components: {
    Error,
    Loading,
    LoanState,
  },
  data() {
    return {
      loading: true,
      error: false,
      id: this.$route.params.id,
      edit: { state: "lent" },
      lent: {
        date: null,
        time: null,
      },
      returned: {
        date: null,
        time: null,
      },
    }
  },
  created() {
    // new loan: do not load data
    if (!this.id) {
      this.loading = false
      this.prepareDate()
      return
    }

    // get loan details
    this.$apiGet("collections/" + this.$route.params.cid + "/items/" + this.$route.params.iid + "/loans/" + this.id)
      .then((response) => {
        this.edit = response.data

        // transform timestamps to dates
        let date = new Date();
        let tzoffset = date.getTimezoneOffset() * 60000;

        if (this.edit.lent) {
          this.lent.date = new Date(this.edit.lent * 1000 - tzoffset).toISOString().split("T")[0]
          this.lent.time = new Date(this.edit.lent * 1000 - tzoffset).toISOString().split("T")[1].substring(0, 5)
        }
        if (this.edit.returned) {
          this.returned.date = new Date(this.edit.returned * 1000 - tzoffset).toISOString().split("T")[0]
          this.returned.time = new Date(this.edit.returned * 1000 - tzoffset).toISOString().split("T")[1].substring(0, 5)
        }

        // end of loading
        this.loading = false

        // set state from options
        if (this.$route.query.state) {
          this.edit.state = this.$route.query.state
        }
      })
      .catch((e) => {
        this.error = this.$apiErrorStatus(e)
      })
  },
  methods: {
    currentDate() {
      let date = new Date();
      let tzoffset = date.getTimezoneOffset() * 60000;

      return new Date(date.getTime() - tzoffset)
    },
    prepareDate() {
      let date = new Date();
      let tzoffset = date.getTimezoneOffset() * 60000;

      if (!this.edit.lent && this.edit.state == "lent") {
        this.lent = {
          date: this.currentDate().toISOString().split("T")[0],
          time: this.currentDate().toISOString().split("T")[1].substring(0, 5),
        }
        this.edit.lent = new Date(this.lent.date + " " + this.lent.time).getTime() / 1000
      }
      if (!this.edit.returned && this.edit.state == "returned") {
        this.returned = {
          date: this.currentDate().toISOString().split("T")[0],
          time: this.currentDate().toISOString().split("T")[1].substring(0, 5),
        }
        this.edit.returned = new Date(this.returned.date + " " + this.returned.time).getTime() / 1000
      }
    },
    updateLent() {
      let date = new Date();
      let tzoffset = date.getTimezoneOffset() * 60000;

      if (!this.lent.time) {
        if (this.lent.date) {
          this.lent.time = this.currentDate().toISOString().split("T")[1].substring(0, 5)
        } else {
          this.lent.time = null
        }
      }
      this.edit.lent = new Date(this.lent.date + " " + this.lent.time).getTime() / 1000
    },
    updateReturned() {
      let date = new Date();
      let tzoffset = date.getTimezoneOffset() * 60000;

      if (!this.returned.time) {
        if (this.returned.date) {
          this.returned.time = this.currentDate().toISOString().split("T")[1].substring(0, 5)
        } else {
          this.returned.time = null
        }
      }
      this.edit.returned = new Date(this.returned.date + " " + this.returned.time).getTime() / 1000
    },
    validate(e) {
      // prevent form to reload page
      e.preventDefault()

      // copy edit object (to avoid cloning events)
      let data = Object.assign({}, this.edit)

      // API call
      if (this.id) {
        // modify
        this.$apiPatch("collections/" + this.$route.params.cid + "/items/" + this.$route.params.iid + "/loans/" + this.id, data)
        .then(() => {
          document.location.href = "../?tab=Loans"
        })
      } else {
        // create
        this.$apiPost("collections/" + this.$route.params.cid + "/items/" + this.$route.params.iid + "/loans/", data)
        .then(() => {
          document.location.href = "../?tab=Loans"
        })
      }
    },
  },
}
</script>
