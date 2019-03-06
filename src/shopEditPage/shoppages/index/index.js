// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sale: 1
  },
  blurinput (e) {
    let index = e.currentTarget.dataset.index
    if (index < 0) {
      this.setData({
        ['info.freight']: (e.detail.value * 1).toFixed(2)
      })
    } else {
      console.log(e)
      let str = `info.sku[${e.currentTarget.dataset.index}].${e.currentTarget.dataset.type === 'price' ? 'price' : 'stock'}`
      this.setData({
        [str]: (e.detail.value * 1).toFixed(e.currentTarget.dataset.type === 'price' ? 2 : 0)
      })
    }
  },
  back () {
    wx.navigateBack()
  },
  chooseSale (e) {
    this.setData({
      sale: e.currentTarget.dataset.type
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
          that.setData({
            info: res.data.data
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  release () {
    let info = this.data.info
    let that = this
    app.wxrequest({
      url: app.getUrl().shopEdit,
      data: {
        pid: info.id,
        mid: app.gs('shopInfoAll').id,
        parent_id: info.parent_id || info.id,
        title: info.title,
        img: info.img,
        old_price: info.old_price,
        freight: info.freight,
        is_up: that.data.sale === 1 ? 1 : -1,
        label: info.label,
        sku: JSON.stringify(info.sku)
      },
      success (res2) {
        wx.hideLoading()
        if (res2.data.status === 200) {
          wx.showToast({
            title: '添加成功'
          })
        } else {
          app.setToast(that, {content: res2.data.desc})
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.data.options = options
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
