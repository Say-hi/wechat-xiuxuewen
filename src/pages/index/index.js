// 获取全局应用程序实例对象
const app = getApp()
const bmap = require('../../utils/bmap-wx')
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    HEIGHT_TOP: app.data.HEIGHT_TOP,
    ALL_HEIGHT: app.data.ALL_HEIGHT,
    page: 0,
    answerArr: [],
    indicatorColor: 'rgba(0, 0, 0, 0.4)',
    indicatorActiveColor: '#ffffff',
    indicatorActiveColorVideo: '#dab866',
    show: true,
    tabNav: []
  },
  upFormId (e) {
    app.upFormId(e)
  },
  open_site (e) {
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
  Bmap (that, site) {
    let BMap = new bmap.BMapWX({
      ak: 'RBTsmFCaerZ25VkuGhpSIZa5lyC36BcV'
    })
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
  goOther (e) {
    app.goOther(e)
  },

  getCourse () {
    let that = this
    app.wxrequest({
      url: app.getUrl().course,
      data: {
        page: 1,
        style: 2
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
  getUser () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopUserInfo,
      data: {
        uid: app.gs('userInfoAll').id
      },
      success (res) {
        app.su('userInfoAll', Object.assign(app.gs('userInfoAll'), {star: res.data.data.star}))
        wx.hideLoading()
        if (res.data.status === 200) {
          that.setData({
            userInfo: res.data.data
          }, that.checkLvShow)
        }
      }
    })
  },
  phone (e) {
    let that = this
    wx.login({
      success (res) {
        app.wxrequest({
          url: app.getUrl().shopPhone,
          data: {
            code: res.code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            uid: that.data.userInfo.id
          },
          success (res) {
            wx.hideLoading()
            if (res.data.status === 200) {
              that.getUser()
            } else {
              app.setToast(that, {content: res.data.desc})
            }
          }
        })
      }
    })
  },
  login () {
    app.wxlogin()
  },
  goNow () {
    this.setData({
      ['userInfo.nickname']: '未登录用户',
      ['userInfo.phone']: 18888888888
    })
  },
  checkLvShow (e) {
    if (e) {
      this.setData({
        lvShow: false
      })
      app.su('beforeShow', app.gs('userInfoAll').star || 5)
      return
    }
    let that = this
    this.setData({
      lvShow: app.gs('beforeShow') * 1 !== app.gs('userInfoAll').star * 1
    }, function () {
      if (that.data.lvShow) {
        that.setData({
          lvStar: app.gs('userInfoAll').star || 5
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    let that = this
    if (!app.gs() || !app.gs('userInfoAll')) return app.wxlogin()
    this.getUser()
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
      title: app.gs('shareText').t || '绣学问，真纹绣',
      path: `/pages/index/index`,
      imageUrl: app.gs('shareText').g
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    this.getCourse()
  }
})
