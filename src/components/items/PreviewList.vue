<template>
  <div class="row">
    <div class="col-4 item-cover">
      <a :href="'item/'+item.id">
        <Image :url="coverUrl" :cover=true />
      </a>
    </div>
    <div class="col">
      <a :href="'item/'+item.id+'/'">
        <h1>{{title}}</h1>
        <h2 v-if="collection.subTitleField && item.fields[collection.subTitleField]">
          {{item.fields[collection.subTitleField]}}
        </h2>
      </a>
      <div v-if="item.fields" class="item-preview">
        <div v-for="(field, name) of collection.fields" :key="name">
          <Field v-if="field.preview" :name="name" :field=field :value=item.fields[name] />
        </div>
      </div>
      <a v-if="$parent.isMine" :href="'item/'+item.id+'/edit'" class="btn btn-outline-primary">
        <i class="bi-pencil"></i> Edit
      </a>
    </div>
  </div>
</template>

<script>
import Image from '@/components/fields/medias/Image.vue'
import Field from '@/components/Field.vue'

export default {
  components: {
    Image,
    Field
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    collection() {
      return this.$parent.collection
    },
    coverUrl() {
      if (this.item.fields[this.collection.coverField]) {
        return this.item.fields[this.collection.coverField]
      } else {
        return this.collection.cover
      }
    },
    title() {
      if (this.item.fields[this.collection.titleField]) {
        return this.item.fields[this.collection.titleField]
      } else {
        return 'Item '+this.item.id
      }
    }
  }
}
</script>
