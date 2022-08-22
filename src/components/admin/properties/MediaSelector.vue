<template>
  <div class="">
    <div class="btn-group card-body" role="group">
      <input type="radio" :name="'mediaSource-' + cptId" class="btn-check" :id="'mediaLibrary-' + cptId" autocomplete="off"
        @change="toggleSource('media')" :checked="source == 'media'"
      />
      <label class="btn btn-outline-primary" :for="'mediaLibrary-' + cptId">
        {{ $t("Media library") }}
      </label>

      <input type="radio" :name="'mediaSource-'+cptId" class="btn-check" :id="'mediaUrl-' + cptId" autocomplete="off"
        @change="toggleSource('url')" :checked="source == 'url'"
      />
      <label class="btn btn-outline-primary" :for="'mediaUrl-' + cptId">
        {{ $t("External URL") }}
      </label>

      <template v-if="!mandatory">
        <input type="radio" :name="'mediaSource-'+cptId" class="btn-check" :id="'mediaNone-' + cptId" autocomplete="off"
          @change="toggleSource('none')" :checked="source == 'none'"
        />
        <label class="btn btn-outline-primary" :for="'mediaNone-' + cptId">
          {{ $t("No media") }}
        </label>
      </template>
    </div>
  </div>

  <div v-if="source != 'none'" class="card mb-3">
    <div v-if="source == 'media'" class="card-body">
      <div v-if="mediaUrl" class="input-group mb-3">
        <span class="input-group-text" :id="'mediaInfo-' + cptId">
          {{ $t("Media URL") }}
        </span>
        <input v-model="mediaUrl" type="text" disabled
          class="form-control" :aria-describedby="'mediaInfo-' + cptId"
        />
        <a :href="$mediaUrl(mediaUrl)" class="btn btn-secondary" :title="$t('Open in new tab')" target="_blank">
          <i class="bi bi-box-arrow-up-right"></i>
        </a>
      </div>

      <a class="btn btn-primary" @click="uploadField = !uploadField">
        <i class="bi bi-cloud-arrow-up"></i> {{ $t("Upload file") }}
      </a>

      <div v-if="uploadField" class="mt-3">
        <label class="form-label">{{ $t("Drag n drop or choose file") }}</label>
        <div class="input-group">
          <input type="file" :id="'uploadFile-' + cptId" 
            class="form-control" placeholder="" @change="upload"
            :disabled="$demoMode() || loading"
          />
        </div>
        <Loading v-if="loading" />
      </div>

      <div v-if="fileUploaded" class="alert alert-success mt-3" role="alert">
        {{ $t("File uploaded") }}
      </div>
      <div v-else-if="uploadError" class="alert alert-danger mt-3" role="alert">
        {{ $t("Error, please retry") }}
      </div>
    </div>

    <div v-else-if="source == 'url'" class="input-group card-body">
      <span class="input-group-text" :id="'mediaInfo-' + cptId">{{ $t("Enter valid URL") }}</span>
      <input type="text" class="form-control" :aria-describedby="'mediaInfo-' + cptId" :placeholder="exampleUrl"
        v-model="externalUrl" @input="chosenUrl = externalUrl"
      />
      <a v-if="externalUrl" :href="externalUrl" class="btn btn-secondary" :title="$t('Open in new tab')" target="_blank">
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
        case "image":
        case "video":
          return this.$t("URL " + this.type + " example")

        default:
          return this.$t("URL file example")
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
