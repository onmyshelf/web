<template>
  <div class="item col-lg-3 col-md-6 col-sm-12 mb-3">
    <a :href="'#item-' + item.id" @click="$parent.getItem(item.id)">
      <ImageView :url="cover" cover="true" />
      <h1>{{ title }}</h1>
    </a>

    <QuantityBadge :quantity="item.quantity" />
    <LoanBadge v-if="item.lent" state="lent" />
    <LoanBadge v-if="$parent.isMine && item.pendingLoans" state="accepted" />
    <LoanBadge v-if="$parent.isMine && item.askingLoans" state="asked" />

    <div class="mt-3">
      <template v-if="$parent.isMine">
        <VisibilityIcon
          :level="item.visibility > $parent.collection.visibility ? item.visibility : $parent.collection.visibility"
        />
        <div class="btn-group" role="group">
          <EditItemButton
            :collection="collection.id"
            :item="item.id"
            small="true"
          />
          <LoanItemButton
            v-if="!item.lent && !item.pendingLoans && !item.askingLoans"
            :collection="collection.id"
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
      <template v-else>
        <BorrowItemButton v-if="borrowable" :item="item.id" />
      </template>
    </div>
  </div>
</template>

<script>
import BorrowItemButton from "@/components/loans/BorrowItemButton.vue"
import EditItemButton from "./EditItemButton.vue"
import ImageView from "@/components/properties/ImageView.vue"
import LoanBadge from "@/components/loans/LoanBadge.vue"
import LoanItemButton from "@/components/loans/LoanItemButton.vue"
import QuantityBadge from "./QuantityBadge.vue"
import VisibilityIcon from "@/components/properties/VisibilityIcon.vue"

export default {
  components: {
    BorrowItemButton,
    EditItemButton,
    ImageView,
    LoanBadge,
    LoanItemButton,
    QuantityBadge,
    VisibilityIcon,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    cover: {},
  },
  computed: {
    collection() {
      return this.$parent.collection
    },
    borrowable() {
      var level = this.item.borrowable

      if (level < this.$parent.collection.borrowable) {
        level = this.$parent.collection.borrowable
      }

      if (level == 0) {
        return true
      }

      if (!this.$isLoggedIn()) {
        return false
      }

      if (!this.$parent.isMine && level > 2) {
        return false
      }

      return true
    },
  },
}
</script>
