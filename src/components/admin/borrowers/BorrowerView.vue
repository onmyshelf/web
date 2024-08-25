<template>
  <Error v-if="error" :status="error" />
  <div v-else>
    <h1>{{ $t("Borrower") }}</h1>
    <p v-if="borrower">
      {{ borrower.firstname }} {{ borrower.lastname }}
      <span v-if="borrower.email">({{ borrower.email }})</span>
    </p>
    <div class="mb-3">
      <router-link to="edit" class="btn btn-primary me-3">
        <i class="bi-pencil" /> {{ $t("Edit borrower") }}
      </router-link>
      <router-link
        v-if="!loans || loans.length == 0"
        to="delete"
        class="btn btn-danger"
      >
        <i class="bi-x-lg" /> {{ $t("Delete borrower") }}
      </router-link>

      <Loading v-if="loading" />

      <div v-if="loans && loans.length > 0" class="mt-3">
        <h2>{{ $t("Loans") }}</h2>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">{{ $t("Item") }}</th>
              <th scope="col">{{ $t("Loan state") }}</th>
              <th scope="col">{{ $t("Date") }}</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(loan, key) in loans" :key="key">
              <td scope="row">
                <a :href="'/collection/' + loan.collectionId + '/item/' + loan.itemId">
                  {{ loan.itemId }}
                </a>
              </td>
              <td scope="row"><LoanBadge :state="loan.state" /></td>
              <td scope="row">{{ loan.date }}</td>
              <td>
                <router-link
                  :to="'/collection/' + loan.collectionId + '/item/' + loan.itemId + '/loan/' + loan.id"
                  :title="$t('Edit')"
                  class="me-3"
                >
                  <i class="bi bi-pencil" />
                </router-link>
                <router-link
                  :to="'/collection/' + loan.collectionId + '/item/' + loan.itemId + '/loan/' + loan.id + '/delete'"
                  :title="$t('Delete')"
                >
                  <i class="bi bi-x-lg" />
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Error from "@/components/Error.vue"
import Loading from "@/components/Loading.vue"
import LoanBadge from "@/components/loans/LoanBadge.vue"

export default {
  components: {
    Error,
    Loading,
    LoanBadge,
  },
  data() {
    return {
      borrower: null,
      loans: [],
      error: false,
      loading: true,
    }
  },
  created() {
    this.$apiGet("borrowers/" + this.$route.params.id)
      .then((response) => {
        this.borrower = response.data
        this.loading = false
      })
      .catch((e) => {
        this.error = this.$apiErrorStatus(e)
      })

    this.$apiGet("borrowers/" + this.$route.params.id + "/loans")
      .then((response) => {
        this.loans = response.data
      })
      .catch((e) => {
        this.error = this.$apiErrorStatus(e)
      })
  },
}
</script>
