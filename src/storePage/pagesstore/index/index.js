// 获取全局应用程序实例对象
const app = getApp()
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabNav: [
      {
        t: '发布课程',
        url: '../releasePage/releaseCourse/releaseCourse',
        img: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/storeSide/index_1.png'
      },
      {
        t: '我的课程',
        url: '../coursePage/course/course',
        img: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/storeSide/index_2.png'
      },
      {
        t: '分享有奖',
        url: '/sharePage/pagesshare/share/share',
        img: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/storeSide/index_3.png'
      }
    ],
    testImg: app.data.testImg
  },
  upFormId (e) {
    app.upFormId(e)
  },
  getRoomInfo () {
    let that = this
    app.wxrequest({
      url: app.getUrl().teacherDotDetail,
      data: {
        user_id: app.gs('userInfoAll').id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          app.su('roomInfo', res.data.data)
          if (res.data.data) {
            that.data.hasShop = 1
          } else {
            that.data.hasShop = 0
          }
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  tabO (e) {
    if (this.data.hasShop === 0) return app.setToast(this, {content: '请先设置您的教室信息'})
    else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    }
  },
  getMsg () {
    let that = this
    app.wxrequest({
      url: app.getUrl().teacherActiveMsg,
      data: {
        user_id: app.gs('userInfoAll').id,
        num: 3
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          for (let v of res.data.data) {
            v.create_time = app.moment(v.create_time * 1000)
          }
          that.setData({
            MSG: res.data.data
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  getInfo () {
    let that = this
    app.wxrequest({
      url: app.getUrl().userInfo,
      data: {
        user_id: app.gs('userInfoAll').id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          app.su('userInfoAll', res.data.data)
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    app.setBar('首页')
    this.getInfo()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    // console.log(' ---------- onReady ----------')
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    this.getRoomInfo()
    this.getMsg()
    this.setData({
      move: !this.data.move
    })
    // console.log(' ---------- onShow ----------')
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    this.setData({
      move: !this.data.move
    })
    // console.log(' ---------- onHide ----------')
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {

    // console.log(' ---------- onUnload ----------')
  },
  onShareAppMessage () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    this.getRoomInfo()
    this.getInfo()
  }
})
