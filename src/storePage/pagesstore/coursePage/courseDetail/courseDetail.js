// 获取全局应用程序实例对象
const app = getApp()
let PAGE = 0
let timer = null
let CAN_CHANGE = false
let NEED_SHOW = [0, 0, 0]
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperIndex: 1,
    swiperArr: [app.data.testImg, app.data.testImg],
    latitude: 23.111123,
    longitude: 113.123432,
    poster: 'https://c.jiangwenqiang.com/api/logo.jpg',
    controls: true,
    videoSrc: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400',
    currentIndex: 0,
    centerHeight: 63,
    starArr: ['差', '还行', '中等', '好', '很好'],
    videoTab: [
      {
        t: '详情'
      },
      {
        t: '教室'
      },
      {
        t: '评价 (22)'
      }
    ],
    commentArr: [],
    rIndex: -1
  },
  swiperChange (e) {
    this.setData({
      swiperIndex: e.detail.current * 1 + 1
    })
  },
  goComment () {
    this.setData({
      writeComment: !this.data.writeComment
    })
  },
  videoPlay () {
    this.setData({
      play: !this.data.play,
      needSmall: false
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
        replyFocus: false,
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
    // if (typeof this.data.tagIndex === 'undefined') return app.setToast(this, {content: '请选择难度等级'})
    if (typeof this.data.starIndex === 'undefined') return app.setToast(this, {content: '请选择星星等级'})
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
    // if (this.data.options && this.data.options.type * 1 === 3) return
    if (!CAN_CHANGE) return
    if (this.data.options && this.data.options.type * 1 !== 3) {
      let s = e.detail.scrollTop
      let currentIndex = 0
      if (s < NEED_SHOW[0]) currentIndex = 0
      else if (s > NEED_SHOW[0] && s < NEED_SHOW[1]) currentIndex = 1
      else if (s > NEED_SHOW[1]) currentIndex = 2
      this.setData({
        currentIndex
      })
    }
    let change = e.detail.deltaY
    if (change <= 0) {
      // 下方隐藏，上方缩小
      this.setData({
        needSmall: this.data.play ? 0 : true
      })
    }
  },
  touchend () {
    CAN_CHANGE = false
  },
  touchmove () {
    // console.log('move', e)
  },
  toucstart () {
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
  replyBlur (e) {
    console.log(e)
    this.setData({
      rIndex: -1,
      replyFocus: false
    })
  },

  showImg (e) {
    app.showImg(e.currentTarget.dataset.src, this.data.detailInfo.show_image)
  },

  buyOperation () {
    // todo 发起支付
    wx.navigateTo({
      url: '/offlinePage/pagesnine/offlineApply/offlineApply'
    })
  },
  // 获取滚动高度
  getScrollInHeight () {
    const query = wx.createSelectorQuery().in(this)
    query.selectAll('.need-check').boundingClientRect(function (res) {
      let i = 0
      for (let v of res) {
        NEED_SHOW[i] += v.height
        if (v.id === 's1') {
          i = 1
          NEED_SHOW[i] += NEED_SHOW[i - 1]
        } else if (v.id === 's2') {
          i = 2
          NEED_SHOW[i] += NEED_SHOW[i - 1]
        }
      }
    }).exec()
  },

  goMapPoint (e) {
    console.log(e.currentTarget.dataset)
    wx.openLocation({
      scale: 10,
      ...(e.currentTarget.dataset)
    })
  },
  // 获取评论
  getEvaluate () {
    let that = this
    app.wxrequest({
      url: app.getUrl().evaluate,
      data: {
        course_id: that.data.options.id,
        page: ++PAGE
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.setData({
            commentArr: that.data.commentArr.concat(res.data.data.lists),
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  // 评论弹窗触顶
  onScrollUp () {
    PAGE = 0
    this.data.commentArr = []
    this.getEvaluate()
  },
  // 评论弹窗触底
  onreachbottom () {
    if (this.data.more >= 1) this.getEvaluate()
  },
  // 获取详情
  getDetail () {
    let that = this
    app.wxrequest({
      url: that.data.options.type * 1 === 3 ? app.getUrl().teacherDotDetail : app.getUrl().courseDetail,
      data: that.data.options.type * 1 === 3 ? {
        user_id: app.gs('userInfoAll').id
      } : {
        course_id: that.data.options.id || 1,
        user_id: app.gs('userInfoAll').id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          if (that.data.options.type * 1 === 3) {
            res.data.data.room_teacher = res.data.data.room_teacher ? res.data.data.room_teacher.split(',') : []
            res.data.data.show_image = res.data.data.show_image.split(',')
            that.setData({
              swiperArr: res.data.data.room_images.split(','),
              detailInfo: res.data.data
            })
            app.setBar(res.data.data.room_name)
          } else {
            that.setData({
              detailInfo: res.data.data
            }, that.getEvaluate)
            app.setBar(res.data.data.title)
          }
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  // 发布直接评论
  writeConfirm (e) {
    this.data.commentArr.unshift({
      avatar: this.data.poster,
      nickname: '测试发布评论',
      star: Math.floor(Math.random() * 5),
      create_time: '刚刚',
      replyArr: [],
      content: typeof e.detail.value === 'string' ? e.detail.value : e.detail.value.content
    })
    this.goComment()
    this.setData({
      inputValue: '',
      commentArr: this.data.commentArr
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    // type 对应规则 1 线上课程 2 线下课程 3 教室
    this.setData({
      options
    }, this.getDetail)
    if (options.type * 1 === 2 || options.type * 1 === 4) {
      this.data.videoTab[2].t = '作品秀'
      this.setData({
        videoTab: this.data.videoTab
      })
    } else if (options.type * 1 === 3) {
      this.data.videoTab[1].t = '老师风采'
      this.data.videoTab[2].t = '作品秀'
      this.setData({
        videoTab: this.data.videoTab
      })
    }
    // TODO: onLoad
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    this.getScrollInHeight()
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
