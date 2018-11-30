// 获取全局应用程序实例对象
const app = getApp()
const bmap = require('../../../utils/bmap-wx')
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: 'reservation',
    testImg: app.data.testImg
  },
  choose_site (e) {
    let that = this
    if (this.data.openType) {
      if (e.detail.authSetting['scope.userLocation']) {
        wx.showToast({
          title: '授权成功'
        })
        that.setData({
          openType: ''
        })
        wx.chooseLocation({
          success (res) {
            console.log(res)
            that.setData({
              address: res.address,
              latitude: res.latitude,
              longitude: res.longitude
            }, that.Bmap(that, `${res.longitude},${res.latitude}`))
          }
        })
      }
    } else {
      wx.chooseLocation({
        success (res) {
          console.log(res)
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
    let _this = this
    let BMap = new bmap.BMapWX({
      ak: 'RBTsmFCaerZ25VkuGhpSIZa5lyC36BcV'
    })
    BMap.weather({
      fail (data) {
        that.setData({
          openType: 'openSetting'
        })
        console.log('fail', data)
      },
      success (data) {

        let type = (new Date().getHours() > 18 || new Date().getHours() < 6) ? 'nightPictureUrl' : 'dayPictureUrl'
        that.setData({
          weatherInfo: data.originalData.results[0],
          weatherPic: data.originalData.results[0].weather_data[0][type].replace('http://', 'https://')
        })
      },
      location: site || null
    }, _this)
    BMap.regeocoding({
      location: site || null,
      success (res) {
        console.log(res)
        that.setData({
          addressInfo: res
        })
      },
      fail (err) {
        console.log(err)
      }
    })
  },
  /**
   * 选择城市
   */
  chooseCity () {
    let that = this
    wx.chooseLocation({
      success (res) {
        let site = res.longitude + ',' + res.latitude
        that.Bmap(that, site)
      },
      cancel (res) {
        console.log(res)
      },
      fail (res) {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    this.Bmap(this)
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
