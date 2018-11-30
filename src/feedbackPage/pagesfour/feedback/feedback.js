// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgDomain: app.data.imgDomain,
    testImg: app.data.testImg,
    imgArr: [],
    title: 'feedback'
  },
  formSubmit (e) {
    let that = this
    let images = ''
    if (!e.detail.value.content) return app.setToast(this, {content: '请输入反馈内容'})
    if (this.data.imgArr.length > 0) {
      let imgArr = []
      for (let v of this.data.imgArr) {
        imgArr.push(v.id)
      }
      images = imgArr.join(',')
    }
    app.wxrequest({
      url: app.getUrl().postFeedback,
      data: {
        key: app.gs(),
        content: e.detail.value.content,
        contact_way: e.detail.value.contact || '用户未留联系方式',
        images
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          wx.showToast({
            title: '反馈成功'
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1200)
        } else {
          app.setToast(that, {content: res.data.message})
        }
      }
    })
  },
  del (e) {
    this.data.imgArr.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      imgArr: this.data.imgArr
    })
  },
  showImg (e) {
    app.showImg(e)
  },
  upImg (e) {
    let that = this
    app.wxUploadImg((res) => {
      console.log(res)
      that.data.imgArr.push({
        url: that.data.imgDomain + '/' + res.path,
        id: res.id
      })
      that.setData({
        imgArr: that.data.imgArr
      })
    })
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
