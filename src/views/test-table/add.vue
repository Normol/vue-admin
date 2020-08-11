<template>
  <div class="form-container">
    <el-form
      ref="doctorForm"
      :rules="rules"
      :model="doctorData"
      label-position="left"
      label-width="120px"
    >
      <el-form-item label="医生照片" prop="image">
        <span style="color:red">*</span>封面图片格式jpeg, png, 小于2M, 建议上传尺寸136*136px
        <upload :image.sync="doctorData.image" />
      </el-form-item>
      <el-form-item label="医生姓名" prop="name">
        <el-input v-model="doctorData.name" placeholder="请输入医生姓名" />
      </el-form-item>
      <el-form-item label="所属地区" prop="area">
        <el-input v-model="doctorData.area" placeholder="请输入所属地区" />
      </el-form-item>
      <el-form-item label="科室" prop="office">
        <el-input v-model="doctorData.office" placeholder="请输入科室" />
      </el-form-item>
      <el-form-item label="头衔" prop="honor">
        <el-input v-model="doctorData.honor" placeholder="请输入头衔" />
      </el-form-item>
      <el-form-item label="签约时间">
        <el-date-picker
          v-model="doctorData.contractTime"
          type="datetime"
          placeholder="选择签约时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item label="签约情况" prop="contractStatus">
        <el-select
          v-model="doctorData.contractStatus"
          class="filter-item"
          placeholder="签约状况"
          clearable
        >
          <el-option
            v-for="(item, index) in statusOptions"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="联络方式">
        <el-input v-model="doctorData.contact" placeholder="请输入联络方式" />
      </el-form-item>
      <el-form-item label="医生账号" prop="username">
        <el-input v-model="doctorData.username" placeholder="请输入医生账号" />
      </el-form-item>
      <el-form-item label="医生密码" prop="password">
        <el-input v-model="doctorData.password" placeholder="请输入医生密码" maxlength="6" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleConfirm">确认</el-button>
      <el-button type="info" @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import upload from '@/components/Upload'
import { rules } from '@/utils/rule'
export default {
  components: { upload },
  data() {
    return {
      doctorData: {}, // 医生表单数据
      rules: rules,
      type: '',
      statusOptions: [{ name: '签约', id: 1 }, { name: '解约', id: 0 }] // 状态搜索
    }
  },
  computed: {
    id() {
      if (this.$route.params.id && this.$route.params.id !== 0) { return this.$route.params.id }
      return null
    }
  },

  created() {
    // if (this.id) this.getDoctorInfo(this.id)
  },

  methods: {
    /**
     * @description: 确认提交表单
     * @return:
     */

    handleConfirm() {
      const that = this
      if (!this.doctorData.hospitalId) {
        this.$message({
          type: 'error',
          message: '请关联医院'
        })
        return
      }
      this.$refs.doctorForm.validate(valid => {
        if (valid) {
          if (that.id) that.doctorData.id = that.id
          checkDoctorAndHospitalNameExist(that.doctorData).then(res => {
            if (res.data) {
              that
                .$confirm(
                  '已存在相同名称、相同医院的医生，是否继续保存',
                  '提示',
                  {
                    confirmButtonText: '保存',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }
                )
                .then(() => {
                  if (that.id) that.handleConfirmUpdatedoctor()
                  else that.handleConfirmAdddoctor()
                })
                .catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消保存'
                  })
                })
            } else {
              if (that.id) that.handleConfirmUpdatedoctor()
              else that.handleConfirmAdddoctor()
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '操作失败'
          })
        }
      })
    },

    /**
     * @description: 添加医生
     * @return
     */
    handleConfirmAdddoctor() {
      addDoctor(this.doctorData)
        .then(res => {
          this.$message({
            type: 'success',
            message: '新增医生成功'
          })
          this.handleCancel()
        })
        .catch((err) => {
          console.log(err)
          this.$message({
            type: 'error',
            message: '新增医生失败'
          })
        })
    },

    /**
     * @description: 编辑医生
     * @return
     */
    handleConfirmUpdatedoctor() {
      EditDoctor(this.doctorData)
        .then(res => {
          this.$message({
            type: 'success',
            message: '编辑医生成功'
          })
          this.handleCancel()
        })
        .catch(err => {
          console.log(err)
          this.$message({
            type: 'error',
            message: '编辑医生失败'
          })
        })
    },

    /**
     * @description: 取消
     * @return
     */
    handleCancel() {
      this.doctorData = {}
      this.$store.dispatch('tagsView/delView', this.$route).then(() => {
        this.$router.push({
          path: '/doctor'
        })
      })
    },

    /**
     * @description: 打开关联医院弹框
     * @return:
     */
    handleConnectHospital() {
      this.getHospitalOptions()
      this.dialogConnectHospitalVisible = true
    },

    /**
     * @description: 提交关联医院的表单
     * @return:
     */
    handleSubmitSearchForm() {
      this.$refs.SearchHospitalForm.validate(valid => {
        if (valid) {
          this.$message({
            type: 'success',
            message: '关联成功'
          })
          this.dialogConnectHospitalVisible = false
          this.doctorData.hospitalId = this.searchData.hospital
          this.hospitalOption.forEach((item, index) => {
            if (item.id === this.searchData.hospital) { this.hospitalName = item.name }
          })
        } else {
          this.$message({
            type: 'error',
            message: '关联失败'
          })
        }
      })
    },

    /**
     * @description: 关闭关联医院弹框
     * @return:
     */
    handleCloseSearchHospitalForm() {
      this.dialogConnectHospitalVisible = false
      this.$refs.SearchHospitalForm.clearValidate()
      this.searchData = {}
    },

    /**
     * @description: 通过医生id获取医生信息
     * @param {string} id 医生id
     * @return:医生信息
     */
    getDoctorInfo(id) {
      getDoctorInfo(id)
        .then(res => {
          this.doctorData = res.data
          if (res.data.hospitalName) {
            this.hospitalOption = [
              {
                name: res.data.hospitalName,
                id: res.data.hospitalId
              }
            ]
          }
          this.searchData.hospital = res.data.hospitalId
          this.hospitalName = res.data.hospitalName
        })
        .catch(err => {
          console.log(err)
          this.doctorData = {}
        })
    }
  }
}
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
}
</style>
