/**
 * 整体表单配置项
 */
import {
  addAssistant,
  updateAssistant
} from '@/api/assistant'
export const formConfig = (Vue) => ({
  formRule: {
    props: {
      model: {
        title: '',
        image: '',
        nickname: '',
        qycode: '',
        tips: ''
      },
      rules: {
        title: [{ required: true, message: '请输入小助手主题' }],
        image: [{ required: true, message: '请上传头像' }],
        nickname: [{ required: true, message: '请输入请输入昵称' }],
        qycode: [{ required: true, message: '请上传二维码' }],
        tips: [{ required: true, message: '请输入提示语' }]
      },
      'label-width': '120px',
      'label-suffix': ':'
    }
  },
  formItemsRule: [
    {
      props: {
        label: '头像',
        prop: 'image'
      },
      slot: {
        name: 'upload-image',
        props: {
          image: ''
        },
        events: {
          'uploadSuccess': (val) => {
            Vue.config.formRule.props.model.image = val
            Vue.config.formItemsRule.forEach((item) => {
              if (item.props.prop === 'image') {
                item.slot.props.image = val
              }
            })
          }
        }
      }
    },
    {
      props: {
        label: '二维码',
        prop: 'qycode'
      },
      slot: {
        name: 'upload-image',
        props: {
          image: ''
        },
        events: {
          'uploadSuccess': (val) => {
            Vue.config.formRule.props.model.qycode = val
            Vue.config.formItemsRule.forEach((item) => {
              if (item.props.prop === 'qycode') {
                item.slot.props.image = val
              }
            })
          }
        }
      }
    },
    {
      props: {
        label: '主题',
        prop: 'title'
      },
      slot: {
        name: 'el-input',
        props: {
          placeholder: '请输入小助手主题',
          clearable: true
        }
      }
    },
    {
      props: {
        label: '昵称',
        prop: 'nickname'
      },
      slot: {
        name: 'el-input',
        props: {
          placeholder: '请输入昵称',
          clearable: true
        }
      }
    },
    {
      props: {
        label: '提示语',
        prop: 'tips'
      },
      slot: {
        name: 'el-input',
        props: {
          placeholder: '请输入提示语',
          clearable: true
        }
      }
    }
  ],
  formOperateRule: [
    {
      label: '取消',
      props: {
        size: 'medium'
      },
      method: () => {
        Vue.$store.dispatch('tagsView/delView', Vue.$route).then(() => {
          Vue.$router.push({
            path: '/test'
          })
        })
      }
    },
    {
      label: '确定',
      props: {
        size: 'medium',
        type: 'primary'
      },
      method: (that, ref) => {
        console.log('id', that.id) // 根据id区分编辑和新增
        ref.validate(valid => {
          if (valid) {
            if (that.id) {
              addAssistant(Vue.config.formRule.props.model).then(res => {
                Vue.$message({
                  type: 'success',
                  message: '添加成功'
                })
              })
            } else {
              updateAssistant(Vue.config.formRule.props.model).then(res => {
                Vue.$message({
                  type: 'success',
                  message: '编辑成功'
                })
              })
            }
          }
        })
      }
    }
  ]
})
