// 表单验证规则
export const rules = {
  image: [{ required: true, message: '不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '不能为空', trigger: 'blur' }],
  area: [{ required: true, message: '不能为空', trigger: 'blur' }],
  office: [{ required: true, message: '不能为空', trigger: 'blur' }],
  honor: [{ required: true, message: '不能为空', trigger: 'blur' }],
  contractStatus: [
    { required: true, message: '不能为空', trigger: 'blur' }
  ],
  username: [{ required: true, message: '不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '不能为空', trigger: 'blur' }],
  hospital: [{ required: true, message: '不能为空', trigger: 'blur' }]
}

