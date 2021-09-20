<template>
  <select class="form-select" aria-label="Default select example">
    <option v-for="(name,key) in visibility" :key="key" :value="key">{{name.label}}</option>
  </select>
</template>

<script>
export default {
  props: {
    level: {
      type: Number,
      default: 3
    }
  },
  inject: ['visibility']
}
</script>
