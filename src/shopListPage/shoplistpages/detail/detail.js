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
    let that = this
    let type = e.currentTarget.dataset.type
    if (type === 'add') {
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
    let that = this
    let {oindex, index} = e.currentTarget.dataset
    for (let v of that.data.specifi[oindex].chooses) {
      v['choose'] = false
    }
    that.data.specifi[oindex].chooses[index]['choose'] = true
    let setStr = `specifi[${oindex}]`
    this.setData({
      [setStr]: that.data.specifi[oindex]
    })
  },
  onShareAppMessage () {
    let that = this
    return {
      title: `${that.data.info.share_title || '邀请您入驻绣学问，成为优秀的纹绣人'}`,
      imageUrl: `${that.data.info.share_imageUrl || ''}`,
      path: `/enteringPage/pagestwelve/entering/entering?id=${app.gs('userInfoAll').id}`
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
