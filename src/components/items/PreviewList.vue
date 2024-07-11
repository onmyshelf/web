<template>
  <div v-if="!$parent.search || title.toLowerCase().includes($parent.search.toLowerCase())" class="row">
    <div class="col-4 item-cover">
      <router-link :to="'item/' + item.id + '/'">
        <ImageView :url="coverUrl" :cover="true" />
      </router-link>
    </div>
    <div class="col">
      <router-link :to="'item/' + item.id + '/'">
        <h1>{{ title }}</h1>
        <h2 v-if="collection.subTitleProperty && item.properties[collection.subTitleProperty]">
          {{ item.properties[collection.subTitleProperty] }}
        </h2>
      </router-link>
      <div v-if="item.properties" class="item-preview">
        <div v-for="(property, name) of collection.properties" :key="name">
          <Property v-if="property.preview" :name="name" :property="property" :value="item.properties[name]" />
        </div>
      </div>
      <span v-if="item.lent" class="badge text-bg-danger">{{ $t("Lent") }}</span>
      <div class="mt-3">
        <template v-if="$parent.isMine">
          <VisibilityIcon
            :level="item.visibility > $parent.collection.visibility ? item.visibility : $parent.collection.visibility"
          />
          &nbsp;
          <router-link :to="'item/' + item.id + '/edit'" class="btn btn-outline-primary">
            <i class="bi-pencil"></i> {{ $t("Edit") }}
          </router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import ImageView from "@/components/properties/ImageView.vue"
import Property from "@/components/Property.vue"
import VisibilityIcon from "@/components/properties/VisibilityIcon.vue"

export default {
  components: {
    ImageView,
    Property,
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
