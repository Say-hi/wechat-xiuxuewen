// 获取全局应用程序实例对象
const app = getApp()
console.log(app.data.all_Screen)
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    systemVersion: app.data.systemVersion,
    num: 1,
    labelIndex: 0,
    all_Screen: app.data.all_screen,
    discount_name: app.gs('shopInfoAll').discount_name,
    discount_value: app.gs('shopInfoAll').discount_value
  },
  showImg (e) {
    wx.previewImage({
      urls: this.data.info.detail,
      current: this.data.info.detail[e.currentTarget.dataset.index]
    })
  },
  goSubmit () {
    if (this.data.num > this.data.info.sku[this.data.labelIndex].stock) return app.setToast(this, {content: '该产品已无库存'})
    if (this.data.addCar) {
      let that = this
      return app.wxrequest({
        url: app.getUrl().shopCartAdd,
        data: Object.assign({
          uid: app.gs('userInfoAll').id,
          mid: that.data.info.mid,
          count: that.data.num,
          sku_id: that.data.info.sku[that.data.labelIndex].id,
          pid: that.data.info.id
        }),
        success (res) {
          wx.hideLoading()
          if (res.data.status === 200) {
            wx.showToast({
              title: '添加成功'
            })
            that.setData({
              num: 1,
              buyMask: that.data.info.label * 1 !== -1
            })
          } else {
            app.setToast(that, {content: res.data.desc})
          }
        }
      })
    }
    let { img, title, label, sku, freight, id } = this.data.info
    app.su('buyInfo', [{
      id,
      img,
      title,
      label,
      freight,
      sku: sku[this.data.labelIndex],
      count: this.data.num
    }])
    wx.redirectTo({
      url: '../submit/submit?type=now'
    })
  },
  buy (e) {
    this.data.addCar = e.currentTarget.dataset.type === 'car'
    this.setData({
      buyMask: !this.data.buyMask
    })
  },
  noUse () {
    app.noUse()
  },
  numOperation (e) {
    let type = e.currentTarget.dataset.type
    if (type === 'add') {
      if (this.data.num >= this.data.info.sku[this.data.labelIndex].stock) return app.setToast(this, {content: '已达库存上限'})
      this.setData({
        num: ++this.data.num
      })
    } else {
      if (this.data.num <= 1) return
      this.setData({
        num: --this.data.num
      })
    }
  },
  chooseSp (e) {
    this.setData({
      labelIndex: e.currentTarget.dataset.index
    })
  },
  shopProduct (pid) {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopProduct,
      data: {
        pid
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          res.data.data.imgs = res.data.data.imgs ? res.data.data.imgs.split(',') : []
          res.data.data.detail = res.data.data.detail ? res.data.data.detail.split(',') : []
          app.setBar(res.data.data.title)
          res.data.data['stock'] = 0
          for (let v of res.data.data.sku) {
            v['discount'] = (v.price * that.data.discount_value).toFixed(2)
            res.data.data['stock'] += v.stock * 1
          }
          that.setData({
            info: res.data.data
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options
    })
    this.shopProduct(options.id)
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
