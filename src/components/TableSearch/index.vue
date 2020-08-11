<template>
  <div class="filter-container row__search">
    <div v-if="searchData.input" class="row__search">
      <div v-for="(item, index) in searchData.input" :key="index" class="input__groups mar-right">
        <el-input
          v-model="item.value"
          :placeholder="item.placeholder"
          class="filter-item fixed-width"
          clearable
        />
      </div>
    </div>
    <div v-if="searchData.select" class="row__search">
      <div v-for="(item, index) in searchData.select" :key="index" class="select__groups mar-right">
        <el-select
          v-model="item.value"
          :placeholder="item.placeholder"
          class="filter-item fixed-width"
          clearable
        >
          <el-option
            v-for="(optionItem, optionIndex) in item.options"
            :key="optionIndex"
            :label="optionItem.label"
            :value="optionItem.value"
          />
        </el-select>
      </div>
    </div>
    <div v-if="searchData.date" class="row__search">
      <div v-for="(item, index) in searchData.date" :key="index" class="date__groups mar-right">
        <el-date-picker
          v-model="item.value"
          clearable
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          :start-placeholder="item.startPlaceholder"
          :end-placeholder="item.endPlaceholder"
        />
      </div>
    </div>
    <el-button
      v-waves
      class="filter-item float-right"
      type="primary"
      icon="el-icon-search"
      @click="handleSearch"
    >搜索</el-button>

    <el-button
      v-waves
      class="filter-item float-right"
      type="primary"
      icon="el-icon-download"
      v-if="showExport"
      @click="handleExport"
    >导出</el-button>

    <el-button
      v-waves
      class="filter-item float-right"
      type="primary"
      icon="el-icon-plus"
      v-if="showAdd"
      @click="handleAdd"
    >添加</el-button>
  </div>
</template>
<script>
import waves from '@/directive/waves'
export default {
  name: 'TableSearch',
  directives: { waves },
  props: {
    search: {
      type: Object,
      default: function() {
        return {}
      }
    },
    showExport: {
      type: Boolean,
      default: true
    },
    showAdd: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchData: Object.assign({}, this.search)
    }
  },
  methods: {
    /**
     * @description: 搜索
     * @return:
     */

    handleSearch() {
      this.$emit('search', this.handleSearchData())
    },
    /**
     * @description: 处理搜索数据
     * @return:
     */
    handleSearchData() {
      const data = {}
      if (this.searchData.input && this.searchData.input.length) {
        this.searchData.input.forEach((item, index) => {
          data[item.name] = item.value
        })
      }
      if (this.searchData.select && this.searchData.select.length) {
        this.searchData.select.forEach((item, index) => {
          data[item.name] = item.value
        })
      }
      if (this.searchData.date && this.searchData.date.length) {
        this.searchData.date.forEach((item, index) => {
          data[item.startName] = item.value[0]
          data[item.endName] = item.value[1]
        })
      }
      return data
    },

    /**
     * @description: 添加
     */

    handleAdd() {
      this.$emit('add')
    },

    /**
     * @description: 导出
     */

    handleExport() {
      this.$emit('export')
    }
  }
}
</script>
<style lang="scss" scoped>
.row__search {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.float-right {
  float: right;
}
.fixed-width {
  width: 200px;
}
.mar-right {
  margin-right: 20px;
}
</style>
