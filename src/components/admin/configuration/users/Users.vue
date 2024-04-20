<template>
  <Error v-if="error" :status="error" />
  <div v-else>
    <div class="mb-3">
      <router-link to="new" class="btn btn-success mb-3">
        <i class="bi-plus-lg"></i> {{ $t("Create new user") }}
      </router-link>

      <template v-if="users">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">{{ $t("ID") }}</th>
              <th scope="col">{{ $t("Username") }}</th>
              <th scope="col">{{ $t("Enabled") }}</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, key) in users" :key="key">
              <td scope="row">{{ user.id }}</td>
              <td scope="row">{{ user.username }}</td>
              <td>
                <i :class="'bi bi-' + (user.enabled ? 'check-lg' : 'ban')"></i>
              </td>
              <td>
                <router-link :to="'' + user.id" :title="$t('Edit')">
                  <i class="bi bi-pencil"></i>
                </router-link>&nbsp;&nbsp;
                <router-link :to="'' + user.id + '/delete'" :title="$t('Delete')">
                  <i class="bi bi-x-lg"></i>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <Loading v-else />
    </div>
  </div>
</template>

<script>
import Error from "@/components/Error.vue"
import Loading from "@/components/Loading.vue"

export default {
  components: {
    Error,
    Loading,
  },
  data() {
    return {
      users: null,
      error: false,
      loading: true,
    }
  },
  created() {
    // get all users
    this.$apiGet("users/")
      .then((response) => {
        this.users = response.data

        this.loading = false
      })
      .catch((e) => {
        this.error = this.$apiErrorStatus(e)
      })
  },
}
</script>
