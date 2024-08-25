<template>
  <Error v-if="error" :status="error" />
  <div v-else class="collections">
    <p v-if="$isLoggedIn()" class="mt-3">
      <router-link to="/collection/new" class="btn btn-outline-success">
        <i class="bi-plus" /> {{ $t("Create a collection") }}
      </router-link>
    </p>
    <Loading v-if="loading" />
    <template v-if="collections">
      <template v-if="collections.length == 0">
        <Empty
          v-if="$isLoggedIn()"
          :label="$t('No collections') + ' ' + $t('Create first collection')"
        />
        <Empty
          v-else
          :label="$t('No collections') + ' ' + $t('Login to create first collection')"
        />
      </template>
      <template v-else>
        <div v-if="$isLoggedIn()">
          <div class="form-check">
            <input
              v-model="filterMine"
              type="checkbox"
              class="form-check-input"
            />
            <label class="form-check-label">
              {{ $t("Show only my collections") }}
            </label>
          </div>
        </div>

        <template v-for="collection of collections" :key="collection.id">
          <div
            v-if="!filterMine || collection.owner == currentUser.id"
            class="row"
          >
            <div class="col-4 item-cover">
              <router-link :to="'/collection/' + collection.id + '/'">
                <ImageView
                  :url="collection.cover"
                  cover="true"
                  style="max-height: 8em"
                />
              </router-link>
            </div>
            <div class="col">
              <router-link :to="'/collection/' + collection.id + '/'">
                <h1>
                  <template v-if="collection.name">
                    {{ collection.name }}
                  </template>
                  <template v-else>Collection {{ collection.id }}</template>
                </h1>
              </router-link>
              <p v-if="collection.description">
                {{ collection.description }}
              </p>
              <p>{{ $t("Items") }}: {{ collection.items }}</p>
              <div v-if="collection.owner == currentUser.id">
                <p>
                  <MineBadge />
                  <VisibilityIcon :level="collection.visibility" />
                  <router-link
                    :to="'/collection/' + collection.id + '/manage/'"
                    class="btn btn-outline-secondary"
                  >
                    <i class="bi-gear-fill" /> {{ $t("Manage") }}
                  </router-link>
                </p>
              </div>
            </div>
          </div>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
import ImageView from "./properties/ImageView.vue"
import Empty from "@/components/Empty.vue"
import Error from "@/components/Error.vue"
import Loading from "@/components/Loading.vue"
import MineBadge from "@/components/collections/MineBadge.vue"
import VisibilityIcon from "@/components/properties/VisibilityIcon.vue"

export default {
  components: {
    ImageView,
    Empty,
    Error,
    Loading,
    MineBadge,
    VisibilityIcon,
  },
  data() {
    return {
      loading: true,
      collections: null,
      error: false,
      filterMine: false,
    }
  },
  created() {
    // get API info
    this.$apiGet("").then((response) => {
      localStorage.setItem("onmyshelf_readonly", response.data.readonly)
    })

    // get collections list
    this.$apiGet("collections")
      .then((response) => {
        this.collections = response.data

        // translate strings
        for (var i=0; i < this.collections.length; i++) {
          if (this.collections[i].name) {
            this.collections[i].name = this.$translate(this.collections[i].name)
          }
          if (this.collections[i].description) {
            this.collections[i].description = this.$translate(this.collections[i].description)
          }
        }

        this.loading = false
      })
      .catch((e) => {
        // if unauthorized token,
        if (e.response && e.response.status == 401) {
          // delete local token & reload page
          this.$cleanSession()
          document.location.reload()
        } else {
          this.error = this.$apiErrorStatus(e)
        }

        this.loading = false
      })

    this.currentUser = this.$currentUser()
  },
}
</script>
