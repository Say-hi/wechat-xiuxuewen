/**
 * Created by Administrator on 2017/6/2.
 */
const baseDomain = 'https://teach.idwenshi.com/teaching/public/index.php'
const shopBaseDomain = 'https://teach.idwenshi.com/teach/teach/web/index.php'
const webBaseDomain = 'https://teach.idwenshi.com/teach/api/web/index.php'
// let baseDomain = 'https://www.1688rm.com'
const serviceUrl = {
  style: baseDomain + '/home/page', // 不填默认为1, 1表示中间菜单,2表示底部菜单,3表示广告图
  enum: baseDomain + '/home/enum', // 获取标签
  search: baseDomain + '/home/search', // 获取标签
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
  userLogistic: baseDomain + '/user/logistic', // 物流查询
  userInfo: baseDomain + '/user/info', // 用户信息
  userGift: baseDomain + '/user/gift', // 礼包
  formid: baseDomain + '/user/formid', // 收集formid
  payDot: baseDomain + '/pay/dot', // 支付成为门店入驻
  homeSearch: baseDomain + '/home/search', // 搜索关键字
  homeGrow: baseDomain + '/home/grow', // 成长阶梯
  homeEquity: baseDomain + '/home/equity', // 入驻
  homeReport: baseDomain + '/home/report', // 举报
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
  teacherUserMessage: baseDomain + '/teacher/user/message', // 消息通知
  teacherUserSys: baseDomain + '/teacher/user/sys_notice', // 系统通知
  teacherUserSysDetail: baseDomain + '/teacher/user/sys_detail', // 系统通修改为已读
  teacherUserEvaluateMsg: baseDomain + '/teacher/user/evaluate_msg', // 教师查看用户对视频的评价
  teacherUserVideoCollect: baseDomain + '/teacher/user/video_collect', // 教师查看用户的收藏的信息列表
  teacherUserCash: baseDomain + '/teacher/user/cash', // 教师提现
  teacherDotShare: baseDomain + '/teacher/dot/share', // 教师邀请
  teacherActiveMsg: baseDomain + '/teacher/active/msg', // 获取一条驻店课程消息
  teacherUserActive: baseDomain + '/teacher/user/active', // 获取线下课程
  // 商城接口
  shopCategoryList: shopBaseDomain + '/category/list', // 分类
  shopProductList: shopBaseDomain + '/product/list', // 商品
  shopInfo: shopBaseDomain + '/shop/info', // 商城信息
  shopVideoIncrease: shopBaseDomain + '/video/increase', // 增加点击量
  shopProduct: shopBaseDomain + '/product/detail', // 商品详情
  shopUserInfo: shopBaseDomain + '/user/info', // 商城用户信息
  shopUserReal: shopBaseDomain + '/user/real', // 商城用户名字修改
  shopUserFund: shopBaseDomain + '/user/fund', // 商城用户资金管理
  shopUserCash: shopBaseDomain + '/user/cash', // 商城用户资金提现
  shopUserInDetail: shopBaseDomain + '/user/indetail', // 商城用户收益明细
  shopUserRecord: shopBaseDomain + '/user/record', // 商城用户提现记录
  shopUserNotice: shopBaseDomain + '/user/notice', // 商城用户消息
  shopUserQrcode: shopBaseDomain + '/user/qrcode', // 商城用户二维码
  shopUserRead: shopBaseDomain + '/user/read', // 商城用户消息已读
  shopUserExplain: shopBaseDomain + '/user/explain', // 商城提现说明
  shopCartAdd: shopBaseDomain + '/cart/add', // 商城添加到购物车
  shopCartList: shopBaseDomain + '/cart/list', // 商城购物车
  shopCartDelete: shopBaseDomain + '/cart/delete', // 商城购物车删除
  shopCartChange: shopBaseDomain + '/cart/change', // 商城购物车数量修改
  shopCenter: shopBaseDomain + '/shop/center', // 商城中心
  shopSale: shopBaseDomain + '/shop/sale', // 商城中心
  shopRelease: shopBaseDomain + '/shop/release', // 商城产品上传
  shoPayDirect: shopBaseDomain + '/pay/direct', // 商城直接购买
  shoPayCart: shopBaseDomain + '/pay/cart', // 商城购物车购买
  shopAd: shopBaseDomain + '/shop/ad', // 商城广告
  shopEdit: shopBaseDomain + '/shop/edit', // 商城产品编辑
  shopSet: shopBaseDomain + '/shop/set', // 商城店铺名字修改
  shopUserOrders: shopBaseDomain + '/user/orders', // 商城用户店铺订单
  shopUserOperate: shopBaseDomain + '/user/operate', // 商城用户店铺订单状态修改
  shopExpress: shopBaseDomain + '/shop/express', // 商城订单发货
  shopTeam: shopBaseDomain + '/shop/team', // 商城分销商
  shopPayAgain: shopBaseDomain + '/pay/again', // 商城再次支付
  shopDeal: shopBaseDomain + '/shop/deal', // 商城产品操作
  shopBinding: shopBaseDomain + '/publicly/binding', // 商城用户绑定
  shopPhone: shopBaseDomain + '/wechat/phone', // 解密手机
  shopMoneyRuler: shopBaseDomain + '/shop/moneyruler', // 解密手机
  shopVideoList: shopBaseDomain + '/video/list', // 视频列表
  rechargeList: shopBaseDomain + '/recharge/lists', // 视频列表
  rechargePay: shopBaseDomain + '/recharge/pay', // 视频列表
  userscore: shopBaseDomain + '/user/score', // 视频列表
  userrecharge: shopBaseDomain + '/user/recharge', // 视频列表
  shopstar: shopBaseDomain + '/shop/star', // 视频列表
  ruleexplain: shopBaseDomain + '/rule/explain', // 视频列表
  // 拼团
  pinlist: shopBaseDomain + '/assemble/list',  // 拼团列表页
  pindetail: shopBaseDomain + '/assemble/detail',  // 拼团详情页
  pinteam: shopBaseDomain + '/assemble/detail',  // 正在拼团的用户信息列表
  pinrelease: shopBaseDomain + '/shops/release',  // 发布拼团商品
  refund: shopBaseDomain + '/assemble/refund',  // 拼团退款
  // 公众号接口
  profitDetail: webBaseDomain + '/user/profit-detail'

}
module.exports = serviceUrl
