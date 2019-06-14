// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user_zhipiao: false,
    discount_name: app.gs('shopInfoAll').rule.state_name || '无折扣',
    discount_value: app.gs('shopInfoAll').rule.discount || 1
  },
  choosezhipiao () {
    let that = this
    this.setData({
      user_zhipiao: !this.data.user_zhipiao
    }, function () {
      if (that.data.user_zhipiao) {
        that.setData({
          finish_pay: that.data.finish_pay - that.data.recharge <= 0 ? '0.00' : (that.data.finish_pay - that.data.recharge).toFixed(2)
        })
      } else {
        that.setData({
          finish_pay: (that.data.AllPay * 1 + that.data.maxFreight * 1).toFixed(2)
        })
      }
    })
  },
  // 选择地址
  chooseAddress () {
    if (this.data.lostTime) return
    let that = this
    wx.chooseAddress({
      success (res) {
        if (res.telNumber) { // 获取信息成功
          wx.setStorageSync('addressInfo', res)
          that.setData({
            needSetting: false,
            addressInfo: res
          })
        }
      },
      fail () {
        wx.getSetting({
          success (res) {
            if (!res.authSetting['scope.address']) {
              that.setData({
                needSetting: true
              })
              app.setToast(that, {content: '需授权获取地址信息'})
            }
          }
        })
      }
    })
  },
  // 获取设置
  openSetting () {
    let that = this
    wx.openSetting({
      success (res) {
        // console.log(res)
        if (res.authSetting['scope.address']) {
          that.setData({
            needSetting: false
          })
          that.chooseAddress()
        }
      }
    })
  },
  gohome () {
    wx.reLaunch({
      url: '/shopPage/shoppages/index/index'
    })
  },
  onShareAppMessage () {
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
  // 立即付款
  shoPayDirect () {
    let that = this
    let carts = []
    if (this.data.type === 'car') {
      for (let v of this.data.info) {
        carts.push({
          pid: v.pid,
          count: v.count,
          value: v.value,
          sku_id: v.sku_id
        })
      }
    }
    app.wxrequest({
      url: app.getUrl()[that.data.payid ? 'shopPayAgain' : that.data.type === 'car' ? 'shoPayCart' : 'shoPayDirect'],
      data: that.data.payid ? {
        oid: that.data.payid,
        mid: app.gs('shopInfoAll').id,
        uid: app.gs('userInfoAll').id,
        openid: app.gs('userInfoAll').openid
      } : Object.assign(
        {
          name: that.data.addressInfo.userName,
          phone: that.data.addressInfo.telNumber,
          recharge: that.data.user_zhipiao ? that.data.recharge < (that.data.AllPay * 1 + that.data.maxFreight * 1) ? that.data.recharge : (that.data.AllPay * 1 + that.data.maxFreight * 1).toFixed(2) : 0,
          address: `${that.data.addressInfo.provinceName}${that.data.addressInfo.cityName}${that.data.addressInfo.countyName}${that.data.addressInfo.detailInfo}`,
          mid: app.gs('shopInfoAll').id,
          uid: app.gs('userInfoAll').id,
          openid: app.gs('userInfoAll').openid
        }, that.data.type === 'car' ? {
          carts: JSON.stringify(carts)
        } : {
          pid: that.data.info[0].id,
          value: that.data.info[0].sku.value,
          sku_id: that.data.info[0].sku.id,
          count: that.data.info[0].count
        }
      ),
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.data.payid = res.data.data.oid
          if (that.data.type === 'car') {
            let del = []
            for (let v of that.data.info) {
              del.push({id: v.id})
            }
            app.wxrequest({
              url: app.getUrl().shopCartDelete,
              data: {
                uid: app.gs('userInfoAll').id,
                cart_id: JSON.stringify(del)
              },
              complete () { wx.hideLoading() }
            })
          }
          if (res.data.data.pay_way * 1 === 2) {
            that.setData({
              need_pay: true
            })
            wx.removeStorageSync('buyInfo')
          } else {
            app.wxpay2(res.data.data.msg)
              .then(() => {
                that.setData({
                  need_pay: true
                })
                wx.removeStorageSync('buyInfo')
              })
              .catch(() => {
                wx.showToast({
                  title: '支付失败'
                })
              })
          }
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  upFormId (e) {
    app.upFormId(e)
  },
  submit () {
    if (!this.data.addressInfo) return app.setToast(this, {content: '请选择您的收货地址'})
    this.shoPayDirect()
  },

  shopInfo () {
    return new Promise((resolve, reject) => {
      let that = this
      app.wxrequest({
        url: app.getUrl().shopInfo,
        data: {
          mid: app.gs('shopInfo').mid || 10000
        },
        success (res) {
          wx.hideLoading()
          if (res.data.status === 200) {
            that.getUser()
            app.su('shopInfoAll', res.data.data)
            that.setData({
              discount_value: res.data.data.rule.discount || 1
            })
            resolve()
          } else {
            app.setToast(that, {content: res.data.desc})
          }
        }
      })
    })
  },
  getUser () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopUserInfo,
      data: {
        // uid: 10000
        uid: app.gs('userInfoAll').id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          app.su('userInfoAll', res.data.data)
          that.setData({
            recharge: res.data.data.recharge || 0,
            agents: res.data.data.mall_is > 0
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
  onLoad (options) {
    let that = this
    this.shopInfo()
      .then(() => {
        let allCount = 0
        let Allmoney = 0
        let maxFreight = 0
        that.data.type = options.type
        if (options.type === 'car') {
          for (let v of app.gs('buyInfo')) {
            allCount += v.count * 1
            Allmoney += v.count * v.price
            maxFreight = maxFreight > v.freight ? maxFreight : v.freight
          }
        } else {
          for (let v of app.gs('buyInfo')) {
            allCount += v.count
            Allmoney += v.count * v.sku.price
            maxFreight = maxFreight > v.freight ? maxFreight : v.freight
          }
        }
        that.setData({
          info: app.gs('buyInfo'),
          allCount,
          // Allmoney: (Allmoney * (this.data.type === 'now' ? this.data.discount_value : 1)).toFixed(2),
          Allmoney: Allmoney.toFixed(2),
          AllPay: (Allmoney * that.data.discount_value).toFixed(2),
          maxFreight: maxFreight > 0 ? maxFreight : app.gs('shopInfoAll').rule.low_total_fee > Allmoney ? app.gs('shopInfoAll').rule.logistic_fee : maxFreight,
          addressInfo: app.gs('addressInfo') || null
        }, function () {
          that.setData({
            finish_pay: (that.data.AllPay * 1 + that.data.maxFreight * 1).toFixed(2)
          })
        })
      })
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
    wx.removeStorageSync('buyInfo')
    // TODO: onUnload
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // TODO: onPullDownRefresh
  }
})
