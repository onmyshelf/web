<template>
  <div class="input-group">
    <input
      v-model="password"
      :type="inputType"
      :placeholder="$t('Password')"
      class="form-control"
    />
    <button
      v-if="showButton && showButton.toString() == 'true'"
      class="btn btn-secondary"
      type="button"
      :title="$t('Show/Hide password')"
      @click="toggleType()"
    >
      <i :class="'bi bi-eye' + (inputType == 'password' ? '' : '-slash') + '-fill'" />
    </button>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {},
    showButton: {
      default: false,
    }
  },
  data() {
    return {
      inputType: "password",
    }
  },
  computed: {
    password: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit("update:modelValue", value)
      },
    },
  },
  methods: {
    toggleType() {
      if (this.inputType == "password") {
        this.inputType = "text"
      } else {
        this.inputType = "password"
      }
    },
  },
}
</script>
