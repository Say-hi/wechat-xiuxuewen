// 获取全局应用程序实例对象
const app = getApp()
const bmap = require('../../utils/bmap-wx')
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testImg: app.data.testImg,
    page: 0,
    lists: [],
    title: 'courseOffline'
  },
  onShareAppMessage () {
    return {
      title: app.gs('shareText').t || '绣学问，真纹绣',
      path: `/pages/index/index`,
      imageUrl: app.gs('shareText').g
    }
  },
  showMore (e) {
    this.setData({
      canShowIndex: e.currentTarget.dataset.index
    })
  },
  showImg (e) {
    this.data.showImg = 1
    app.showImg(this.data.lists[e.currentTarget.dataset.bindex].lists[e.currentTarget.dataset.oindex].room_images[e.currentTarget.dataset.index], this.data.lists[e.currentTarget.dataset.bindex].lists[e.currentTarget.dataset.oindex].room_images)
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
    let BMap = new bmap.BMapWX({
      ak: 'RBTsmFCaerZ25VkuGhpSIZa5lyC36BcV'
    })
    BMap.regeocoding({
      location: site || null,
      success (res) {
        that.data.page = 0
        that.data.lists = []
        that.setData({
          addressInfo: res
        }, that.getNear)
      },
      fail (data) {
        that.setData({
          openType: 'openSetting'
        })
        console.log('fail', data)
      }
    })
  },
  getNear () {
    let that = this
    app.wxrequest({
      url: app.getUrl().dotNearby,
      data: {
        code: that.data.addressInfo.originalData.result.addressComponent.adcode,
        longitude: that.data.addressInfo.originalData.result.location.lng,
        latitude: that.data.addressInfo.originalData.result.location.lat,
        parent_code: that.data.parent_code || 0,
        user_id: app.gs('userInfoAll').id,
        page: ++that.data.page
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          if (res.data.data.total < 1 && !that.data.parent_code) {
            that.data.parent_code = 1
            that.data.page <= 1 ? that.data.page = 0 : null
            that.getNear()
          } else {
            for (let v of res.data.data.lists) {
              for (let s of v.lists) {
                s.room_images = s.room_images.split(',')
                s.distance = s.distance > 1000 ? (s.distance / 1000).toFixed(2) + 'km' : s.distance + 'm'
              }
            }
            that.setData({
              lists: that.data.lists.concat(res.data.data.lists),
              more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
            })
          }
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  onReachBottom () {
    if (this.data.more > 0) this.getNear()
    else app.setToast(this, {content: '没有更多门店啦'})
  },

  search () {
    let that = this
    app.wxrequest({
      url: app.getUrl().dotSearch,
      data: {
        page: 1,
        dot_name: that.data.searchText
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          for (let s of res.data.data.lists) {
            s.room_images = s.room_images.split(',')
            if (that.data.addressInfo) {
              let sd = app.distance(s.latitude, s.longitude, that.data.addressInfo.originalData.result.location.lat, that.data.addressInfo.originalData.result.location.lng)
              s.distance = sd > 1000 ? (sd / 1000).toFixed(2) + 'km' : sd + 'm'
            }
          }
          that.data.lists[0] = {
            city_name: '搜索结果',
            lists: !that.data.lists[0] ? res.data.data.lists : that.data.lists[0].lists.concat(res.data.data.lists)
          }
          that.setData({
            lists: that.data.lists,
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          })
        } else {
          app.setToast(that, {content: '未搜索到相关内容'})
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    this.Bmap(this)
    app.setBar('线下学堂')
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
    if (this.data.showImg === 1) {
      this.data.showImg = 0
    } else if (app.data.searchText) {
      this.data.searchText = app.data.searchText
      app.data.searchText = null
      this.data.lists = []
      this.search()
    }
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
    this.data.page = 0
    this.data.lists = []
    this.getNear()
    // TODO: onPullDownRefresh
  }
})
