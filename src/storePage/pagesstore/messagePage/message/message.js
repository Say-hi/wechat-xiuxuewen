// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    messageArr: [
      {
        t: '系统通知',
        n: 0
      },
      {
        t: '评论',
        n: 0
      },
      {
        t: '收藏',
        n: 0
      }
    ]
  },
  getMessage () {
    let that = this
    app.wxrequest({
      url: app.getUrl().teacherUserMessage,
      data: {
        user_id: app.gs('userInfoAll').id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.data.messageArr[0].n = res.data.data.sys_notice
          that.data.messageArr[2].n = res.data.data.collect
          that.data.messageArr[1].n = res.data.data.video_msg
          that.setData({
            messageArr: that.data.messageArr
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('我的消息')
    this.getMessage()
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
