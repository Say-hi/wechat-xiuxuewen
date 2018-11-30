// 获取全局应用程序实例对象
const app = getApp()
let timer = null
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: 'collage',
    openType: 'share',
    testImg: app.data.testImg
  },
  lostTime (time) {
    if (timer) clearInterval(timer)
    let that = this
    let h = null
    let m = null
    let s = null
    let ms = null
    let msTime = time * 1000
    ms = Math.floor(msTime % 1000)
    s = Math.floor(msTime / 1000 % 60)
    m = Math.floor(msTime / 1000 / 60 % 60)
    h = Math.floor(msTime / 1000 / 60 / 60 % 24)
    that.setData({
      lost_h: h >= 10 ? h : '0' + h,
      lost_m: m >= 10 ? m : '0' + m,
      lost_s: s >= 10 ? s : '0' + s,
      lost_ms: ms >= 100 ? ms : ms >= 10 ? '0' + ms : '00' + ms
    })
    timer = setInterval(() => {
      if (msTime <= 0) {
        that.setData({
          lost_h: '已',
          lost_m: '经',
          lost_s: '结',
          lost_ms: '束'
        })
        return clearInterval(timer)
      }
      ms = Math.floor(msTime % 1000)
      s = Math.floor(msTime / 1000 % 60)
      m = Math.floor(msTime / 1000 / 60 % 60)
      h = Math.floor(msTime / 1000 / 60 / 60 % 24)
      that.setData({
        lost_h: h >= 10 ? h : '0' + h,
        lost_m: m >= 10 ? m : '0' + m,
        lost_s: s >= 10 ? s : '0' + s,
        lost_ms: ms >= 100 ? ms : ms >= 10 ? '0' + ms : '00' + ms
      })
      msTime -= 21
    }, 21)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    this.lostTime(60 * 60 * 24)
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
