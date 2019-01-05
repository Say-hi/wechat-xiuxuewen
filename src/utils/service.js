/**
 * Created by Administrator on 2017/6/2.
 */
const baseDomain = 'https://teach.idwenshi.com/teaching/public/index.php'
// let baseDomain = 'https://www.1688rm.com'
const serviceUrl = {
  style: baseDomain + '/home/page', // 不填默认为1, 1表示中间菜单,2表示底部菜单,3表示广告图
  enum: baseDomain + '/home/enum', // 获取标签
  login: baseDomain + '/weixin/login', // 登陆
  course: baseDomain + '/course/last', // 课程
  courseSearch: baseDomain + '/course/search', // 搜索课程
  courseDetail: baseDomain + '/course/detail', // 课程详情
  courseStar: baseDomain + '/course/star', // 给课程评分
  courseEvaluateSub: baseDomain + '/course/evaluate_sub', // 提交课程评论
  courseDiscussSub: baseDomain + '/course/discuss_sub', // 提交评论的评论
  courseDiscuss: baseDomain + '/course/discuss', // 获取评论的评论
  evaluate: baseDomain + '/course/evaluate', // 课程评论
  question: baseDomain + '/question/problem', // 问答
  questionDetail: baseDomain + '/question/detail', // 问答详情
  questionDiscuss: baseDomain + '/question/discuss', // 问答回复列表
  questionDiscussSub: baseDomain + '/question/discuss_sub', // 问答回复
  questionProblemSub: baseDomain + '/question/problem_sub', // 提问
  questionProblemHot: baseDomain + '/question/problem_hot', // 热门提问
  questionProblemMy: baseDomain + '/question/problem_my', // 我的提问
  questionProblemMyCount: baseDomain + '/question/problem_my_count', // 我的提问未读数量
  upVideo: baseDomain + '/upload/video', // 视频上传
  dotNearby: baseDomain + '/dot/nearby', // 附近门店
  dotDetail: baseDomain + '/dot/detail', // 门店详情
  dotRelease: baseDomain + '/dot/release', // 门店课程
  dotSearch: baseDomain + '/dot/search', // 门店搜索
  activeNearby: baseDomain + '/active/nearby', // 附近课程
  activeDetail: baseDomain + '/active/detail', // 附近课程
  activeSearch: baseDomain + '/active/search', // 线下课程搜索
  activeEnum: baseDomain + '/active/enum', // 获取报名所需要的字段
  activeSign: baseDomain + '/active/sign_up', // 报名活动
  payActive: baseDomain + '/pay/active', // 支付
  payActiveAgain: baseDomain + '/pay/active_again', // 二次支付
  userFeedback: baseDomain + '/user/feedback', // 反馈
  userActive: baseDomain + '/user/active', // 用户预约
  userCollect: baseDomain + '/user/collect', // 用户收集的内容
  userActivePay: baseDomain + '/user/active_pay', // 用户订单
  userActiveChange: baseDomain + '/user/active_change', // 用户改变订单状态
  userCollectSub: baseDomain + '/user/collect_sub', // 用户收藏
  userCollectCancel: baseDomain + '/user/collect_cancel', // 用户取消收藏
  userInfo: baseDomain + '/user/info', // 用户信息
  upImage: baseDomain + '/upload/image', // 图片上传
  // 门店端接口
  teacherUserVideo: baseDomain + '/teacher/user/video', // 获取上传过的视频
  teacherCourseSub: baseDomain + '/teacher/course/sub', // 教师保存上传视频信息
  teacherCourseDel: baseDomain + '/teacher/course/del', // 教师删除上传视频信息
  teacherDotSub: baseDomain + '/teacher/dot/sub', // 门店信息插入记录
  teacherActiveSub: baseDomain + '/teacher/active/sub', // 线下课程保存
  teacherActiveDel: baseDomain + '/teacher/active/del', // 线下课程删除
  teacherDotDetail: baseDomain + '/teacher/dot/detail', // 获取门店信息
  teacherUserIncome: baseDomain + '/teacher/user/income', // 收益
  teacherUserActive: baseDomain + '/teacher/user/active' // 获取线下课程
}
module.exports = serviceUrl
