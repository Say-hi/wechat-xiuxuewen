// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    labelIndex: 0,
    specifi: [
      {
        t: 'color',
        chooses: [
          {
            t: '可可棕',
            id: 1
          },
          {
            t: '可可棕',
            id: 1
          },
          {
            t: 'adsf',
            id: 1
          },
          {
            t: 'adsf',
            id: 1
          },
          {
            t: 'adsf',
            id: 1
          },
          {
            t: 'adsf',
            id: 1
          },
          {
            t: 'adsf',
            id: 1
          },
          {
            t: 'adsf',
            id: 1
          },
          {
            t: 'adsf',
            id: 1
          },
          {
            t: 'adsf',
            id: 1
          },
          {
            t: 'adsf',
            id: 1
          },
          {
            t: 'adsf',
            id: 1
          }
        ]
      },
      {
        t: 'color',
        chooses: [
          {
            t: 'adsf',
            id: 1
          },
          {
            t: 'adsf',
            id: 1
          },
          {
            t: 'adsf',
            id: 1
          },
          {
            t: 'adsf',
            id: 1
          }
        ]
      },
      {
        t: 'color',
        chooses: [
          {
            t: 'adsf',
            id: 1
          },
          {
            t: 'adsf',
            id: 1
          },
          {
            t: 'adsf',
            id: 1
          },
          {
            t: 'adsf',
            id: 1
          }
        ]
      },
      {
        t: 'color',
        chooses: [
          {
            t: 'adsf',
            id: 1
          },
          {
            t: 'adsf',
            id: 1
          },
          {
            t: 'adsf',
            id: 1
          },
          {
            t: 'adsf',
            id: 1
          }
        ]
      }
    ]
  },
  goSubmit () {
    wx.navigateTo({
      url: '../submit/submit'
    })
  },
  buy (e) {
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
  // chooseSp (e) {
  //   let that = this
  //   let {oindex, index} = e.currentTarget.dataset
  //   for (let v of that.data.specifi[oindex].chooses) {
  //     v['choose'] = false
  //   }
  //   that.data.specifi[oindex].chooses[index]['choose'] = true
  //   let setStr = `specifi[${oindex}]`
  //   this.setData({
  //     [setStr]: that.data.specifi[oindex]
  //   })
  // },
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
        path: `/shopPage/shoppages/index/index?mid=${app.gs('shopInfoAll').id}`
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
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
