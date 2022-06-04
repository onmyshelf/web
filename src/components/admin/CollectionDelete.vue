<template>
  <div class="container">
    <h5>Delete collection {{$route.params.cid}}?</h5>
    <button type="button" class="btn btn-danger" @click="deleteCollection" :disabled="$demoMode()">Delete collection</button>&nbsp;
    <button type="button" class="btn btn-outline-secondary" @click="goBack">Cancel</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  methods: {
    goBack() {
      document.location.href = '/'
    },
    deleteCollection() {
      // API call
      axios.delete(import.meta.env.VITE_API_URL + '/collections/' + this.$route.params.cid, this.$apiConfig())
      .then(() => {
        this.goBack()
      })
      .catch(e => {
        console.log(e)
        alert('Error')
      })
    }
  }
}
</script>
