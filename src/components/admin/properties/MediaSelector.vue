<template>
  <div class="card">
    <div class="btn-group card-body" role="group" aria-label="Basic radio toggle button group">
      <input type="radio" :name="'mediaSource-'+cptId" class="btn-check" :id="'mediaLibrary-'+cptId" autocomplete="off"
            @change="toggleSource('media')" :checked="source == 'media'">
      <label class="btn btn-outline-primary" :for="'mediaLibrary-'+cptId">Media library</label>

      <input type="radio" :name="'mediaSource-'+cptId" class="btn-check" :id="'mediaUrl-'+cptId" autocomplete="off"
            @change="toggleSource('url')" :checked="source == 'url'">
      <label class="btn btn-outline-primary" :for="'mediaUrl-'+cptId">External URL</label>

      <template v-if="!mandatory">
        <input type="radio" :name="'mediaSource-'+cptId" class="btn-check" :id="'mediaNone-'+cptId" autocomplete="off"
              @change="toggleSource('none')" :checked="source == 'none'">
        <label class="btn btn-outline-primary" :for="'mediaNone-'+cptId">None</label>
      </template>
    </div>
  </div>

  <div v-if="source != 'none'" class="card mb-3">
    <div v-if="source == 'media'" class="card-body">
      <div class="input-group">
        <span class="input-group-text" :id="'mediaInfo-'+cptId">Media URL:</span>
        <input type="text"
            class="form-control" :aria-describedby="'mediaInfo-'+cptId" placeholder="Click on Upload button to send a new file"
            v-model="mediaUrl" disabled>
        <a class="btn btn-primary" @click="uploadField = !uploadField">Upload a new file</a>
      </div>

      <div v-if="uploadField" class="mt-3">
        <label class="form-label">Choose a file then click on upload:</label>
        <div class="input-group">
          <input :id="'uploadFile-'+cptId" type="file" class="form-control" placeholder="">
          <a class="btn btn-primary" @click="upload" :disabled="loading">Upload</a>
        </div>
        <Loading v-if="loading"/>
      </div>

      <div v-if="fileUploaded" class="alert alert-success mt-3" role="alert">
        Your file has been uploaded to server!
      </div>
    </div>

    <div v-else-if="source == 'url'" class="input-group card-body">
      <span class="input-group-text" :id="'mediaInfo-'+cptId">Enter a valid URL:</span>
      <input type="text" class="form-control" :aria-describedby="'mediaInfo-'+cptId" :placeholder="exampleUrl"
        v-model="externalUrl" @input="chosenUrl = externalUrl">
    </div>
  </div>

  <input type="hidden" v-model="chosenUrl" disabled>
</template>

<script>
import axios from 'axios'
import Loading from '@/components/Loading.vue'

export default {
  components: {
    Loading
  },
  props: {
    modelValue: {},
    type: {
      type: String,
      default: ''
    },
    mandatory: {
      default: false
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      loading: false,
      source: this.mandatory ? 'media' : 'none',
      externalUrl: '',
      mediaUrl: '',
      uploadField: false,
      fileUploaded: false,
      cptId: Date.now().toString().substr(7)
    }
  },
  created() {
    if (this.modelValue && this.modelValue != '') {
      if (this.$isMediaUrl(this.modelValue)) {
        this.source = 'media'
        this.mediaUrl = this.modelValue
      } else {
        this.source = 'url'
        this.externalUrl = this.modelValue
      }
    }
  },
  computed: {
    chosenUrl: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    exampleUrl() {
      switch (this.type) {
        case 'csv':
          return "e.g. https://mywebsite.com/collection.csv"

        case 'image':
          return "e.g. https://mywebsite.com/image.jpg"

        case 'video':
          return "e.g. https://www.youtube.com/watch?v=123456"

        default:
          return "e.g. https://mywebsite.com/file.pdf"
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
      let file = document.querySelector('#uploadFile-'+this.cptId).files[0]

      if (!file || file == '') {
        return
      }

      this.loading = true

      let data = new FormData()
      data.append("file", file)

      // API call
      axios.post(import.meta.env.VITE_API_URL + '/upload', data, this.$apiConfig({
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
