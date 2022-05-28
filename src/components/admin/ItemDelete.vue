<template>
  <div class="container">
    <h5>Delete item {{$route.params.id}}?</h5>
    <button type="button" class="btn btn-danger" @click="deleteItem">Delete item</button>&nbsp;
    <button type="button" class="btn btn-outline-secondary" @click="goBack">Cancel</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  methods: {
    goBack() {
      document.location.href = '/collection/' + this.$route.params.cid + '/manage/'
    },
    deleteItem() {
      // API call
      axios.delete(import.meta.env.VITE_API_URL + '/collections/' + this.$route.params.cid + '/items/' + this.$route.params.id, this.$apiConfig())
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
