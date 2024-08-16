<template>
  <div class="card mb-3">
    <div :id="'module-' + name" class="card-body">
      <h4 class="card-title">
        {{ module.name }}
        <span v-if="module.external" class="badge text-bg-light ms-2">
          {{ $t("External") }}
        </span>
      </h4>
      <p v-if="module.description" class="card-text">
        {{ module.description }}
      </p>
      <p v-if="module.version" class="card-text">
        {{ $t("Version") }}: {{ module.version }}
      </p>
      <p class="card-text">
        {{ $t("Features") }}:
        <span v-if="module.search" class="badge text-bg-primary ms-2">
          search
        </span>
        <span
          v-if="module.importCollection"
          class="badge text-bg-secondary ms-2"
        >
          collection import
        </span>
      </p>
      <p v-if="module.tags" class="card-text">
        {{ $t("Tags") }}:
        <span
          v-for="tag in module.tags"
          :key="tag"
          class="badge rounded-pill text-bg-light ms-2"
        >
          {{ tag }}
        </span>
      </p>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {},
    module: {},
  },
}
</script>
