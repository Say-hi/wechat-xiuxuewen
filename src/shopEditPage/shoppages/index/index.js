// 获取全局应用程序实例对象
const app = getApp()
const UpLoad = require('../upLoad')
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
          try {
            let sku = res.data.data.sku
            sku.map((v, i) => {
              if (!v.img) {
                sku[i].img = []
              } else {
                let temp = v.img.split(',')
                let tempArr = []
                temp.map((vv, ii) => {
                  tempArr.push({
                    temp: vv,
                    key: vv,
                    real: vv,
                    progress: 100
                  })
                })
                sku[i].img = tempArr
              }
            })
          } catch (err) {
            console.log(err)
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
  release () {
    let info = this.data.info
    let that = this
    let SKUS = info.sku
    info.sku.map((v, index) => {
      let temp = []
      if (!v.img.length) temp.push(info.img)
      v.img.map((s, y) => {
        if (s.progress < 98) return app.setToast(that, {content: `请等待【${v.value <= -1 ? '统一规格' : v.value}】分类的图片上传完成`})
        temp.push(s.real)
      })
      SKUS[index].img = temp.join(',')
    })
    app.wxrequest({
      url: app.getUrl().shopEdit,
      data: {
        pid: info.id,
        cid: info.cid,
        imgs: info.imgs,
        mid: app.gs('shopInfoAll').id,
        parent_id: info.id || info.parent_id,
        title: info.title,
        img: info.img,
        old_price: info.old_price,
        freight: info.freight,
        is_up: that.data.sale === 1 ? 1 : -1,
        label: info.label,
        sku: JSON.stringify(SKUS)
      },
      success (res2) {
        wx.hideLoading()
        if (res2.data.status === 200) {
          wx.showToast({
            title: '添加成功'
          })
          wx.navigateBack()
        } else {
          app.setToast(that, {content: res2.data.desc})
        }
      }
    })
  },
  addItemImg (e) {
    new UpLoad({count: 3, this: this, imgArr: e.currentTarget.dataset.index}).chooseImage()
  },
  // 修改规格图片
  changeItemImg (e) {
    new UpLoad({count: 3, this: this, imgArr: e.currentTarget.dataset.oindex, index: e.currentTarget.dataset.index}).imgOp()
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
