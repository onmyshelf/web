<template>
  <div class="container">
    <h1>Print barcode</h1>
    <form @submit="validate">
      <div class="mb-3">
        <label class="form-label mt-3">
          {{ $t("Width") }}
        </label>
        <input
          v-model="width"
          type="number"
          class="form-control"
        />
      </div>

      <div class="mb-3">
        <label class="form-label mt-3">
          {{ $t("Height") }}
        </label>
        <input
          v-model="height"
          type="number"
          class="form-control"
        />
      </div>

      <button type="submit" class="btn btn-outline-primary me-3">
        <i class="bi-printer" /> {{ $t("Print barcode") }}
      </button>
    </form>
    <div
      v-html="qrcode"
      :style="'width: ' + width + 'px; height: ' + height + 'px'"
      class="printable"
    />
  </div>
</template>

<style>
@media print {
  body * {
    display: none;
  }
  .printable * {
    display: block !important;
  }
}
</style>


<script>
import bwipjs from "bwip-js"

export default {
  data() {
    return {
      qrcode: "",
      width: 100,
      height: 100,
    }
  },
  methods: {
    validate(e) {
      // prevent form to reload page
      e.preventDefault()

      this.qrcode = bwipjs.toSVG({
        bcid: "qrcode",
        text: document.location.href.replace(/print$/, ""),
      })

      window.print()
    }
  },
}
</script>
