import { getCurrentTime } from './index'

/**
 * @description: 导出表格
 * @param {string} fileName 文件名称
 * @param {object} res 返回的blob对象
 * @return:
 */
export function exportExcel(fileName, res) {
  const nowTime = getCurrentTime()
  const exFileName = fileName + nowTime
  const link = document.createElement('a')
  const evt = document.createEvent('HTMLEvents')
  evt.initEvent('click', false, false)
  link.href = URL.createObjectURL(res)
  link.download = exFileName
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  window.URL.revokeObjectURL(link.href)
}
