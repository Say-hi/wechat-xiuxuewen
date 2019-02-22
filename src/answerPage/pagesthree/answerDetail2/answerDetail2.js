// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    rIndex: -1,
    page: 0,
    testImg: app.data.testImg,
    commentArr: []
  },
  getMoreNext () {
    this.getEvaluate()
  },
  // 用户回复操作
  replyOperation (e) {
    if (this.data.replyFocus) return
    this.setData({
      replyName: e.currentTarget.dataset.name,
      rIndex: e.currentTarget.dataset.cindex,
      answer_is_teach: e.currentTarget.dataset.teach || 0,
      receiver_user_id: e.currentTarget.dataset.name === '题主' ? 0 : e.currentTarget.dataset.id || 0,
      replyFocus: true
    })
  },
  replyBlur () {
    setTimeout(() => {
      this.setData({
        rIndex: -1,
        replyFocus: false
      })
    }, 200)
  },
  replyConfirm (e) {
    if (!e.detail.value.length) return app.setToast(that, {content: '请输入您的回复内容'})
    let that = this
    // let index = that.data.rIndex
    app.wxrequest({
      url: app.getUrl().questionDiscussSub,
      data: {
        question_id: that.data.options.id,
        user_id: app.gs('userInfoAll').id,
        receiver_id: that.data.info.user_id,
        comment: e.detail.value,
        receiver_user_id: that.data.rIndex * 1 === 0.5 ? 0 : that.data.commentArr[that.data.rIndex].user_id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.data.commentArr.push({
            reply_user_id: app.gs('userInfoAll').id,
            reply_nickname: app.gs('userInfoAll').nickname || '默认用户',
            reply_is_teach: app.gs('userInfoAll').is_teach || 0,
            comment: e.detail.value,
            answer_nickname: that.data.replyName,
            receiver_user_id: that.data.receiver_user_id,
            answer_is_teach: that.data.answer_is_teach || 0
          })
          that.setData({
            commentArr: that.data.commentArr
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  // 点赞
  collectO () {
    let that = this
    app.userCollect(that.data.collect, that.data.options.id, that.data.info.user_id, 4).then(() => {
      that.data.collect ? --that.data.info.collect_count : ++that.data.info.collect_count
      that.setData({
        collect: !that.data.collect,
        info: that.data.info
      })
    }, err => {
      console.log(err)
    })
  },
  onShareAppMessage () {
    let that = this
    return {
      title: '分享了一个问答',
      path: `/answerPage/pagesthree/answerDetail2/answerDetail2?id=${that.data.options.id}`
    }
  },
  getDetail () {
    let that = this
    this.getEvaluate()
    app.wxrequest({
      url: app.getUrl().questionDetail,
      data: {
        question_id: that.data.options.id,
        user_id: app.gs('userInfoAll').id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          res.data.data.images = res.data.data.images ? res.data.data.images.split(',') : []
          res.data.data.create_time = app.momentFormat(res.data.data.create_time * 1000, 'YYYY年MM月DD日 HH:mm:ss')
          that.setData({
            collect: res.data.data.is_collect >= 1 ? true : 0,
            info: res.data.data
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  getEvaluate () {
    let that = this
    app.wxrequest({
      url: app.getUrl().questionDiscuss,
      data: {
        question_id: that.data.options.id,
        page: ++this.data.page
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

  showImg (e) {
    app.showImg(this.data.info.images[e.currentTarget.dataset.index], this.data.info.images)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    if (!app.gs('userInfoAll')) return app.wxlogin()
    this.setData({
      options
    }, this.getDetail)
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
