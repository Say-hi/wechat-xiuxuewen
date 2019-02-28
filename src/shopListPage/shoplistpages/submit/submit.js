// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    img: app.data.testImg,
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
  // 选择地址
  chooseAddress () {
    if (this.data.lostTime) return
    let that = this
    wx.chooseAddress({
      success (res) {
        if (res.telNumber) { // 获取信息成功
          wx.setStorageSync('addressInfo', res)
          that.setData({
            needSetting: false,
            addressInfo: res
          })
        }
      },
      fail () {
        wx.getSetting({
          success (res) {
            if (!res.authSetting['scope.address']) {
              that.setData({
                needSetting: true
              })
              app.setToast(that, {content: '需授权获取地址信息'})
            }
          }
        })
      }
    })
  },
  // 获取设置
  openSetting () {
    let that = this
    wx.openSetting({
      success (res) {
        // console.log(res)
        if (res.authSetting['scope.address']) {
          that.setData({
            needSetting: false
          })
          that.chooseAddress()
        }
      }
    })
  },
  submit () {
    this.setData({
      need_pay: !this.data.need_pay
    })
  },
  gohome () {
    wx.reLaunch({
      url: '/shopPage/shoppages/index/index'
    })
  },
  onShareAppMessage () {
    return {
      title: `向您推荐店铺【${app.gs('shopInfoAll').name}】`,
      imageUrl: `${app.gs('shopInfoAll').avatar || ''}`,
      path: `/shopPage/shoppages/index/index?mid=${app.gs('shopInfoAll').id}`
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
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
