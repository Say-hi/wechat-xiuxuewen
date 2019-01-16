// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lvIndex: 0,
    tabIndex: 0,
    titleArr: ['第一阶段 夯实基础学技术', '第二阶段：个人素养应提升', '第三阶段：光环效应须“包装”'],
    videoUrl: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
    testImg: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/background/005.png'
  },
  showImg (e) {
    app.showImg(e.currentTarget.dataset.src, [e.currentTarget.dataset.src])
  },
  swiperChange (e) {
    this.setData({
      tabIndex: e.detail.current
    })
  },
  lvChoose (e) {
    this.setData({
      lvIndex: e.currentTarget.dataset.index
    })
  },
  chooseTab (e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
  },
  onShareAppMessage () {
    return {
      title: '纹饰美容的成长三步曲',
      path: `/newPage/pagesthrteen/new/new`
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    // TODO: onLoad
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    // TODO: onReady
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // TODO: onShow
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    // TODO: onHide
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    // TODO: onUnload
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // TODO: onPullDownRefresh
  }
})
