<template>
  <div class="container">
    <h5>
      Delete property <strong>{{ $route.params.id }}</strong>?
    </h5>
    <p>This will delete the property and all item values associated with.</p>

    <button type="button" class="btn btn-danger" @click="deleteProperty" :disabled="$demoMode()">
      Delete property
    </button>&nbsp;
    <button type="button" class="btn btn-outline-secondary" @click="goBack">
      Cancel
    </button>
  </div>
</template>

<script>
import axios from "axios"

export default {
  methods: {
    goBack() {
      document.location.href = "/collection/" + this.$route.params.cid + "/manage/"
    },
    deleteProperty() {
      // API call
      axios.delete(import.meta.env.VITE_API_URL + "/collections/" + this.$route.params.cid + "/properties/" + this.$route.params.id, this.$apiConfig())
        .then(() => {
          this.goBack()
        })
        .catch(() => {
          alert("Error")
        })
    },
  },
}
</script>
