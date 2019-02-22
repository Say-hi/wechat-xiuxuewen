// 获取全局应用程序实例对象
const app = getApp()
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: 'collage',
    openType: 'share',
    page: 0,
    lists: [],
    testImg: app.data.testImg
  },
  upFormId (e) {
    app.upFormId(e)
  },
  getList () {
    let that = this
    app.wxrequest({
      url: app.getUrl().teacherUserIncome,
      data: {
        user_id: app.gs('userInfoAll').id,
        page: ++that.data.page
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          for (let v of res.data.data.lists) {
            v.create_time = app.momentFormat(v.create_time * 1000, 'YYYY年MM月DD日 HH:SS')
          }
          that.setData({
            lists: that.data.lists.concat(res.data.data.lists),
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  onReachBottom () {
    if (this.data.more >= 1) this.getList()
    else app.setToast(this, {content: '没有更多内容啦'})
  },
  moneyOut () {
    let that = this
    if (that.data.userInputMoney <= 0.1) return app.setToast(this, {content: '提现金额不能小于0.1元'})
    app.wxrequest({
      url: app.getUrl().teacherUserCash,
      data: {
        user_id: app.gs('userInfoAll').id,
        openid: app.gs(),
        amount: that.data.userInputMoney
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          wx.showToast({
            title: '申请成功'
          })
          that.moneyOperation({
            currentTarget: {
              dataset: {
                type: 'change'
              }
            }
          })
          that.getRoomInfo()
        } else {
          app.setToast(that, {content: res.data.desc})
          that.moneyOperation({
            currentTarget: {
              dataset: {
                type: 'change'
              }
            }
          })
          that.getRoomInfo()
        }
      }
    })
  },
  moneyOperation (e) {
    if (e.currentTarget.dataset.type === 'confirm') {
      this.moneyOut()
    } else {
      this.setData({
        getMoneyShow: !this.data.getMoneyShow
      })
    }
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
          that.setData({
            putMoney: res.data.data.put_money,
            totalFee: res.data.data.total_fee
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  outMoney (e) {
    let that = this
    console.log(e)
    that.setData({
      userInputMoney: e.detail.value * 1 > that.data.totalFee ? that.data.totalFee : e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('我的收益')
    this.getList()
    this.getRoomInfo()
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
    this.data.page = 0
    this.data.lists = []
    this.getList()
    // TODO: onPullDownRefresh
  }
})
