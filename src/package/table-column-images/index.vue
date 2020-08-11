
<template>
  <!-- 示例代码 -->
  <div class="table-column-images">
    <template v-for="(url, index) in list">
      <img
        :key="index"
        class="table-column-images__item"
        :src="url"
        @click="showSelectedImage(index)"
      >
    </template>
  </div>
</template>

<script>
import previewImage from '@/package/preview-picture/index.js'

export default {
  componentName: 'table-column-images',
  props: {
    value: {
      type: [String, Array],
      required: true,
      default: () => []
    }
  },
  computed: {
    list() {
      if (this.isArray(this.value)) return this.value
      else {
        const arr = []
        arr.push(this.value)
        return arr
      }
    }
  },

  // watch: {
  //   value(val, oldVal) {
  //     if (val !== oldVal) {
  //       this.list = val
  //     }
  //   }
  // },

  methods: {
    isArray(val) {
      return val && val instanceof Array && val.length
    },
    showSelectedImage(index) {
      previewImage(this.list, index)
    }
  }
}
</script>

<style lang="scss">
.table-column-images {
  display: 'flex';
  &__item {
    width: 50px;
    height: 50px;
    padding: 5px;
  }
}
</style>
