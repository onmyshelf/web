<template>
  <div class="">
    <div class="btn-group card-body" role="group">
      <input
        type="radio"
        :name="'mediaSource-' + cptId"
        :id="'mediaLibrary-' + cptId"
        class="btn-check"
        autocomplete="off"
        :checked="source == 'media'"
        @change="toggleSource('media')"
      />
      <label class="btn btn-outline-primary" :for="'mediaLibrary-' + cptId">
        {{ $t("Media library") }}
      </label>

      <input
        type="radio"
        :name="'mediaSource-' + cptId"
        :id="'mediaUrl-' + cptId"
        class="btn-check"
        autocomplete="off"
        @change="toggleSource('url')"
        :checked="source == 'url'"
      />
      <label class="btn btn-outline-primary" :for="'mediaUrl-' + cptId">
        {{ $t("External URL") }}
      </label>

      <template v-if="!mandatory">
        <input
          type="radio"
          :name="'mediaSource-' + cptId"
          :id="'mediaNone-' + cptId"
          class="btn-check"
          autocomplete="off"
          @change="toggleSource('none')"
          :checked="source == 'none'"
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
        <input
          v-model="mediaUrl"
          type="text"
          class="form-control"
          :aria-describedby="'mediaInfo-' + cptId"
          disabled
        />
        <a
          :href="$mediaUrl(mediaUrl)"
          class="btn btn-secondary"
          :title="$t('Open in new tab')"
          target="_blank"
        >
          <i class="bi bi-box-arrow-up-right" />
        </a>
      </div>

      <a class="btn btn-primary" @click="uploadField = !uploadField">
        <i class="bi bi-cloud-arrow-up" /> {{ $t("Upload file") }}
      </a>

      <div v-if="uploadField" class="mt-3">
        <label class="form-label">{{ $t("Drag n drop or choose file") }}</label>
        <div class="input-group mb-3">
          <input
            type="file"
            :id="'uploadFile-' + cptId"
            class="form-control"
            placeholder=""
            :disabled="$demoMode() || loading"
            @change="upload"
          />
        </div>
      </div>

      <div v-if="fileUploaded" class="alert alert-success mt-3" role="alert">
        {{ $t("File uploaded") }}
      </div>
      <div v-else-if="uploadError" class="alert alert-danger mt-3" role="alert">
        {{ $t("Error while uploading file") }} {{ $t("Please retry") }}
      </div>
    </div>

    <div v-else-if="source == 'url'" class="input-group card-body">
      <span class="input-group-text" :id="'mediaInfo-' + cptId">
        {{ $t("Enter valid URL") }}
      </span>
      <input
        v-model="externalUrl"
        type="text"
        class="form-control"
        :aria-describedby="'mediaInfo-' + cptId"
        :placeholder="exampleUrl"
        @input="chosenUrl = externalUrl"
      />
      <a
        v-if="externalUrl"
        :href="externalUrl"
        class="btn btn-secondary"
        :title="$t('Open in new tab')"
        target="_blank"
      >
        <i class="bi bi-box-arrow-up-right" />
      </a>
      <a
        v-if="externalUrl"
        class="btn btn-primary"
        :title="$t('Store into media library')"
        @click="download"
      >
        <i class="bi bi-cloud-arrow-down" />
      </a>
    </div>
    <div v-if="downloadError" class="alert alert-danger mt-3" role="alert">
      {{ $t("Error while downloading file") }} {{ $t("Please retry") }}
    </div>
  </div>

  <Loading v-if="loading" :info="$t('Uploading file')" />

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
  data() {
    return {
      loading: false,
      source: this.mandatory ? "media" : "none",
      externalUrl: "",
      mediaUrl: "",
      uploadField: false,
      uploadError: false,
      fileUploaded: false,
      downloadError: false,
      cptId: Date.now().toString().substring(7),
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
      this.$apiPost("media/upload", data, options)
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
    download() {
      this.loading = true

      // API call
      this.$apiPost("media/download", { url: this.externalUrl })
        .then((response) => {
          // save media URL in input fields
          if (response.data && response.data.url) {
            this.source = "media"
            this.mediaUrl = response.data.url
            this.chosenUrl = this.mediaUrl
          }

          this.loading = false
          this.downloadError = false
          this.uploadField = false
          this.fileUploaded = true
        })
        .catch(() => {
          this.loading = false
          this.downloadError = true
        })
    },
  },
}
</script>
