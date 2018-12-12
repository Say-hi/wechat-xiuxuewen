// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testImg: app.data.testImg,
    swiperIndex: 0,
    videoTab: [
      {
        t: '缴纳报名费'
      },
      {
        t: '预约到店时间'
      },
      {
        t: '到店学习'
      }
    ],
    date: app.momentFormat(new Date(), 'YYYY-MM-DD'),
    amArr: ['上午', '下午'],
    amIndex: 0,
    title: 'offlineApply'
  },
  // 轮播切换
  swiperChange (e) {
    if (e.detail.current < this.data.swiperIndex) {
      this.setData({
        swiperIndex: e.detail.current
      })
      return
    }
    this.setData({
      swiperIndex: this.data.swiperIndex
    })
  },
  // 选择日期
  bindDateChange (e) {
    if (e.currentTarget.dataset.type === 'am') {
      this.setData({
        amIndex: e.detail.value
      })
    } else {
      this.setData({
        date: e.detail.value
      })
    }
  },

  userChoose (e) {
    if (e.currentTarget.dataset.type === 'am') {
      this.setData({
        amIndex: e.detail.value
      })
    } else if (e.currentTarget.dataset.type === 'time') {
      this.setData({
        date: e.detail.value
      })
    } else if (e.currentTarget.dataset.type === 'gender') {
      this.setData({
        genderIndex: e.currentTarget.dataset.index
      })
    } else if (e.currentTarget.dataset.type === 'experience') {
      this.setData({
        experienceIndex: e.currentTarget.dataset.index
      })
    } else if (e.currentTarget.dataset.type === 'base') {
      this.setData({
        baseIndex: e.currentTarget.dataset.index
      })
    } else if (e.currentTarget.dataset.type === 'learn') {
      this.setData({
        learnIndex: e.currentTarget.dataset.index
      })
    }


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.setBar('预约报名')
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
