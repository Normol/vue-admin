<template>
  <no-form :id="id" v-model="config" />
</template>
<script>
import NoForm from '../../components/no-form'
import { formConfig } from './add'
import {
  getHelplerById
} from '@/api/assistant'
export default {
  name: 'Add',
  components: { NoForm },
  data() {
    return {
      config: formConfig(this)
    }
  },
  computed: {
    id() {
      if (this.$route.params && this.$route.params.id && Number(this.$route.params.id)) {
        return this.$route.params.id
      }
      return null
    }
  },
  created() {
    if (this.id) this.getHelplerById(this.id)
  },
  methods: {
    /**
     * @description: 获取小助手信息
     * @param {type}
     * @return:
     */
    getHelplerById(id) {
      getHelplerById(id).then(res => {
        console.log(res)
        // 获取到的信息替换formRule.props.model的值
      })
    }
  }
}
</script>
<style lang="less" scoped>

</style>

