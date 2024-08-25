<template>
  <Error v-if="error" :status="error" />
  <div v-else>
    <h1>{{ $t("Borrowers") }}</h1>
    <div class="mb-3">
      <router-link to="new" class="btn btn-success mb-3">
        <i class="bi-plus-lg" /> {{ $t("Create new borrower") }}
      </router-link>

      <Loading v-if="loading" />
      <template v-else>
        <template v-if="borrowers && borrowers.length > 0">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">{{ $t("Firstname") }}/{{ $t("Lastname") }}</th>
                <th scope="col">{{ $t("Email") }}</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(borrower, key) in borrowers" :key="key">
                <td scope="row">
                  <a :href="borrower.id + '/'">
                    {{ borrower.firstname }} {{ borrower.lastname }}
                  </a>
                </td>
                <td scope="row">
                  <a :href="borrower.id + '/'">{{ borrower.email }}</a>
                </td>
                <td>
                  <router-link
                    v-if="$matchUserId(borrower.owner)"
                    :to="'' + borrower.id + '/'"
                    :title="$t('View')"
                    class="me-3"
                  >
                    <i class="bi bi-eye" />
                  </router-link>
                  <router-link
                    v-if="$matchUserId(borrower.owner)"
                    :to="'' + borrower.id + '/edit'"
                    :title="$t('Edit')"
                    class="me-3"
                  >
                    <i class="bi bi-pencil" />
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
        <Empty
          v-else
          :label="$t('No borrowers') + ' ' + $t('Create first borrower')"
        />
      </template>
    </div>
  </div>
</template>

<script>
import Empty from "@/components/Empty.vue"
import Error from "@/components/Error.vue"
import Loading from "@/components/Loading.vue"

export default {
  components: {
    Empty,
    Error,
    Loading,
  },
  data() {
    return {
      borrowers: [],
      error: false,
      loading: true,
    }
  },
  created() {
    this.$apiGet("borrowers")
      .then((response) => {
        this.borrowers = response.data
        this.loading = false
      })
      .catch((e) => {
        this.error = this.$apiErrorStatus(e)
      })
  },
}
</script>
