<template>
  <div class="card">
    <div class="btn-group card-body" role="group" aria-label="Basic radio toggle button group">
      <input type="radio" :name="name+'-mediaSource'" class="btn-check" :id="name+'-mediaLibrary'" autocomplete="off"
            @change="toggleSource('media')" :checked="source == 'media'">
      <label class="btn btn-outline-primary" :for="name+'-mediaLibrary'">Media library</label>

      <input type="radio" :name="name+'-mediaSource'" class="btn-check" :id="name+'-mediaUrl'" autocomplete="off"
            @change="toggleSource('url')" :checked="source == 'url'">
      <label class="btn btn-outline-primary" :for="name+'-mediaUrl'">External URL</label>

      <input type="radio" :name="name+'-mediaSource'" class="btn-check" :id="name+'-mediaNone'" autocomplete="off"
            @change="toggleSource('none')" :checked="source == 'none'">
      <label class="btn btn-outline-primary" :for="name+'-mediaNone'">None</label>
    </div>
  </div>

  <div v-if="source != 'none'" class="card mb-3">
    <div v-if="source == 'media'" class="card-body">
      <div class="input-group">
        <span class="input-group-text" :id="name+'-mediaInfo'">Media URL:</span>
        <input type="text"
            class="form-control" :aria-describedby="name+'-mediaInfo'" placeholder="Click on Upload button to send a new file"
            v-model="mediaUrl" disabled>
        <a class="btn btn-primary" @click="uploadField = !uploadField">Upload a new file</a>
      </div>

      <div v-if="uploadField" class="mt-3">
        <label class="form-label">Choose a file then click on upload:</label>
        <div class="input-group">
          <input :id="name+'-uploadFile'" type="file" class="form-control" placeholder="">
          <a class="btn btn-primary" @click="upload" :disabled="loading">Upload</a>
        </div>
        <Loading v-if="loading"/>
      </div>

      <div v-if="fileUploaded" class="alert alert-success mt-3" role="alert">
        Your file has been uploaded to server!
      </div>
    </div>

    <div v-else-if="source == 'url'" class="input-group card-body">
      <span class="input-group-text" :id="name+'-mediaInfo'">Enter a valid URL:</span>
      <input type="text" class="form-control" :aria-describedby="name+'-mediaInfo'" :placeholder="exampleUrl"
        v-model="externalUrl" @input="chosenUrl = externalUrl">
    </div>
  </div>

  <input :id="name+'-chosenUrl'" type="hidden" v-model="chosenUrl" disabled>
</template>

<script>
import axios from 'axios'
import Loading from '@/components/Loading.vue'

export default {
  components: {
    Loading
  },
  props: {
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      source: 'none',
      externalUrl: '',
      mediaUrl: '',
      chosenUrl: this.url,
      uploadField: false,
      fileUploaded: false
    }
  },
  created() {
    if (this.url && this.url != '') {
      if (this.$isMediaUrl(this.url)) {
        this.source = 'media'
        this.mediaUrl = this.url
      } else {
        this.source = 'url'
        this.externalUrl = this.url
      }
    }
  },
  computed: {
    exampleUrl() {
      switch (this.type) {
        case 'image':
          return "e.g. https://mysite.com/image.jpg"

        case 'video':
          return "e.g. https://www.youtube.com/watch?v=123456"
      
        default:
          return "e.g. https://mysite.com/file.pdf"
      }
    }
  },
  methods: {
    toggleSource(source) {
      this.source = source
      if (source == 'media') {
        this.chosenUrl = this.mediaUrl
      } else if (source == 'url') {
        this.chosenUrl = this.externalUrl
      } else {
        this.chosenUrl = ''
      }
    },
    upload() {
      // upload a file
      let file = document.querySelector('#'+this.name+'-uploadFile').files[0]

      if (!file || file == '') {
        return
      }

      console.log(file)

      this.loading = true

      let data = new FormData()
      data.append("file", file)
      
      // API call
      // TODO TEST
      axios.post(process.env.VUE_APP_API_URL + '/upload', data, this.$apiConfig({
          headers: {'Content-Type': 'multipart/form-data'}})
      ).then(response => {
        // save media URL in input fields
        if (response.data && response.data.url) {
          this.mediaUrl = response.data.url
          this.chosenUrl = this.mediaUrl
        }

        this.loading = false
        this.uploadField = false
        this.fileUploaded = true
      })
      .catch(() => {
        // hide loading
        this.loading = false
      })
    }
  }
}
</script>
