<template>
  <div v-if="config" class="form__container">
    <el-form
      ref="noForm"
      class="no-form"
      v-bind="elFormProps"
      v-on="elFormEvents"
    >
      <template v-if="elFormItems && elFormItems.length">
        <template v-for="(item, index) in elFormItems">
          <el-form-item
            :key="`el-form-item-${index}`"
            v-bind="item.props"
          >
            <!-- <template v-if="item.slot && item.slot.length">
              <template v-for="(slot, index) in item.slot"> -->
            <component
              :is="item.slot.name"
              v-model="elFormProps.model[item.props.prop]"
              v-bind="item.slot.props"
              class="form-item-slot"
              v-on="item.slot.events"
            >
              <!-- 这里主要是为了兼容ele带插槽组件 同时也兼容到自定义复杂组件 -->
              <template v-if="handlerSlotChildren(item.slot.slot)">
                <template v-for="(child, childIndex) in item.slot.slot.list">
                  <component
                    :is="item.slot.slot.name"
                    :key="childIndex"
                    v-bind="child"
                  />
                </template>
              </template>
            </component>
            <!-- </template> -->
            <!-- </template> -->
          </el-form-item>
        </template>
      </template>
    </el-form>
    <section style="display: flex; justify-content: flex-end; width: 40%;">
      <template v-if="elFormOperates && elFormOperates.length">
        <template v-for="(operate, index) in elFormOperates">
          <el-button
            :key="index"
            v-bind="operate.props"
            style="width: 80px;"
            @click="handlerOperate(operate)"
          >
            {{ operate.label }}
          </el-button>
        </template>
      </template>
    </section>
  </div>
</template>

<script>
export default {
  name: 'NoForm',

  props: {
    value: { require: true, type: Object, default: () => {} },
    id: { type: String, default: '' } // 数据id 区分编辑和新增
  },

  data() {
    return {
      config: this.value
    }
  },

  computed: {
    elFormProps() {
      if (this.checkFormRuleAttr()) {
        return this.config.formRule.props
      }
      return {}
    },
    elFormEvents() {
      if (this.checkFormRuleAttr('events')) {
        return this.config.formRule.events
      }
      return {}
    },

    elFormItems() {
      if (this.config && Array.isArray(this.config.formItemsRule)) {
        return this.config.formItemsRule
      }
      return []
    },

    elFormOperates() {
      if (this.config && Array.isArray(this.config.formOperateRule)) {
        return this.config.formOperateRule
      }
      if (this.config && this.isObject(this.config.formOperateRule)) {
        return [this.config.formOperateRule]
      }
      return []
    }
  },

  watch: {
    config: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.$emit('input', val)
        }
      },
      deep: true
    },
    value: {
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.config = val
        }
      },
      deep: true
    }
  },

  created() {
    // this.handlerSlotDataType(); // 不提供复杂组件的渲染 - 自己去实现
  },

  methods: {
    isObject(obj) {
      return obj !== null && typeof obj === 'object'
    },
    checkFormRuleAttr(attr = 'props') {
      const aliasCofnig = this.config
      return aliasCofnig && aliasCofnig.formRule && this.isObject(aliasCofnig.formRule[attr])
    },
    handlerSlotDataType() {
      if (this.config && Array.isArray(this.config.formItemsRule)) {
        this.config.formItemsRule.forEach((item) => {
          if (item && !Array.isArray(item.slot)) {
            item.slot = [item.slot]
          }
        })
      }
    },
    handlerOperate(operate) {
      if (operate && operate.method instanceof Function) {
        operate.method(this, this.$refs.noForm)
      } else {
        console.error(
          `[no-form warn]: ${JSON.stringify(
            operate.method,
          )}  -  The operation response does not exist or the response is not a function`,
        )
      }
    },
    handlerSlotChildren(children) {
      if (children && this.isObject(children)) {
        return children
      }
      if (children && !this.isObject(children)) {
        console.error(
          `[no-form warn]: ${JSON.stringify(
            children,
          )}  - 「 formItemsRule  slot - slot 」must be an object.`,
        )
      }
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.form__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
}
.no-form {
  display: flex;
  flex-direction: column;
  width: 40%;
  margin-bottom: 50px;
}
.form-item-slot {
  width: 100%;
}
</style>
