import { getAssistantList, deletAssistant } from '@/api/assistant'
export const baseAssemblerConfig = (Vue) => {
  return {
    // 表格请求方法
    getListToRequest: (queryParams = {}) => {
      return getAssistantList(queryParams)
    },

    filter: {
      realTimeRemoteSearch: false, // 是否开启实时搜索
      showAddButton: {
        isshow: true,
        addUrl: 'add/0'
      } // 是否显示添加按钮
    },

    table: {
      tableProps: {
        data: []
      },
      tableEvents: {
        'selection-change': selection => {} //  响应 - 行选择变化
      },
      tableColumnList: [
        {
          prop: 'id',
          label: '编号'
        },
        {
          prop: 'title',
          label: '主题',
          query: {
            is: 'el-input',
            props: {
              placeholder: '请输入小助手主题'
            }
          }
        },
        {
          label: '头像',
          prop: 'image',
          component: {
            is: 'table-column-images'
          }
        },
        {
          prop: 'nickname',
          label: '昵称',
          query: {
            is: 'el-input',
            props: {
              placeholder: '请输入小助手昵称'
            }
          }
        },
        {
          label: '二维码',
          prop: 'qycode',
          component: {
            is: 'table-column-images'
          }
        },
        {
          label: '提示语',
          prop: 'tips'
        },
        {
          label: '状态',
          prop: 'status',
          component: {
            is: 'el-switch',
            props: {
              activeColor: '#13ce66',
              inactiveColor: '#ff4949',
              activeValue: 0,
              inactiveValue: 1
            },
            events: function(row) {
              return {
                'change': () => {
                  console.log(row)
                }
              }
            }
          }
        }
      ],
      rowOperateList: operateList(), // 表格操作项
      isRenderSerialNumber: false, // 是否渲染序列号
      selectionColumnProps: {}
    },

    pagination: {
      // pageSizes: [10, 20, 30, 40], // 分页器 - 页尺寸规格列表
    }
  }
  function operateList() {
    return row => {
      const list = [
        createCode(),
        editData(),
        deleteData()
      ]
      if (row.status) {
        list.push(createCode('操作二'))
      }
      return list
    }
  }

  function createCode() {
    return {
      label: '生成二维码',
      type: 'primary',
      method: (row, that) => {
        that.$message({
          showClose: true,
          message: '操作成功',
          type: 'success'
        })
      }
    }
  }

  function editData() {
    return {
      label: '编辑',
      type: 'primary',
      method: (row, that) => {
        // edit 操作
        that.$router.push({
          path: `add/${row.id}`
        })
      }
    }
  }
  function deleteData() {
    return {
      label: '删除',
      type: 'danger',
      method: (row, that) => {
        // delete 操作
        deletAssistant(row.id).then(res => {
          that.$emit('refresh')
          that.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
        })
      }
    }
  }
}
