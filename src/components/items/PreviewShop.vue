<template>
  <div
    v-if="!$parent.search || title.toLowerCase().includes($parent.search.toLowerCase())"
    :id="'item-' + item.id"
    class="item col-lg-3 col-md-6 col-sm-12 mb-3"
  >
    <a :href="'#item-' + item.id" @click="$parent.getItem(item.id)">
      <ImageView :url="coverUrl" cover="true" />
      <h1>{{ title }}</h1>
    </a>

    <LoanBadge v-if="item.lent" state="lent" />
    <LoanBadge v-if="$parent.isMine && item.pendingLoans" state="accepted" />
    <LoanBadge v-if="$parent.isMine && item.askingLoans" state="asked" />

    <div class="mt-3">
      <template v-if="$parent.isMine">
        <VisibilityIcon
          :level="item.visibility > $parent.collection.visibility ? item.visibility : $parent.collection.visibility"
        />
        <div class="btn-group" role="group">
          <EditItemButton :item="item.id" small="true" />
          <LoanItemButton
            v-if="!item.lent && !item.pendingLoans && !item.askingLoans"
            :item="item.id"
            small="true"
          />
          <router-link
            v-else
            :to="'item/' + item.id + '/?tab=Loans'"
            class="btn btn-outline-success"
            :title="$t('Loans')"
          >
            <i class="bi-arrow-left-right" />
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import EditItemButton from "./EditItemButton.vue"
import ImageView from "@/components/properties/ImageView.vue"
import LoanBadge from "@/components/loans/LoanBadge.vue"
import LoanItemButton from "@/components/loans/LoanItemButton.vue"
import VisibilityIcon from "@/components/properties/VisibilityIcon.vue"

export default {
  components: {
    EditItemButton,
    ImageView,
    LoanBadge,
    LoanItemButton,
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
