// 获取全局应用程序实例对象
const app = getApp()
let timer = null
const bmap = require('../../utils/bmap-wx')
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    HEIGHT_TOP: app.data.HEIGHT_TOP,
    ALL_HEIGHT: app.data.ALL_HEIGHT,
    testImg: 'https://c.jiangwenqiang.com/api/logo.jpg',
    page: 0,
    imgDomain: app.data.imgDomain,
    answerArr: [],
    indicatorColor: 'rgba(0, 0, 0, 0.4)',
    indicatorActiveColor: '#ffffff',
    indicatorActiveColorVideo: '#dab866',
    show: true,
    tabNav: [
      // {
      //   title: '教学视频',
      //   type: 'navigate',
      //   url: '/coursePage/pageszero/course/course?type=1'
      // },
      // {
      //   title: '线下学习',
      //   type: 'navigate',
      //   url: '/offlinePage/pagesnine/courseOffline/courseOffline'
      // },
      // {
      //   title: '问答',
      //   type: 'navigate',
      //   url: '/answerPage/pagesthree/answer/answer'
      // },
      // {
      //   title: '教室入驻',
      //   type: 'navigate',
      //   url: '/answerPage/pagesthree/answer/answer'
      // }
    ]

  },
  upFormId (e) {
    app.upFormId(e)
  },
  /**
   * 地址授权
   * @param e
   */
  open_site (e) {
    console.log('setting')
    if (e.detail.authSetting['scope.userLocation']) {
      wx.showToast({
        title: '授权成功'
      })
      this.setData({
        openType: null
      })
      let that = this
      setTimeout(function () {
        that.Bmap(that)
      }, 100)
    }
  },
  choose_site () {
    console.log('choose')
    let that = this
    if (!this.data.openType) {
      wx.chooseLocation({
        success (res) {
          that.setData({
            address: res.address,
            latitude: res.latitude,
            longitude: res.longitude
          }, that.Bmap(that, `${res.longitude},${res.latitude}`))
        }
      })
    }
  },
  /**
   * 百度地图函数
   * @param that
   * @constructor
   */
  Bmap (that, site) {
    // let _this = this
    let BMap = new bmap.BMapWX({
      ak: 'RBTsmFCaerZ25VkuGhpSIZa5lyC36BcV'
    })
    // BMap.weather({
    //   fail (data) {
    //     that.setData({
    //       openType: 'openSetting'
    //     })
    //     console.log('fail', data)
    //   },
    //   success (data) {
    //     let type = (new Date().getHours() > 18 || new Date().getHours() < 6) ? 'nightPictureUrl' : 'dayPictureUrl'
    //     that.setData({
    //       weatherInfo: data.originalData.results[0],
    //       weatherPic: data.originalData.results[0].weather_data[0][type].replace('http://', 'https://')
    //     })
    //   },
    //   location: site || null
    // }, _this)
    BMap.regeocoding({
      location: site || null,
      success (res) {
        that.setData({
          addressInfo: res
        })
      },
      fail (data) {
        that.setData({
          openType: 'openSetting'
        })
        console.log('fail', data)
      }
    })
  },

  // 秒杀逻辑
  setKill () {
    let that = this
    if (timer) clearInterval(timer)
    function kill () {
      let shutDown = 0
      // console.log(that.data.killArr)
      if (!that.data.killArr) return
      for (let [i] of that.data.killArr.entries()) {
        let nowData = new Date().getTime() // 毫秒数
        // console.log('startTime', new Date(that.data.killArr[i].startTime))
        let startTime = that.data.killArr[i].start_time * 1000
        let endTime = that.data.killArr[i].end_time * 1000
        // console.log(nowData, startTime, endTime)
        if (nowData < startTime) { // 未开始
          that.data.killArr[i].status = 1
          that.data.killArr[i].h = Math.floor((startTime - nowData) / 3600000)
          that.data.killArr[i].m = Math.floor((startTime - nowData) % 3600000 / 60000)
          that.data.killArr[i].s = Math.floor((startTime - nowData) % 60000 / 1000)
        } else if (nowData > startTime && nowData < endTime) { // 进行中
          that.data.killArr[i].status = 2
          that.data.killArr[i].h = Math.floor((endTime - nowData) / 3600000)
          that.data.killArr[i].m = Math.floor((endTime - nowData) % 3600000 / 60000)
          that.data.killArr[i].s = Math.floor((endTime - nowData) % 60000 / 1000)
        } else { // 已结束
          if (that.data.killArr[i].status === 3) {
            ++shutDown
            continue
          }
          that.data.killArr[i].status = 3
          that.data.killArr[i].h = '已'
          that.data.killArr[i].m = '结'
          that.data.killArr[i].s = '束'
        }
        that.setData({
          killArr: that.data.killArr
        })
      }
      if (shutDown === that.data.killArr.length) clearInterval(timer)
    }
    kill()
    timer = setInterval(() => {
      kill()
    }, 1000)
  },

  getLocation () {
    let that = this
    wx.getLocation({
      type: 'gcj02',
      success (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        app.su('userLocation', res)
        that.getIndex()
      }
    })
  },

  MaskGetUserInfo (e) {
    if (e.detail.iv) {
      this.setData({
        needUserInfo: false
      })
      app.wxlogin(this.getLocation)
    }
  },
  onReachBottom () {
  },
  zan (e) {
    console.log(e)
    let that = this
    app.wxrequest({
      url: app.getUrl().like,
      data: {
        obj_id: e.currentTarget.dataset.id,
        key: app.gs(),
        type: 0 // 0：专栏；1：文章；2：回答；3：视频；4：社群；5评论
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          that.data.indexData.columnArr[e.currentTarget.dataset.oindex][e.currentTarget.dataset.index].is_like = that.data.indexData.columnArr[e.currentTarget.dataset.oindex][e.currentTarget.dataset.index].is_like * 1 === 1 ? 0 : 1
          that.data.indexData.column[(e.currentTarget.dataset.oindex * 4) + (e.currentTarget.dataset.index * 1)].is_like = that.data.indexData.columnArr[e.currentTarget.dataset.oindex][e.currentTarget.dataset.index].is_like
          that.setData({
            indexData: that.data.indexData
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  goOther (e) {
    app.goOther(e)
  },

  getCourse () {
    let that = this
    app.wxrequest({
      url: app.getUrl().course,
      data: {
        page: 1
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          let list = []
          for (let v of res.data.data.lists) {
            list.push({
              id: v.id,
              avatar: v.avatar,
              image: v.image,
              room_name: v.room_name,
              title: v.title,
              price: v.price > 0 ? v.price : '免费'
            })
          }
          that.setData({
            list
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    let that = this
    if (!app.gs() || !app.gs('userInfoAll')) return app.wxlogin()
    app.getNavTab({
      style: 3,
      cb (res) {
        that.setData({
          swiperArr: res.data.data
        })
        app.getNavTab({
          style: 2,
          cb (res) {
            that.setData({
              tabNav: res.data.data
            })
            that.getCourse()
          }
        })
      }
    })
    this.Bmap(this)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    // console.log(' ---------- onReady ----------')
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // this.setKill()
    // console.log(' ---------- onShow ----------')
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    // clearInterval(timer)
    // console.log(' ---------- onHide ----------')
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    // clearInterval(timer)
    // console.log(' ---------- onUnload ----------')
  },
  onShareAppMessage () {
    return {
      title: app.gs('shareText') || '绣学问，真纹绣',
      path: `/pages/index/index`
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    this.getCourse()
    // this.setData({
    //   page: 0,
    //   answerArr: []
    // }, this.getIndexData)
    // console.log(' ---------- onPullDownRefresh ----------')
  }
})
