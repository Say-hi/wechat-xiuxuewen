// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    tabIndex: 0,
    discount_name: app.gs('shopInfoAll').rule.state_name,
    discount_value: app.gs('shopInfoAll').rule.discount,
    tabNav: [
      {
        t: '全部',
        i: 0
      },
      {
        t: '待付款',
        i: -1
      },
      {
        t: '待发货',
        i: 1
      },
      {
        t: '待收货',
        i: 2
      },
      {
        t: '已完成',
        i: 3
      },
      {
        t: '退款中',
        i: 5
      }
    ],
    list: []
  },
  modal () {
    app.setToast(this, {content: '功能开发中，尚未开放'})
  },
  copy (e) {
    let that = this
    wx.setClipboardData({
      data: that.data.list[e.currentTarget.dataset.index][e.currentTarget.dataset.type],
      success () {
        wx.showToast({
          title: '复制成功'
        })
      }
    })
  },
  showExpress (e) {
    this.setData({
      expressObj: {
        out_trade_no: this.data.list[e.currentTarget.dataset.index].out_trade_no,
        order_num: this.data.list[e.currentTarget.dataset.index].order_num
      }
    })
  },
  tabChoose (e) {
    this.data.page = 0
    this.data.list = []
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    }, this.getList)
  },
  getList () {
    let that = this
    app.wxrequest({
      url: app.getUrl()[that.data.ping ? that.data.options.for === 'user' ? 'pinuserorder' : 'pinshoporder' : 'shopUserOrders'],
      data: that.data.ping ? {
        mid: that.data.options.for === 'user' ? 0 : app.gs('shopInfoAll').id,
        uid: that.data.options.for === 'user' ? app.gs('userInfoAll').id : app.gs('shopInfoAll').id,
        state: that.data.tabNav[that.data.tabIndex].i,
        page: ++that.data.page
      } : {
        uid: that.data.options.for === 'user' ? app.gs('userInfoAll').id : 0,
        // uid: that.data.options.for === 'user' ? 2 : 0,
        status: that.data.tabNav[that.data.tabIndex].i,
        page: ++that.data.page,
        mid: that.data.options.for === 'user' ? 0 : app.gs('shopInfoAll').id
        // mid: 10000
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          if (that.data.ping) {
            for (let v of res.data.data.lists) {
              // v.status = v.status * 1 === 11 ? 1 : v.status
              v.create_time = app.momentFormat(v.create_time * 1000, 'MM月DD日 HH:mm')
            }
          } else {
            let id = app.gs('userInfoAll').id * 1
            // let id = 2
            for (let v of res.data.data.lists) {
              v.create_time = app.momentFormat(v.create_time * 1000, 'MM月DD日 HH:mm')
              v['self'] = v.uid * 1 === id
              v['all_count'] = 0
              for (let s of v.list) {
                v['all_count'] += s.count * 1
              }
            }
          }
          that.setData({
            list: that.data.list.concat(res.data.data.lists),
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  cui () {
    app.setToast(this, {content: '无相关服务提供'})
  },
  change (e) {
    let that = this
    let state = (that.data.list[e.currentTarget.dataset.index].status < 0 && that.data.options.for === 'user') ? 4 : that.data.list[e.currentTarget.dataset.index].status * 1 === 2 ? 3 : ''
    app.wxrequest({
      url: app.getUrl()[that.data.ping ? 'pinoperate' : 'shopUserOperate'],
      data: {
        oid: that.data.list[e.currentTarget.dataset.index].id,
        uid: that.data.list[e.currentTarget.dataset.index].uid || app.gs('userInfoAll').id,
        mid: that.data.list[e.currentTarget.dataset.index].mid,
        state
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          if (that.data.tabIndex <= 0 && state !== 4) {
            that.setData({
              [`list[${e.currentTarget.dataset.index}].status`]: state
            })
          } else {
            that.data.list.splice(e.currentTarget.dataset.index, 1)
            that.setData({
              list: that.data.list
            })
          }
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  fahuo (e) {
    this.setData({
      fahuomask: !this.data.fahuomask,
      fahuoIndex: e ? e.currentTarget.dataset.index : -1
    })
  },
  deliver (e) {
    let that = this
    if (e.detail.value.name.length < 1) return app.setToast(this, {content: '请输入物流公司'})
    if (e.detail.value.num.length < 1) return app.setToast(this, {content: '请输入物流单号'})
    app.wxrequest({
      url: app.getUrl()[that.data.ping ? 'shopsExpress' : 'shopExpress'],
      data: {
        oid: that.data.list[that.data.fahuoIndex].id,
        mid: app.gs('shopInfoAll').id,
        logistics: e.detail.value.name,
        order_num: e.detail.value.num
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          wx.showToast({
            title: '发货成功'
          })
          if (that.data.tabIndex <= 0) {
            that.setData({
              [`list[${that.data.fahuoIndex}].status`]: 2,
              fahuomask: false
            })
          } else {
            that.data.list.splice(that.data.fahuoIndex, 1)
            that.setData({
              list: that.data.list,
              fahuomask: false
            })
          }
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  shareChange (e) {
    this.data.share_index = e.currentTarget.dataset.index
    this.setData({
      showShare: !this.data.showShare
    })
  },
  payAgain (e) {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopPayAgain,
      data: {
        oid: that.data.list[e.currentTarget.dataset.index].id,
        mid: that.data.list[e.currentTarget.dataset.index].mid,
        uid: app.gs('userInfoAll').id,
        openid: app.gs('userInfoAll').openid
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          app.wxpay2(res.data.data.msg)
            .then(() => {
              if (that.data.tabIndex > 0) {
                that.data.list.splice(e.currentTarget.dataset.index, 1)
                that.setData({
                  list: that.data.list
                })
              } else {
                that.setData({
                  [`list[${e.currentTarget.dataset.index}].status`]: 1
                })
              }
            })
            .catch(() => {
              wx.showToast({
                title: '支付失败'
              })
            })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  getMyShareCode () {
    let that = this
    app.wxrequest({
      url: app.getUrl().pinqrcode,
      data: {
        mid: that.data.list[that.data.share_index].mid,
        oid: that.data.list[that.data.share_index].id,
        uid: app.gs('userInfoAll').id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          wx.previewImage({
            urls: [res.data.data]
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  onShareAppMessage () {
    if (this.data.ping && this.data.share_index >= 0) {
      return {
        title: '快来和我一起参团享好物吧',
        path: `/shopListPage/shoplistpages/detail/detail?share=${this.data.list[this.data.share_index].id},${this.data.list[this.data.share_index].mid},${app.gs('userInfoAll').id},`,
        imageUrl: this.data.list[this.data.share_index].img
      }
    }
    if (!app.gs('shopInfo').mid) {
      return {
        title: app.gs('shareText').t || '绣学问，真纹绣',
        path: `/pages/index/index`,
        imageUrl: app.gs('shareText').g
      }
    } else {
      return {
        title: `向您推荐店铺【${app.gs('shopInfoAll').name}】`,
        imageUrl: `${app.gs('shopInfoAll').avatar || ''}`,
        path: `/shopPage/shoppages/index/index?mid=${app.gs('shopInfoAll').id}&user=${app.gs('userInfoAll').id}`
      }
    }
  },
  cancelping () {
    this.setData({
      cancelPing: !this.data.cancelPing
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    if (options.ping) {
      // this.data.tabNav.push({
      //   t: '退款中',
      //   i: 4
      // })
      this.data.tabNav = [
        {
          t: '全部',
          i: 1
        },
        {
          t: '拼团中',
          i: 6
        },
        {
          t: '待发货',
          i: 2
        },
        {
          t: '待收货',
          i: 3
        },
        {
          t: '已完成',
          i: 4
        },
        {
          t: '退款中',
          i: 5
        }
      ]
    }
    this.setData({
      options,
      ping: options.ping || false,
      tabIndex: options.type,
      tabNav: this.data.tabNav
    }, this.getList)
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
  onReachBottom () {
    if (this.data.more > 0) this.getList()
    else app.setToast(this, {content: '没有更多内容啦'})
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    this.data.page = 0
    this.data.list = []
    this.getList()
    // TODO: onPullDownRefresh
  }
})
