<template>
  <div
    v-if="stars"
    :title="stars.label"
    class="property-rating-view"
    :data-rating-value="value"
    :data-rating-max="max"
  >
    <span :title="stars.label" class="stars">
      <i v-for="i in stars.full" :key="i" class="bi-star-fill"></i>
      <i v-if="stars.mid == 1" class="bi-star-half"></i>
      <i v-for="i in stars.empty" :key="i" class="bi-star"></i>
    </span>
    <span class="rating-label">{{ stars.label }}</span>
  </div>
</template>

<style scoped>
.property-rating-view {
  color: #ffc400;
}
.property-rating-view .rating-label {
  font-weight: bold;
  margin-left: 10px;
}
</style>

<script>
export default {
  props: {
    label: {
      type: String,
    },
    value: {
      required: true,
    },
    max: {
      type: Number,
      default: 5,
    },
  },
  computed: {
    stars() {
      var stars = {}
      var max = this.max

      // unknown max
      if (max == 5 && this.value > 5) {
        max = "?"
        stars.empty = 5
      } else {
        // conversion to rate over 5
        var full = (this.value * 5) / this.max
        stars.full = Array.from({ length: full })
        var empty = 5 - full
        stars.empty = Array.from({ length: empty })

        // add middle star if any
        stars.mid = full - Math.floor(full) > 0 ? 1 : 0
      }

      stars.label = this.value + "/" + max
      return stars
    },
  },
}
</script>
