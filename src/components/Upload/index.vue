<template>
  <!-- 单张图片上传 -->
  <div class="avatar-uploader--container">
    <el-upload
      class="avatar-uploader"
      :action="action"
      :headers="authorizationHeader"
      name="upfile"
      accept="image/jpeg,image/gif,image/png"
      :drag="true"
      :show-file-list="false"
      list-type="picture-card"
      :before-upload="beforeAvatarUpload"
      :on-success="getUploadPicture_image"
      :on-error="handleUploadError"
    >
      <img v-if="image" :src.sync="image">
      <i v-else class="el-icon-plus"></i>
    </el-upload>

    <el-popover v-if="image" placement="right" trigger="hover">
      <div class="preview_view">
        <img :src="image">
      </div>
      <div slot="reference" class="preview">预览</div>
    </el-popover>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth' // getToken from cookie
export default {
  data() {
    return {
      authorizationHeader: {
        authorization: getToken()
      },
      action: process.env.VUE_APP_BASE_API + '/file/upload'
    }
  },
  props: {
    image: {
      type: String,
      default: ''
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      const isJPG = file.type.indexOf('image') !== -1
      const isLt2M = file.size / 1024 / 1024 < 10

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 图片 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      }
      return isJPG && isLt2M
    },
    getUploadPicture_image(response, file, fileList) {
      if (response.code && response.code === 200) {
        this.$emit('update:image', response.data.url)
      } else {
        this.$message.error(response.message)
      }
    },
    handleUploadError(err, file) {
      this.$notify({
        title: '失败',
        type: 'error',
        message: '图片上传失败',
        duration: 2000
      })
      console.log(err)
    }
  }
}
</script>

<style lang="scss">
.el-upload-dragger{
    width: 100%;
    height: 100%;
  }
.preview_view {
  width: 300px;
  max-height: 400px;
  overflow-y: scroll;

  img {
    width: 100%;
    height: auto;
  }
}
.avatar-uploader--container {
  position: relative;
  width: 148px;
  height: 148px;
  .preview {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 0;
    right: 0;
    background: rgba($color: #000000, $alpha: 0.4);
    transform-origin: "background";
    transition-duration: 0.4s;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    font-size: 12px;
    border-bottom-left-radius: 10px;
    &:hover {
      background: #409eff;
    }
  }
}
.avatar-uploader {
  .el-upload {
    position: relative;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
</style>
