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
    ALL_HEIGHT: app.data.ALL_HEIGHT,
    testImg: 'https://c.jiangwenqiang.com/api/logo.jpg',
    page: 0,
    imgDomain: app.data.imgDomain,
    answerArr: [],
    indicatorColor: 'rgba(0, 0, 0, 0.4)',
    indicatorActiveColor: '#ffffff',
    indicatorActiveColorVideo: '#dab866',
    show: true,
    tabArr: [
      {
        title: '教学视频',
        type: 'navigate',
        path: '../course/course?type=1'
      },
      {
        title: '线下学习',
        type: 'navigate',
        path: '/offlinePage/pagesnine/courseOffline/courseOffline'
      },
      {
        title: '问答',
        type: 'navigate',
        path: '/answerPage/pagesthree/answer/answer'
        // path: '/practicePage/pagestwo/practice/practice'
      },
      {
        title: '教室入驻',
        type: 'navigate',
        path: '/answerPage/pagesthree/answer/answer'
      }
    ]
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

  // 关闭新人礼包
  close () {
    if (this.data.small) return
    this.setData({
      small: true
    })
    setTimeout(() => {
      this.setData({
        show: false
      })
    }, 500)
  },
  // 打电话
  calls () {
    app.call(this.data.shopInfo[1].r)
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

  getIndex () {
    let that = this
    app.wxrequest({
      url: app.getUrl().index,
      data: {
        act: 'index',
        latitude: that.data.latitude || '',
        longitude: that.data.longitude || ''
      },
      success (res) {
        wx.hideLoading()
        // console.log(res)
        if (res.data.status === 200) {
          that.setData({
            bannerArr: res.data.data.ad1List,
            bannerArr2: res.data.data.ad2List,
            announcement: res.data.data.noticeList[0].title,
            newGoodsList: res.data.data.newGoodsList,
            killArr: res.data.data.FSList,
            SOGList: res.data.data.SOGList
          })
          that.setKill()
          for (let v of res.data.data.cpl) {
            v.use_start_time = new Date(v.use_start_time).toLocaleString()
            v.use_end_time = new Date(v.use_end_time).toLocaleString()
          }
          that.setData({
            cpl: res.data.data.cpl
          })
          let count = 0
          setInterval(() => {
            if (count >= res.data.data.noticeList.length) {
              count = 0
            }
            that.setData({
              announcement: res.data.data.noticeList[count].title
            })
            count++
          }, 5000)
        } else {
          app.setToast(that, {content: res.data.msg})
        }
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
  giveTip (e) {
    app.setComponentsData(this, e)
  },
  ds (e) {
    let {index, integral} = e.detail
    this.data.answerArr[index].integral += (integral * 1)
    this.setData({
      answerArr: this.data.answerArr
    })
  },
  getIndexData () {
    let that = this
    app.wxrequest({
      url: app.getUrl().index,
      data: {
        key: app.gs()
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          let videoArr = []
          let tempArr = []
          for (let [i, v] of res.data.data.video.entries()) {
            if (res.data.data.video.length <= 4) {
              videoArr.push(res.data.data.video)
              break
            }
            if (tempArr.length < 4) {
              tempArr.push(v)
            } else if (tempArr.length >= 4 && i < res.data.data.video.length - 1) {
              videoArr.push(tempArr)
              tempArr = []
              tempArr.push(v)
            } else if (tempArr.length >= 4 && i >= res.data.data.video.length - 1) {
              videoArr.push(tempArr)
              tempArr = []
              tempArr.push(v)
              videoArr.push(tempArr)
              break
            }
            if (tempArr.length > 0 && i >= res.data.data.video.length - 1) {
              console.log(3)
              videoArr.push(tempArr)
              break
            }
          }
          let columnArr = []
          let varColumn = []
          for (let [i, v] of res.data.data.column.entries()) {
            if (res.data.data.column.length <= 4) {
              columnArr.push(res.data.data.column)
              break
            } else if (varColumn.length < 4) {
              varColumn.push(v)
            } else if (varColumn.length >= 4 && i < res.data.data.column.length - 1) {
              columnArr.push(varColumn)
              varColumn = []
            } else if (varColumn.length > 0 && i >= res.data.data.column.length - 1) {
              columnArr.push(varColumn)
            }
          }
          res.data.data['videoArr'] = videoArr
          res.data.data['columnArr'] = columnArr
          app.su('navArr', res.data.data.nav[0])
          that.setData({
            indexData: res.data.data,
            tabArr2: app.setNav()
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  getAnswer () {
    let that = this
    app.wxrequest({
      url: app.getUrl().qa,
      data: {
        key: app.gs(),
        page: ++that.data.page
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          for (let v of res.data.data.data) {
            if (v.answer) {
              v['like'] = v.answer.like || 0
              v['integral'] = v.answer.integral || 0
            }
          }
          that.setData({
            answerArr: that.data.answerArr.concat(res.data.data.data),
            more: res.data.data.data.length < res.data.data.per_page ? 1 : 0
          })
        } else {
          app.setToast(that, {content: res.data.msg})
        }
      }
    })
  },
  goDetail (e) {
    if (e.currentTarget.dataset.type === 'quesiton') app.su('answerObj', this.data.answerArr[e.currentTarget.dataset.index])
    else if (e.currentTarget.dataset.type === 'column') app.su('answerObj', this.data.indexData.column[e.currentTarget.dataset.index])
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.Bmap(this)
    // app.setBar('发现')
    // app.getSelf(this)
    // this.getIndexData()
    /*eslint-disable*/
    // this.setData({
    //   show: app.gs('userInfo') ? false : true
    // })
    // if (!app.gs('userInfo')) {
    //   this.setData({
    //     needUserInfo: true
    //   })
    //   app.wxlogin()
    // } else {
    //   app.wxlogin(this.getIndexData)
    // }
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
    this.setKill()
    // console.log(' ---------- onShow ----------')
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    clearInterval(timer)
    // console.log(' ---------- onHide ----------')
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    clearInterval(timer)
    // console.log(' ---------- onUnload ----------')
  },
  onShareAppMessage () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // this.setData({
    //   page: 0,
    //   answerArr: []
    // }, this.getIndexData)
    // console.log(' ---------- onPullDownRefresh ----------')
  }
})
