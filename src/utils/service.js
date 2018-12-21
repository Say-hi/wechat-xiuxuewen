/**
 * Created by Administrator on 2017/6/2.
 */
const baseDomain = 'https://teach.idwenshi.com/teaching/public/index.php'
// let baseDomain = 'https://www.1688rm.com'
const serviceUrl = {
  style: baseDomain + '/home/page', // 不填默认为1, 1表示中间菜单,2表示底部菜单,3表示广告图
  login: baseDomain + '/api/index/login', // 登陆
  course: baseDomain + '/course/last', // 课程
  courseDetail: baseDomain + '/course/detail', // 课程详情
  evaluate: baseDomain + '/course/evaluate', // 课程评论
  upVideo: baseDomain + '/upload/video', // 视频上传
  upImage: baseDomain + '/upload/image' // 图片上传
}
module.exports = serviceUrl
