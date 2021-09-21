<template>
  <div class="container">
    <h5>Delete collection {{$route.params.cid}}?</h5>
    <button type="button" class="btn btn-danger" @click="deleteItem">Delete collection</button>&nbsp;
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
    deleteItem() {
      // API call
      axios.delete(process.env.VUE_APP_API_URL + '/collections/' + this.$route.params.cid, this.$apiConfig())
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
