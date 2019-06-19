// 获取全局应用程序实例对象
const app = getApp()
console.log(app.data.all_Screen)
let startX = 0
// ping_status 0 未开始 1 进行中 -1结束
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    in_area: true,
    buy_type: 'normal',
    ngshow: 1,
    list: [],
    enable_progress_gesture: true,
    systemVersion: app.data.systemVersion,
    num: 1,
    page: 0,
    labelIndex: 0,
    all_Screen: app.data.all_screen,
    discount_name: app.gs('shopInfoAll').discount_name,
    discount_value: app.gs('shopInfoAll').discount_value
  },
  // videotouchstart (e) {
  //   console.log(e)
  //   startX = e.changedTouches[0].clientX
  // },
  // videotouchend (e) {
  //   console.log(e)
  //   if (startX - e.changedTouches[0].clientX >= 30) {
  //     console.log(1)
  //     this.setData({
  //       current: 1
  //     })
  //   }
  // },
  showImg (e) {
    wx.previewImage({
      urls: this.data.info.detail,
      current: this.data.info.detail[e.currentTarget.dataset.index]
    })
  },
  goSubmit () {
    if (this.data.ping) { // 拼团检测
      if (this.data.info.ping_status === 0) return app.setToast(this, {content: '拼团活动还没有开始'})
      if (this.data.info.ping_status === -1) return app.setToast(this, {content: '拼团活动已结束'})
      if (this.data.buy_type === 'ping' && this.data.num >= this.data.info.limited) return app.setToast(this, {content: `每人限购${this.data.info.limited}件`})
    }
    if (this.data.num > this.data.info.sku[this.data.labelIndex].stock) return app.setToast(this, {content: '该产品已无库存'})
    if (this.data.addCar) { // 添加到购物车
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
    let { img, title, label, sku, freight, id, people = 2 } = this.data.info // 直接购买
    app.su('buyInfo', [{  // 产品信息缓存
      id,
      img,
      title,
      label,
      freight,
      people,
      sku: sku[this.data.labelIndex],
      count: this.data.num,
      end_time: this.data.info.effective_time
    }])
    if (this.data.ping && this.data.buy_type === 'ping') {
      return wx.redirectTo({
        url: `../submit/submit?type=now&ping=ping`
      })
    }
    wx.redirectTo({
      url: '../submit/submit?type=now'
    })
  },
  sptChange () {
    this.setData({
      showPingTeam: !this.data.showPingTeam
    })
  },
  buy (e) {
    if (this.data.ping) { // 拼团检查是否在区域内合法
      if (!this.data.in_area) { // 购买非法
        return this.setData({
          ngshow: ++this.data.ngshow
        })
      }
      if (e.currentTarget.dataset.type === 'ping') { // 发起拼团
        this.data.buy_type = 'ping'
      } else {  // 拼团直接购买
        this.data.buy_type = 'normal'
      }
      this.setData({ // 规则选择
        buyMask: !this.data.buyMask
      })
      return
    }
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
      if (this.data.ping) {
        if (this.data.info.ping_status === 0) return app.setToast(this, {content: '拼团活动还没有开始'})
        if (this.data.info.ping_status === -1) return app.setToast(this, {content: '拼团活动已结束'})
        if (this.data.buy_type === 'ping' && this.data.num >= this.data.info.limited) return app.setToast(this, {content: `每人限购${this.data.info.limited}件`})
      }
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
      labelIndex: e.currentTarget.dataset.index,
      current: 0
    })
  },
  shopProduct (pid) {
    let that = this
    app.wxrequest({
      url: app.getUrl()[that.data.ping ? 'pindetail' : 'shopProduct'],
      // url: app.getUrl()[that.data.ping ? 'shopProduct' : 'shopProduct'],
      data: {
        pid
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          if (that.data.ping) res.data.data.ping_status = new Date().getTime() < res.data.data.start_time * 1000 ? 0 : new Date().getTime() < res.data.data.end_time ? 1 : -1
          res.data.data.imgs = res.data.data.imgs ? res.data.data.imgs.split(',') : []
          res.data.data.detail = res.data.data.detail ? res.data.data.detail.split(',') : []
          app.setBar(res.data.data.title)
          res.data.data['stock'] = 0
          if (!that.data.ping) {
            for (let v of res.data.data.sku) {
              v['discount'] = (v.price * that.data.discount_value).toFixed(2)
              res.data.data['stock'] += v.stock * 1
            }
          } else {
            res.data.data.pin_show_price = res.data.data.sku[0].assemble_price.split(',')
            res.data.data.count_sale = res.data.data.count_sale >= 10000 ? Math.floor(res.data.data.count_sale / 1000).toFixed(2) + '万' : res.data.data.count_sale
            // res.data.data.pin_show_price = [0, 1]
          }
          let sku = res.data.data.sku
          sku.map((v, i) => {
            if (!v.img) {
              sku[i].img = []
            } else {
              let temp = v.img.split(',')
              let tempArr = []
              temp.map((vv, ii) => {
                tempArr.push(vv)
              })
              sku[i].img = tempArr
            }
          })
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
  getPingTeam () {
    let that = this
    app.wxrequest({
      url: app.getUrl().pinteam,
      data: {
        pid: that.data.info.id,
        page: ++that.data.page
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    console.log('options', options)
    if (options.scene) { // 通过分享进入拼团
      let scene = decodeURIComponent(options.scene).split(',')
      options.ping = scene[0] // 拼团标识
      options.id = scene[1] // 拼团产品id
      options.from = scene[2] // 拼团发起人id
    }
    this.setData({
      options,
      ping: options.ping === 'ping'
    })
    this.shopProduct(options.id)
    console.log('route', this.route)
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
