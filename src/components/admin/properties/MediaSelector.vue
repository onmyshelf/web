<template>
  <div class="">
    <div class="btn-group card-body" role="group">
      <input type="radio" :name="'mediaSource-' + cptId" class="btn-check" :id="'mediaLibrary-' + cptId" autocomplete="off"
        @change="toggleSource('media')" :checked="source == 'media'"
      />
      <label class="btn btn-outline-primary" :for="'mediaLibrary-' + cptId">
        Media library
      </label>

      <input type="radio" :name="'mediaSource-'+cptId" class="btn-check" :id="'mediaUrl-' + cptId" autocomplete="off"
        @change="toggleSource('url')" :checked="source == 'url'"
      />
      <label class="btn btn-outline-primary" :for="'mediaUrl-' + cptId">
        External URL
      </label>

      <template v-if="!mandatory">
        <input type="radio" :name="'mediaSource-'+cptId" class="btn-check" :id="'mediaNone-' + cptId" autocomplete="off"
          @change="toggleSource('none')" :checked="source == 'none'"
        />
        <label class="btn btn-outline-primary" :for="'mediaNone-' + cptId">
          None
        </label>
      </template>
    </div>
  </div>

  <div v-if="source != 'none'" class="card mb-3">
    <div v-if="source == 'media'" class="card-body">
      <div v-if="mediaUrl" class="input-group mb-3">
        <span class="input-group-text" :id="'mediaInfo-' + cptId">
          Media URL:
        </span>
        <input v-model="mediaUrl" type="text" disabled
          class="form-control" :aria-describedby="'mediaInfo-' + cptId"
          placeholder="Click on Upload button to send a new file"
        />
        <a :href="$mediaUrl(mediaUrl)" class="btn btn-primary" title="Open in a new tab" target="_blank">
          <i class="bi bi-box-arrow-up-right"></i>
        </a>
      </div>

      <a class="btn btn-primary" @click="uploadField = !uploadField">
        <i class="bi bi-cloud-arrow-up"></i> Upload a new file
      </a>

      <div v-if="uploadField" class="mt-3">
        <label class="form-label">Drag and drop or choose a file:</label>
        <div class="input-group">
          <input type="file" :id="'uploadFile-' + cptId" 
            class="form-control" placeholder="" @change="upload"
            :disabled="$demoMode() || loading"
          />
        </div>
        <Loading v-if="loading" />
      </div>

      <div v-if="fileUploaded" class="alert alert-success mt-3" role="alert">
        Your file has been uploaded.
      </div>
      <div v-else-if="uploadError" class="alert alert-danger mt-3" role="alert">
        An error occured. Please retry.
      </div>
    </div>

    <div v-else-if="source == 'url'" class="input-group card-body">
      <span class="input-group-text" :id="'mediaInfo-' + cptId">Enter a valid URL:</span>
      <input type="text" class="form-control" :aria-describedby="'mediaInfo-' + cptId" :placeholder="exampleUrl"
        v-model="externalUrl" @input="chosenUrl = externalUrl"
      />
      <a v-if="externalUrl" :href="externalUrl" class="btn btn-primary" title="Open in a new tab" target="_blank">
        <i class="bi bi-box-arrow-up-right"></i>
      </a>
    </div>
  </div>

  <input type="hidden" v-model="chosenUrl" disabled />
</template>

<script>
import Loading from "@/components/Loading.vue"

export default {
  components: {
    Loading,
  },
  props: {
    modelValue: {},
    type: {
      type: String,
      default: "",
    },
    mandatory: {
      default: false,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      loading: false,
      source: this.mandatory ? "media" : "none",
      externalUrl: "",
      mediaUrl: "",
      uploadField: false,
      uploadError: false,
      fileUploaded: false,
      cptId: Date.now().toString().substr(7),
    }
  },
  created() {
    if (this.modelValue && this.modelValue != "") {
      if (this.$isMediaUrl(this.modelValue)) {
        this.source = "media"
        this.mediaUrl = this.modelValue
      } else {
        this.source = "url"
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
        this.$emit("update:modelValue", value)
      }
    },
    exampleUrl() {
      switch (this.type) {
        case "csv":
          return "e.g. https://mywebsite.com/collection.csv"

        case "image":
          return "e.g. https://mywebsite.com/image.jpg"

        case "video":
          return "e.g. https://www.youtube.com/watch?v=123456"

        default:
          return "e.g. https://mywebsite.com/file.pdf"
      }
    }
  },
  methods: {
    toggleSource(source) {
      this.source = source
      if (source == "media") {
        this.chosenUrl = this.mediaUrl
      } else if (source == "url") {
        this.chosenUrl = this.externalUrl
      } else {
        this.chosenUrl = ""
      }
    },
    upload() {
      // upload a file
      let file = document.querySelector("#uploadFile-" + this.cptId).files[0]

      if (!file || file == "") {
        return
      }

      this.uploadError = false
      this.fileUploaded = false
      this.loading = true

      let data = new FormData()
      data.append("file", file)

      let options = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }

      // API call
      this.$apiPost("upload", data, options)
        .then((response) => {
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
          this.uploadError = true
        })
    },
  },
}
</script>
