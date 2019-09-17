// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    leftIndex: 0,
    leftPage: 0,
    leftList: [],
    rightPage: 0,
    rightList: [],
    downloadIndex: 0
  },
  addCount (e) {
    let that = this
    this.data.downloadIndex = 0
    app.wxrequest({
      url: app.getUrl().scAdd,
      data: {
        material_id: that.data.rightList[e.currentTarget.dataset.index].id
      },
      complete () {
        wx.hideLoading()
        that.download(e)
      }
    })
  },
  copy (e) {
    wx.setClipboardData({
      data: this.data.rightList[e.currentTarget.dataset.index].words,
      success () {
        wx.showToast({
          title: '文字已复制'
        })
      }
    })
  },
  choose (e) {
    app.setBar(this.data.leftList[e.currentTarget.dataset.index].title)
    this.data.rightPage = 0
    this.data.rightList = []
    this.data.rightMore = false
    this.setData({
      leftIndex: e.currentTarget.dataset.index
    }, this.getList)
  },
  showImg (e) {
    app.showImg(e.currentTarget.dataset.src, [e.currentTarget.dataset.src])
  },
  open (e) {
    this.setData({
      open: e.currentTarget.dataset.index * 1 === this.data.openIndex * 1 ? !this.data.open : true,
      openIndex: e.currentTarget.dataset.index
    })
  },
  download (e) {
    if (e.currentTarget.dataset.style * 1 === 3) {
      wx.showLoading({
        title: `保存第${this.data.downloadIndex + 1}张图片`,
        mask: true
      })
    } else {
      wx.showLoading({
        title: `保存中...`,
        mask: true
      })
    }
    let that = this
    this.downLoadFile(e.currentTarget.dataset.style * 1 === 3 ? this.data.rightList[e.currentTarget.dataset.index].img_url[this.data.downloadIndex] : e.currentTarget.dataset.style * 1 === 2 ? this.data.rightList[e.currentTarget.dataset.index].img_url[0] : this.data.rightList[e.currentTarget.dataset.index].video_url)
      .then(res => {
        if (e.currentTarget.dataset.style * 1 === 3 || e.currentTarget.dataset.style * 1 === 2) {
          wx.saveImageToPhotosAlbum({
            filePath: res,
            success () {
              if (e.currentTarget.dataset.style * 1 === 3) {
                if (++that.data.downloadIndex < that.data.rightList[e.currentTarget.dataset.index].img_url.length) {
                  that.download({currentTarget: {dataset: {index: e.currentTarget.dataset.index, style: e.currentTarget.dataset.style}}})
                } else {
                  wx.hideLoading()
                }
              } else {
                wx.hideLoading()
              }
            },
            fail () {
              wx.hideLoading()
              wx.showToast({
                title: '需要授权'
              })
              that.setData({
                needAuth: true
              })
            }
          })
        } else {
          wx.saveVideoToPhotosAlbum({
            filePath: res,
            success () {
              wx.hideLoading()
            },
            fail () {
              wx.hideLoading()
              wx.showToast({
                title: '需要授权'
              })
              that.setData({
                needAuth: true
              })
            }
          })
        }
      }, err => {
        console.log(err)
        wx.hideLoading()
        wx.showToast({
          title: '需要授权'
        })
        that.setData({
          needAuth: true
        })
      })
  },
  downLoadFile (url) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url,
        success (res) {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath)
          } else {
            reject(res)
          }
        }
      })
    })
  },
  openSetting (e) {
    if (e.detail.authSetting['scope.writePhotosAlbum']) {
      wx.showToast({
        title: '授权成功'
      })
      this.setData({
        needAuth: false
      })
    }
  },
  getLeftList () {
    let that = this
    if (this.data.leftMore) return
    app.wxrequest({
      url: app.getUrl().scMenu,
      data: {
        page: ++that.data.leftPage,
        rank: 2,
        parent_id: that.data.leftList[0].parent_id
      },
      success (res) {
        if (res.data.status) {
          that.setData({
            leftList: that.data.leftList.concat(res.data.data.lists),
            leftMore: res.data.data.pre_page > res.data.data.lists.length
          }, that.getList)
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  getList () {
    let that = this
    if (this.data.rightMore) return
    app.wxrequest({
      url: app.getUrl().scList,
      data: {
        mid: that.data.leftList[that.data.leftIndex].id,
        page: ++that.data.rightPage
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status) {
          for (let v of res.data.data.lists) {
            v.img_url = v.img_url.split(',')
          }
          that.setData({
            rightList: that.data.rightList.concat(res.data.data.lists),
            rightMore: res.data.data.pre_page > res.data.data.lists.length
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
    app.setBar(options.t || '产品')
    this.setData({
      leftList: app.gs('listArr'),
      leftPage: app.gs('rightPage'),
      leftIndex: app.gs('rightIndex')
    }, this.getList)
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
