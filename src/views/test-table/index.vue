<template>
  <div class="app-container">
    <!-- 搜索组件 -->
    <table-search
      :search="search"
      @search="handleTableSearch"
      @add="handleAdd"
      @export="handleExport"
    />

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="编号" prop="id" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主题" prop="title" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.image" width="100" height="80" />
        </template>
      </el-table-column>
      <el-table-column label="昵称" prop="nickname" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="二维码" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.qycode" width="100" height="80" />
        </template>
      </el-table-column>
      <el-table-column label="提示语" prop="tips" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tips }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="0"
            :inactive-value="1"
            @change="handleChangeStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="290">
        <template slot-scope="scope" label="操作">
          <el-button
            type="info"
            size="mini"
            class="button--create"
            @click="handleCodeDialogShow(scope.row.id)"
          >创建</el-button>
          <el-button
            v-permission="['HELPER_WRITE']"
            type="info"
            size="mini"
            @click="handleUpdateAssistant(scope.row)"
          >编辑</el-button>
          <el-button
            v-permission="['HELPER_DELETE']"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row.id,scope.row.status)"
          >删除</el-button>
          <el-button
            type="primary"
            size="mini"
            v-clipboard:copy="total"
            v-clipboard:success="handleClipboardSuccess"
          >复制</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="getPageList"
    />

    <el-dialog
      v-if="dialogAssistantVisible"
      :visible.sync="dialogAssistantVisible"
      :title="title"
      @close="handleCloseAssistantDialog"
    >
      <el-form
        ref="assistantForm"
        :rules="rules"
        :model="assistantData"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="主题" prop="title">
          <el-input v-model="assistantData.title" placeholder="请输入小助手主题" />
        </el-form-item>
        <el-form-item label="头像" prop="image">
          <upload :image.sync="assistantData.image" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="assistantData.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="二维码" prop="qycode">
          <upload :image.sync="assistantData.qycode" />
        </el-form-item>
        <el-form-item label="提示语" prop="tips">
          <el-input v-model="assistantData.tips" placeholder="请输入提示语" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="dialogStatus === 'create'"
          type="primary"
          @click="handleConfirmAddAssistant"
        >确认</el-button>
        <el-button v-else type="primary" @click="handleConfirmUpdateAssistant">确认</el-button>
      </div>
    </el-dialog>

    <!-- 生成二维码 -->
    <el-dialog
      v-if="dialogCodeVisible"
      :visible.sync="dialogCodeVisible"
      title="生成二维码"
      @close="handleCloseCodeForm"
    >
      <el-form
        ref="codeForm"
        :rules="rules"
        :model="codeData"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="数量" prop="count">
          <el-input v-model="codeData.count" placeholder="请输入二维码生成数量" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmitCodeForm">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import Clipboard from '@/directive/clipboard'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import TableSearch from '@/components/TableSearch'
import { rules } from '@/utils/rule'
export default {
  directives: { waves, Clipboard },
  components: { Pagination, TableSearch },
  data() {
    return {
      list: [], // 数据数组
      total: 10, // 数据条数
      listLoading: false, // 表格加载状态
      listQuery: {
        pageNo: 1,
        pageSize: 10
      },
      rules: rules, // 表单验证规则
      dialogStatus: '',
      statusOptions: [{ name: '上线', id: 0 }, { name: '下线', id: 1 }], // 状态搜索
      dialogCodeVisible: false, // 生成二维码弹框
      codeData: {
        id: '',
        count: ''
      }, // 生成二维码表单
      assistantId: null, // 生成二维码的小助手id
      assistantData: {}, // 小助手表单
      dialogAssistantVisible: false, // 新增编辑小助手弹框

      search: {
        input: [
          { value: null, placeholder: '测试输入框1', name: 'title' },
          { value: null, placeholder: '测试输入框2', name: 'name' }
        ],
        select: [
          {
            value: null,
            placeholder: '测试下拉框',
            name: 'status',
            options: [{ value: 1, label: '测试' }]
          }
        ],
        date: [
          {
            value: null,
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
            name: 'time',
            startName: 'startName',
            endName: 'endName'
          }
        ]
      },
      searchVal: null
    }
  },
  computed: {
    title() {
      if (this.dialogStatus === 'create') return '新增小助手'
      else return '编辑小助手'
    }
  },
  created() {
    // this.getList();
  },
  methods: {
    /**
     * @description: 获取小助手数据
     * @return
     */
    getList(param) {
      this.listLoading = true
      // getAssistantList(param).then(res => {
      //   this.list = res.data.list
      //   this.total = res.data.total
      //   setTimeout(() => {
      //     this.listLoading = false
      //   }, 0.5 * 1000)
      // })
    },

    /**
     * @description: 分页搜索数据
     * @return:
     */
    getPageList() {
      let param
      if (this.searchVal) { param = Object.assign({}, this.searchVal, this.listQuery) } else param = this.listQuery
      this.getList(param)
    },

    /**
     * @description: 搜索
     * @param {type}
     * @return:
     */
    handleTableSearch(val) {
      this.listQuery.pageNo = 1
      this.searchVal = val
      const param = Object.assign({}, this.listQuery, val)
      this.getList(param)
    },

    /**
     * @description: 添加
     * @return:
     */
    handleAdd() {
      this.$router.push({
        path: 'add'
      })
    },

    /**
     * @description: 导出
     * @return:
     */
    handleExport() {},

    /**
     * @description: 复制文本
     * @return:
     */
    handleClipboardSuccess() {
      this.$message({
        message: '复制成功',
        type: 'success',
        duration: 1500
      })
    },
    /**
     * @description: 打开添加小助手弹框
     * @return
     */
    handleAddAssistant() {
      this.dialogAssistantVisible = true
      this.dialogStatus = 'create'
    },

    /**
     * @description: 添加小助手
     * @return
     */
    handleConfirmAddAssistant() {
      this.$refs.assistantForm.validate(valid => {
        if (valid) {
          // addAssistant(this.assistantData).then(res => {
          //   this.dialogAssistantVisible = false
          //   this.assistantData = {}
          //   this.$message({
          //     type: 'success',
          //     message: '小助手新增成功'
          //   })
          //   this.getList()
          // })
        }
      })
    },

    /**
     * @description: 打开编辑小助手弹框
     * @param {object} item 该小助手的信息
     * @return
     */
    handleUpdateAssistant(item) {
      this.dialogAssistantVisible = true
      this.dialogStatus = 'update'
      this.assistantData = Object.assign({}, item)
    },

    /**
     * @description: 编辑小助手
     * @return
     */
    handleConfirmUpdateAssistant() {
      this.$refs.assistantForm.validate(valid => {
        if (valid) {
          // updateAssistant(this.assistantData).then(res => {
          //   this.$message({
          //     type: 'success',
          //     message: '小助手编辑成功'
          //   })
          //   this.dialogAssistantVisible = false
          //   this.assistantData = {}
          //   this.getList()
          // })
        } else {
          this.$message({
            type: 'error',
            message: '小助手编辑失败'
          })
        }
      })
    },

    /**
     * @description: 删除小助手
     * @param {string} id 小助手id
     * @return:
     */
    handleDelete(id, status) {
      if (status === 0) {
        this.$alert('下架该数据才能删除', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$confirm('是否删除该小助手', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // deletAssistant(id).then(res => {
          //   this.$message({
          //     type: 'success',
          //     message: '删除成功!'
          //   })
          //   this.getList()
          // })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    /**
     * @description: 关闭新增和编辑 小助手弹框
     * @return
     */
    handleCloseAssistantDialog() {
      this.assistantData = {}
      this.$refs.assistantForm.clearValidate()
    },

    /**
     * @description: 打开二维码弹框
     * @param {string} id 小助手id
     * @return
     */
    handleCodeDialogShow(id) {
      this.dialogCodeVisible = true
      this.codeData.id = id
    },

    /**
     * @description: 提交生成二维码表单
     * @return
     */
    handleSubmitCodeForm() {
      // createCode(this.codeData).then(res => {
      //   this.dialogCodeVisible = false
      //   this.$message({
      //     type: 'success',
      //     message: '生成二维码成功'
      //   })
      //   this.getList()
      // })
    },

    /**
     * @description: 关闭二维码弹框
     * @return
     */
    handleCloseCodeForm() {
      this.codeData = {}
      this.$refs.codeForm.clearValidate()
    },

    /**
     * @description: 改变小助手的状态
     * @param {object} item 小助手数据
     * @return
     */
    handleChangeStatus(row) {
      this.$confirm('是否改变小助手的状态', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // changeAssistantStatus(row.id, row.status).then(res => {
          //   this.$message({
          //     type: 'success',
          //     message: '操作成功!'
          //   })
          //   this.getList()
          // })
        })
        .catch(() => {
          row.status === 0 ? (row.status = 1) : (row.status = 0)
        })
    },

    /**
     * @description: 导出小助手
     * @return
     */
    handleExportAssistant() {
      // exportAssistant(this.listQuery).then(res => {
      //   exportExcel('小助手-新表-', res)
      // })
    }
  }
}
</script>
<style scoped>
.float-right {
  float: right;
}
.fixed-width {
  width: 200px;
}
.button--create {
  width: 100px;
}
.logo {
  width: 200px;
  height: 180px;
  object-fit: cover;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
}
.avatar {
  width: 178px;
  height: 178px;
}
.logo {
  width: 40px;
  height: 40px;
}
</style>
