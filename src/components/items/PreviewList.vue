<template>
  <div class="row">
    <div class="col-4 item-cover">
      <a :href="'item/'+item.id">
        <Cover v-if="item.fields && coverField && item.fields[coverField]" :url="item.fields[coverField]" :linked=false />
        <Cover v-else-if="$parent.cover" :url="$parent.cover" :linked=false />
        <Cover v-else url="/assets/images/box.svg" :linked=false />
      </a>
    </div>
    <div class="col">
      <a :href="'item/'+item.id+'/'">
        <h1 v-if="item.fields && titleField && item.fields[titleField]">{{item.fields[titleField]}}</h1>
        <h1 v-else>Item {{item.id}}</h1>
      </a>
      <a v-if="$parent.isMine" :href="'item/'+item.id+'/edit'" class="btn btn-outline-primary">
        <i class="bi-pencil"></i> Edit item
      </a>
      <template v-if="item.fields" class="item-preview">
        <template v-for="(field, name) in collection.fields" :key="name">
          <Field v-if="item.fields[name]" :name="name" :value=item.fields[name] />
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import Cover from '@/components/fields/Cover.vue'
import Field from '@/components/Field.vue'

export default {
  components: {
    Cover,
    Field
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    coverField() {
      return this.$parent.coverField
    },
    titleField() {
      return this.$parent.titleField
    },
    collection() {
      return { fields: this.$parent.fields }
    }
  }
}
</script>
