<template>
  <el-form class="search-form" size="small" inline label-position="left" label-suffix=":">
    <template v-if="filterList && filterList.length > 0">
      <el-form-item
        v-for="(filter, index) in filterList"
        :key="`${filter.value}_${index}`"
        :label="filter.label"
      >
        <!-- 动态组件 -->
        <component
          :is="filter.is"
          v-model="filterObj[filter.value]"
          v-bind="filter.props"
          clearable
          @change="queryParamsChange"
        />
      </el-form-item>
    </template>
    <el-form-item v-if="filterList.length > 0 && !realTimeRemoteSearch">
      <el-button size="small" type="primary" @click="onProactiveInquire">查询</el-button>
      <el-button v-if="showAddButton.isshow" size="small" type="primary" @click="onAdd">新增</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  componentName: 'filter-panel',
  name: 'FilterPanel',
  props: {
    /**
     * 双向绑定值
     */
    value: {
      type: Object,
      required: true
    },
    /**
     * 筛选属性列表
     */
    filterList: {
      type: Array,
      default: () => []
    },
    /**
     * 是否显示添加按钮
     */
    showAddButton: {
      type: Object,
      default: () => {
        return {
          isshow: false,
          addUrl: ''
        }
      }
    },
    /**
     * 实时搜索
     */
    realTimeRemoteSearch: {
      type: Boolean,
      default: true
    }
  },

  /**
   * 数据
   * @param {Object} filterObj 筛选对象 - 在base表格全局初始化
   */
  data() {
    return {
      filterObj: this.value
    }
  },

  watch: {
    filterObj: {
      handler: (newVal, oldVal) => {
        if (newVal !== oldVal) {
          this.$emit('input', newVal)
        }
      },
      deep: true
    }
  },

  methods: {
    /**
     * 响应实时查询 - 向外界发出通知
     */
    queryParamsChange() {
      if (this.realTimeRemoteSearch) {
        this.$emit('remotePullData', true)
      }
    },
    /**
     * 响应主动查询 - 向外界发出通知
     */
    onProactiveInquire() {
      this.$emit('remotePullData', true)
    },
    /**
     * @description: 新增
     * @param {type}
     * @return:
     */
    onAdd() {
      if (this.showAddButton.addUrl) {
        this.$router.push({
          path: this.showAddButton.addUrl
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-form {
  &__item {
  }
}
</style>
