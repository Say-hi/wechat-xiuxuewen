// 获取全局应用程序实例对象
const app = getApp()
console.log(app.data.all_Screen)
let startX = 0
let timer = null
let timer2 = null
// ping_status 0 未开始 1 进行中 -1结束
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mode_id: 1,
    in_area: true,
    buy_type: 'normal',
    ngshow: 1,
    list: [],
    group: [],
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
      if (this.data.mode_id * 1 === 1) {
        if (this.data.info.ping_status === 0) return app.setToast(this, {content: '拼团活动还没有开始'})
        if (this.data.info.ping_status === -1) return app.setToast(this, {content: '拼团活动已结束'})
      } else {
        if (this.data.group[this.data.showPingIndex].status > 1 || this.data.group[this.data.showPingIndex].user.length >= this.data.info.group_num) return app.setToast(this, {content: '此拼团已结束，请选择其他拼团'})
      }
      if ((this.data.buy_type === 'ping' || this.data.buy_type === 'join') && this.data.num > this.data.info.limited) return app.setToast(this, {content: `每人限购${this.data.info.limited}件`})
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
    let { img, title, label, sku, freight, id, mid } = this.data.info // 直接购买
    app.su('buyInfo', [{  // 产品信息缓存
      id,
      img,
      title,
      label,
      freight,
      people: this.data.info.group_num || 2,
      mid,
      sku: sku[this.data.labelIndex],
      count: this.data.num,
      effective_time: this.data.info.effective_time,
      end_time: this.data.info.end_time,
      groupInfo: this.data.showPingIndex >= 0 ? {
        p: this.data.group[this.data.showPingIndex].user.concat({
          avatar_url: app.gs('userInfoAll').avatar_url
        }),
        id: this.data.group[this.data.showPingIndex].group_id,
        end_time: this.data.group[this.data.showPingIndex].end_time
      } : {
        p: [
          {
            avatar_url: app.gs('userInfoAll').avatar_url
          }
        ],
        id: null,
        end_time: this.data.info.end_time
      }
    }])
    // if (this.data.ping && this.data.buy_type === 'ping') {
    if (this.data.ping) {
      if (this.data.options.user) {
        return wx.navigateTo({
          url: `../submit/submit?type=now&ping=ping&mode_id=${this.data.buy_type === 'ping' ? 1 : this.data.buy_type === 'join' ? 3 : 2}`
        })
      }
      return wx.redirectTo({
        url: `../submit/submit?type=now&ping=ping&mode_id=${this.data.buy_type === 'ping' ? 1 : this.data.buy_type === 'join' ? 3 : 2}`
      })
    }
    wx.redirectTo({
      url: '../submit/submit?type=now'
    })
  },
  sptChange (e) {
    if (e.currentTarget.dataset.type === 'close') {
      this.setData({
        showPingTeam: !this.data.showPingTeam
      })
    } else {
      if (this.data.group[e.currentTarget.dataset.index].status > 1 || this.data.group[e.currentTarget.dataset.index].user.length >= this.data.info.group_num) return app.setToast(this, {content: '此拼团已结束，请选择其他拼团'})
      this.setData({
        showPingIndex: e.currentTarget.dataset.index,
        showPingTeam: !this.data.showPingTeam
      })
    }
  },
  buy (e) {
    if (this.data.ping) { // 拼团检查是否在区域内合法
      if (!this.data.in_area) { // 购买非法
        return this.setData({
          ngshow: ++this.data.ngshow
        })
      }
      if (e.currentTarget.dataset.type === 'ping') { // 发起拼团
        this.setData({
          buy_type: 'ping'
        })
      } else if (e.currentTarget.dataset.type === 'join') {
        if (this.data.group[this.data.showPingIndex].status > 1 || this.data.group[this.data.showPingIndex].user.length >= this.data.info.group_num) return app.setToast(this, {content: '此拼团已结束，请选择其他拼团'})
        this.setData({
          buy_type: 'join'
        })
      } else {  // 拼团直接购买
        this.setData({
          buy_type: 'normal'
        })
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
        if (this.data.mode_id * 1 === 1) {
          if (this.data.info.ping_status === 0) return app.setToast(this, {content: '拼团活动还没有开始'})
          if (this.data.info.ping_status === -1) return app.setToast(this, {content: '拼团活动已结束'})
        } else {
          if (this.data.group[this.data.showPingIndex].status > 1) return app.setToast(this, {content: '此拼团已结束，请选择其他拼团'})
        }
        // if (this.data.info.ping_status === 0) return app.setToast(this, {content: '拼团活动还没有开始'})
        // if (this.data.info.ping_status === -1) return app.setToast(this, {content: '拼团活动已结束'})
        if ((this.data.buy_type === 'ping' || this.data.buy_type === 'join') && this.data.num >= this.data.info.limited) return app.setToast(this, {content: `每人限购${this.data.info.limited}件`})
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
          if (that.data.ping) {
            res.data.data.ping_status = new Date().getTime() < res.data.data.start_time * 1000 ? 0 : new Date().getTime() < res.data.data.end_time * 1000 ? 1 : -1
          }
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
            res.data.data.pin_show_price = res.data.data.sku[0].assemble_price.split('.')
            res.data.data.count_sale = res.data.data.count_sale >= 10000 ? Math.floor(res.data.data.count_sale / 1000).toFixed(2) + '万' : res.data.data.count_sale
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
          if (that.data.ping) {
            that.getPingTeam()
            that.setInfoKill()
          }
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
  setInfoKill () {
    let that = this
    if (timer2) clearInterval(timer2)
    timer2 = setInterval(() => {
      that.data.info.ping_status = new Date().getTime() < that.data.info.start_time * 1000 ? 0 : new Date().getTime() < that.data.info.end_time * 1000 ? 1 : -1
    }, 1000)
  },
  // 秒杀逻辑
  setKill () {
    let that = this
    if (timer) clearInterval(timer)
    function kill () {
      let shutDown = 0
      // console.log(that.data.killArr)
      if (!that.data.group) return
      for (let [i, v] of that.data.group.entries()) {
        let nowData = new Date().getTime() // 毫秒数
        // console.log('startTime', new Date(that.data.killArr[i].startTime))
        // let startTime = that.data.list[i].start_time * 1000
        let endTime = that.data.group[i].end_time
        // console.log(endTime)
        // console.log(nowData, startTime, endTime)
        if (nowData < endTime) { // 进行中
          that.data.group[i].status = 1
          that.data.group[i].h = Math.floor((endTime - nowData) / 3600000)
          that.data.group[i].m = Math.floor((endTime - nowData) % 3600000 / 60000)
          that.data.group[i].s = Math.floor((endTime - nowData) % 60000 / 1000)
        } else { // 已结束
          if (that.data.group[i].status === 2) {
            ++shutDown
            continue
          }
          that.data.group[i].status = 2
          that.data.group[i].h = '已'
          that.data.group[i].m = '结'
          that.data.group[i].s = '束'
        }
        that.setData({
          group: that.data.group
        })
      }
      if (shutDown === that.data.group.length) clearInterval(timer)
    }
    kill()
    timer = setInterval(() => {
      kill()
    }, 1000)
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
          let tempList = []
          for (let v of res.data.data.lists) {
            let teamTemp = {
              user: []
            }
            let groupL = {}
            for (let s of v) {
              s.phone = s.phone.substr(0, 3) + '*' + s.phone.substr(7)
              if (s.mode_id <= 1) { // 团长
                teamTemp['group_id'] = s.group_id
                teamTemp['end_time'] = (s.create_time * 1 + that.data.info.effective_time * 1) * 1000
                groupL = s
              } else {
                teamTemp.user.push(s)
              }
            }
            teamTemp.user.unshift(groupL)
            tempList.push(teamTemp)
          }
          that.setData({
            group: that.data.group.concat(tempList),
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          }, that.setKill())
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  showMorePing () {
    if (this.data.more > 0) this.getPingTeam()
    else app.setToast(this, {content: '没有更多拼团啦'})
  },
  // 获取单独拼团信息
  getpinglaunch (oid, mid) {
    // return this.shopProduct(5)
    let that = this
    app.wxrequest({
      url: app.getUrl().pinglaunch,
      data: {
        oid,
        uid: app.gs('userInfoAll').id,
        mid
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          let teamTemp = {
            user: []
          }
          let groupL = {}
          for (let s of res.data.data.group) {
            s.phone = 'Ta向你分享的拼团'
            if (s.mode_id <= 1) { // 团长
              teamTemp['group_id'] = s.group_id
              teamTemp['end_time'] = (s.create_time * 1 + res.data.data.product.effective_time * 1) * 1000
              groupL = s
            } else {
              teamTemp.user.push(s)
            }
          }
          teamTemp.user.unshift(groupL)
          that.setData({
            group: that.data.group.concat(teamTemp)
          }, () => {
            that.shopProduct(res.data.data.product.id)
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },

  // 授权相关
  getUser (out) {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopUserInfo,
      data: {
        uid: app.gs('userInfoAll').id
        // uid: 10000
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          // if (res.data.data.mall_id <= 10000 && app.gs('shopInfo').mid > 10000 && app.gs('shopInfo').user) that.shopBinding()
          that.shopBinding(out)
          // if (!that.data.userInfo || that.data.userInfo.nickname !== '未登录用户请在【用户中心】进行登录') {
          //   // that.setData({
          //   //   userInfo: res.data.data
          //   // })
          //   if (res.data.data.nickname === '游客' || !res.data.data.phone || res.data.data.phone.length < 6) return
          // }
          // if (res.data.data.mall_is * 1 === 1) {
          //   app.su('shopInfo', {mid: res.data.data.id})
          //   // that.setData({
          //   //   noshop: false
          //   // }, that.getVideo)
          // } else if (res.data.data.mall_id) {
          //   app.su('shopInfo', {mid: res.data.data.mall_id})
          //   // that.setData({
          //   //   noshop: false
          //   // }, that.getVideo)
          // } else {
          //   // that.setData({
          //   //   noshop: !app.gs('shopInfo').mid
          //   // }, that.getVideo)
          // }
        } else {
          if (res.data.desc === '发生错误,联系管理员') {
            wx.removeStorageSync('userInfoAll')
            app.wxlogin()
          } else {
            app.setToast(that, {content: res.data.desc})
          }
        }
      }
    })
  },
  // 店铺绑定
  shopBinding (out) {
    if (out) return
    let that = this
    if (!app.gs('shopInfo').mid) return
    app.wxrequest({
      url: app.getUrl().shopBinding,
      data: {
        mid: app.gs('shopInfo').mid,
        sid: app.gs('shopInfo').user,
        uid: app.gs('userInfoAll').id
      },
      complete () {
        that.getUser(1)
        wx.hideLoading()
      }
    })
  },
  // 获取店铺信息
  shopInfo () {
    let that = this
    if (this.data.noshop) return
    app.wxrequest({
      url: app.getUrl().shopInfo,
      data: {
        mid: app.gs('shopInfo').mid || 10000
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          if (res.data.data.status < 0) {
            app.setToast(that, {content: '该店因违规被封闭，即将跳转回官方店铺'})
            setTimeout(() => {
              return wx.reLaunch({
                url: '/shopPage/shoppages/index/index'
              })
            }, 1500)
          }
          app.su('shopInfoAll', res.data.data)
          that.getpinglaunch(that.data.options.oid, that.data.options.mid)
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  login () {
    app.wxlogin()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    console.log('options', options)
    // 通过分享进入拼团
    if (options.scene || options.share) {
      let that = this
      if (!app.gs() || !app.gs('userInfoAll')) return app.wxlogin() // 处理第一次进入的情况
      let scene = decodeURIComponent(options.scene).split(',')
      if (options.share) scene = options.share.split(',')
      options.oid = scene[0] // 拼团订单id
      options.mid = scene[1] // 商家id
      options.user = scene[2] // 分享者id
      options.ping = 'ping' // 拼团标识
      app.su('shopInfo', {mid: options.mid, user: options.user})
      this.setData({
        options,
        ping: options.ping === 'ping'
      }, function () {
        // 分享过来的团先查询后插入拼团列表第一位
        if (!app.gs('shopInfoAll')) {
          that.shopInfo()
        } else {
          that.getpinglaunch(that.data.options.oid, that.data.options.mid)
        }
      })
    } else {
      this.setData({
        options,
        ping: options.ping === 'ping'
      })
      this.shopProduct(options.id)
    }
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
    if (timer) clearInterval(timer)
    if (timer2) clearInterval(timer2)
    // TODO: onUnload
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // TODO: onPullDownRefresh
  }
})
