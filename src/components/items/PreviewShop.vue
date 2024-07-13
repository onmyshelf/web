<template>
  <div
    v-if="!$parent.search || title.toLowerCase().includes($parent.search.toLowerCase())"
    class="item col-lg-3 col-md-6 col-sm-12 mb-3"
  >
    <router-link :to="'item/' + item.id + '/'">
      <ImageView :url="coverUrl" cover="true" />
    </router-link>
    <router-link :to="'item/' + item.id + '/'">
      <h1>{{ title }}</h1>
    </router-link>
    <LentBadge v-if="item.lent" />
    <div class="mt-3">
      <template v-if="$parent.isMine">
        <VisibilityIcon
          :level="item.visibility > $parent.collection.visibility ? item.visibility : $parent.collection.visibility"
        />
        <div class="btn-group" role="group">
          <EditItemButton :item="item.id" small="true" />
          <LoansItemButton :item="item.id" small="true" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import EditItemButton from "./EditItemButton.vue"
import ImageView from "@/components/properties/ImageView.vue"
import LentBadge from "./LentBadge.vue"
import LoansItemButton from "./LoansItemButton.vue"
import VisibilityIcon from "@/components/properties/VisibilityIcon.vue"

export default {
  components: {
    EditItemButton,
    ImageView,
    LentBadge,
    LoansItemButton,
    VisibilityIcon,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    collection() {
      return this.$parent.collection
    },
    coverUrl() {
      if (this.item.properties[this.collection.coverProperty]) {
        if (this.item.thumbnail.normal) {
          return this.item.thumbnail.normal
        } else {
          return this.item.properties[this.collection.coverProperty]
        }
      } else {
        if (this.collection.thumbnail.normal) {
          return this.collection.thumbnail.normal
        } else {
          return this.collection.cover
        }
      }
    },
    title() {
      if (this.item.properties[this.collection.titleProperty]) {
        return this.item.properties[this.collection.titleProperty]
      } else {
        return "Item " + this.item.id
      }
    },
  },
}
</script>
