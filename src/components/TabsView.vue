<template>
  <ul v-if="tabs.length > 1" class="nav nav-tabs">
    <li v-for="tab in tabs" :key="tab" class="nav-item">
      <a
        href="#"
        :class="'nav-link' + (currentTab == tab ? ' active' : '')"
        aria-current="page"
        @click="currentTab = tab"
      >
        {{ $t(tab) }}
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    modelValue: {},
    tabs: {
      type: Array,
      required: true,
    },
  },
  computed: {
    currentTab: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit("update:modelValue", value)
      },
    },
  },
}
</script>
