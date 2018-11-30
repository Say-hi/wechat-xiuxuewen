// 获取全局应用程序实例对象
const app = getApp()
let timer = null
let CAN_CHANGE = false
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    poster: 'https://c.jiangwenqiang.com/api/logo.jpg',
    controls: true,
    videoSrc: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
    currentIndex: -1,
    centerHeight: 63,
    starArr: ['差', '还行', '中等', '好', '很好'],
    videoTab: [
      {
        t: '目录'
      },
      {
        t: '评价(0)'
      },
      {
        t: '详情'
      }
    ],
    questionList: [
      {
        question: '2.圆三针手工雾眉操作要领操，这个是题干这个是题干圆三针手工雾眉操作要领操，这个是题干这个是题干圆三针手工雾眉操作要领操，这个',
        answer: ['wdfasdf', 'asdfasdfsd', 'asdfasdfasdf'],
        chooseIndex: null
      },
      {
        question: '2.圆三针手工雾眉操作要领操，这个是题干这个是题干圆三针手工雾眉操作要领操，这个是题干这个是题干圆三针手工雾眉操作要领操，这个',
        answer: ['圆三针手工雾眉操作要领操', '圆三针手工雾眉操作要领操', '圆三针手工雾眉操作要领操'],
        chooseIndex: null,
        userChoose: 0,
        rightAnswer: 1
      },
      {
        question: '2.圆三针手工雾眉操作要领操，这个是题干这个是题干圆三针手工雾眉操作要领操，这个是题干这个是题干圆三针手工雾眉操作要领操，这个',
        answer: ['圆三针手工雾眉操作要领操', 'asdfasdfsd', '圆三针手工雾眉操作要领操'],
        chooseIndex: null,
        userChoose: 1,
        rightAnswer: 1
      },
      {
        question: '2.圆三针手工雾眉操作要领操，这个是题干这个是题干圆三针手工雾眉操作要领操，这个是题干这个是题干圆三针手工雾眉操作要领操，这个',
        answer: ['圆三针手工雾眉操作要领操', 'asdfasdfsd', '圆三针手工雾眉操作要领操'],
        chooseIndex: null,
        userChoose: 1,
        rightAnswer: 1
      },
      {
        question: '2.圆三针手工雾眉操作要领操，这个是题干这个是题干圆三针手工雾眉操作要领操，这个是题干这个是题干圆三针手工雾眉操作要领操，这个',
        answer: ['圆三针手工雾眉操作要领操', 'asdfasdfsd', '圆三针手工雾眉操作要领操'],
        chooseIndex: null,
        userChoose: 1,
        rightAnswer: 1
      }
    ],
    rIndex: -1
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
  userChooseAnswer (e) {
    this.data.questionList[e.currentTarget.dataset.qindex]['chooseIndex'] = e.currentTarget.dataset.aindex
    this.setData({
      questionList: this.data.questionList
    })
  },
  videoPlay () {
    this.setData({
      play: !this.data.play
    })
  },
  videoEnd () {
    this.videoPlay()
    console.log('视频播放结束')
  },
  chooseIndex (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index,
      scrollToId: e.currentTarget.dataset.id
    })
  },

  chooseVideoPlay (e) {
    this.setData({
      videoPlayIndex: e.currentTarget.dataset.index
    })
  },
  showMore (e) {
    if (e.currentTarget.dataset.type === 'comment') {
      return this.setData({
        showComment: !this.data.showComment
      })
    }
    this.setData({
      show_more: !this.data.show_more
    })
  },
  noUp () {},
  startChoose (e) {
    this.setData({
      starIndex: e.currentTarget.dataset.index
    })
  },
  tagChoose (e) {
    this.setData({
      tagIndex: e.currentTarget.dataset.index
    })
  },

  upStar () {
    if (typeof this.data.tagIndex === 'undefined') return app.setToast(this, {content: '请选择难度等级'})
    else if (typeof this.data.starIndex === 'undefined') return app.setToast(this, {content: '请选择星星等级'})
    this.setData({
      starOperation: true
    })
  },

  collectO () {
    this.setData({
      collect: !this.data.collect
    })
  },

  startAnswer (e) {
    if (e.currentTarget.dataset.type === 'open') this.lostTime(60)
    else if (e.currentTarget.dataset.type === 'practice') this.lostTime(60)
    else {
      if (timer) clearInterval(timer)
    }
    this.setData({
      answerQuestion: !this.data.answerQuestion,
      finish: e.currentTarget.dataset.type === 'upAnswer' ? 1 : 0
    })
  },

  scrollOperation (e) {
    if (!CAN_CHANGE) return
    let change = e.detail.deltaY
    if (change <= 0) {
      // 下方隐藏，上方缩小
      this.setData({
        needSmall: true
      })
    }
  },
  touchend () {
    CAN_CHANGE = false
  },
  touchmove (e) {
    console.log('move', e)
  },
  toucstart (e) {
    CAN_CHANGE = true
  },
  scrollUp () {
    CAN_CHANGE = false
    this.setData({
      needSmall: false
    })
  },
  // 用户回复操作
  replyOperation (e) {
    if (this.data.replyFocus) return
    this.setData({
      replyName: e.currentTarget.dataset.name,
      rIndex: e.currentTarget.dataset.cindex,
      replyFocus: true
    })
  },
  replyBlur () {
    this.setData({
      rIndex: -1,
      replyFocus: false
    })
  },
  // 分享
  onShareAppMessage () {

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
