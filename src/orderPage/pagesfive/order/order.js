// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testImg: 'https://c.jiangwenqiang.com/api/logo.jpg',
    currentIndex: 0,
    currentIndexTwo: 0,
    teamOrder: ['拼团中', '拼团成功', '拼团失败'],
    videoTab: [
      {
        t: '待付款'
      },
      {
        t: '待收货'
      },
      {
        t: '已完成'
      }
    ]
  },
  chooseIndex (e) {
    if (e.currentTarget.dataset.type === 'team') {
      this.setData({
        currentIndexTwo: e.currentTarget.dataset.index
      })
    } else {
      this.setData({
        currentIndex: e.currentTarget.dataset.index
      })
    }
  },
  getData () {
    let that = this
    app.wxrequest({
      url: app.getUrl().userActivePay,
      data: {
        user_id: app.gs('userInfoAll').id,
        status: that.data.currentIndex * 3
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          for (let v of res.data.data.lists) {
            v.create_time = app.momentFormat(v.create_time * 1000, 'MM月DD日 HH:MM')
          }
          that.setData({
            lists: that.data.lists ? that.data.lists.concat(res.data.data.lists) : res.data.data.lists,
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  pay (orderId, index) {
    let that = this
    app.wxrequest({
      url: app.getUrl().payActiveAgain,
      data: {
        order_id: orderId,
        openid: app.gs()
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          app.wxpay(Object.assign(res.data.data.msg, {
            success () {
              that.data.lists.splice(index, 1)
              that.setData({
                lists: that.data.lists
              })
              wx.navigateTo({
                url: `/offlinePage/pagesnine/offlineApply/offlineApply?trade=${that.data.lists[index].out_trade_no}`
              })
            },
            fail () {
              app.setToast(that, {content: '未完成支付'})
            }
          }))
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  orderOperation (e) {
    if (e.currentTarget.dataset.type === 'pay') {
      return this.pay(e.currentTarget.dataset.id, e.currentTarget.dataset.index)
    }
    let that = this
    app.wxrequest({
      url: app.getUrl().userActiveChange,
      data: {
        user_id: app.gs('userInfoAll').id,
        out_trade_no: that.data.lists[e.currentTarget.dataset.index].out_trade_no,
        style: e.currentTarget.dataset.type === 'cancel' ? 1 : e.currentTarget.dataset.type === 'del' ? 2 : 3
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.data.lists.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            lists: that.data.lists
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
    this.getData()
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
