// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoTab: [
      {
        t: '我的练习库'
      },
      {
        t: '已提交练习'
      },
      {
        t: '我的成绩单'
      }
    ],
    testImg: app.data.testImg,
    currentIndex: 0,
    imgArr: [
      {
        img: [app.data.testImg, app.data.testImg, app.data.testImg, app.data.testImg, app.data.testImg, app.data.testImg]
      },
      {
        img: [app.data.testImg, app.data.testImg, app.data.testImg, app.data.testImg, app.data.testImg, app.data.testImg]
      },
      {
        img: [app.data.testImg, app.data.testImg, app.data.testImg, app.data.testImg, app.data.testImg, app.data.testImg]
      },
      {
        img: [app.data.testImg, app.data.testImg, app.data.testImg, app.data.testImg, app.data.testImg, app.data.testImg]
      },
      {
        img: [app.data.testImg, app.data.testImg, app.data.testImg, app.data.testImg, app.data.testImg, app.data.testImg]
      }
    ]
  },
  navigate (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  chooseIndex (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
  },

  showImg (e) {
    app.showImg(this.data.imgArr[e.currentTarget.dataset.oindex].img[e.currentTarget.dataset.iindex], this.data.imgArr[e.currentTarget.dataset.oindex].img)
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
