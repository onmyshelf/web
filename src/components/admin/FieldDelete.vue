<template>
  <div class="container">
    <h5>Delete field "{{$route.params.id}}"?</h5>
    <p>This will delete the field and all item values associated with.</p>
    <button type="button" class="btn btn-danger" @click="deleteField">Delete field</button>&nbsp;
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
    deleteField() {
      // API call
      axios.delete(process.env.VUE_APP_API_URL + '/collections/' + this.$route.params.cid + '/fields/' + this.$route.params.id, this.$apiConfig())
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
