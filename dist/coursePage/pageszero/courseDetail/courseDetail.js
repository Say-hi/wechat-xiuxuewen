'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// 获取全局应用程序实例对象
var app = getApp();
var PAGE = 0;
var CAN_CHANGE = true;
var NEED_SHOW = [0, 0, 0];
var REPLY = false;
var MOVE = true;
var timer = null;
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    systemVersion: app.data.systemVersion,
    page: 0,
    swiperIndex: 1,
    swiperArr: [app.data.testImg],
    latitude: 23.111123,
    longitude: 113.123432,
    poster: 'https://c.jiangwenqiang.com/api/logo.jpg',
    controls: true,
    currentIndex: 0,
    centerHeight: 63,
    starArr: ['差', '还行', '中等', '好', '很好'],
    videoTab: [{
      t: '详情'
    }, {
      t: '教室'
    }, {
      t: '评价'
    }],
    commentArr: [],
    rIndex: -1
  },
  swiperChange: function swiperChange(e) {
    this.setData({
      swiperIndex: e.detail.current * 1 + 1
    });
  },
  goComment: function goComment() {
    this.setData({
      writeComment: !this.data.writeComment
    });
  },
  userChooseAnswer: function userChooseAnswer(e) {
    this.data.questionList[e.currentTarget.dataset.qindex]['chooseIndex'] = e.currentTarget.dataset.aindex;
    this.setData({
      questionList: this.data.questionList
    });
  },
  videoPlay: function videoPlay() {
    this.setData({
      play: !this.data.play,
      needSmall: false
    });
  },
  videoEnd: function videoEnd() {
    this.videoPlay();
    console.log('视频播放结束');
  },

  // 导航栏选择操作
  chooseIndex: function chooseIndex(e) {
    CAN_CHANGE = false;
    setTimeout(function () {
      CAN_CHANGE = true;
    }, 1000);
    if (this.data.options && this.data.options.type * 1 === 3) {
      this.setData({
        currentIndex: e.currentTarget.dataset.index
      });
      if (e.currentTarget.dataset.index > 0 && e.currentTarget.dataset.index < 3) {
        this.data.page = 0;
        this.data.commentArr = [];
        this.getOfflineCourse();
      }
    } else {
      this.setData({
        currentIndex: e.currentTarget.dataset.index,
        scrollToId: e.currentTarget.dataset.id
      });
    }
  },
  chooseVideoPlay: function chooseVideoPlay(e) {
    this.setData({
      videoPlayIndex: e.currentTarget.dataset.index
    });
  },
  showMore: function showMore(e) {
    if (e.currentTarget.dataset.type === 'comment') {
      return this.setData({
        replyFocus: false,
        showComment: !this.data.showComment
      });
    }
    this.setData({
      show_more: !this.data.show_more
    });
  },
  noUp: function noUp() {},
  startChoose: function startChoose(e) {
    this.setData({
      starIndex: e.currentTarget.dataset.index
    });
  },
  tagChoose: function tagChoose(e) {
    this.setData({
      tagIndex: e.currentTarget.dataset.index
    });
  },

  // 评星
  upStar: function upStar() {
    if (typeof this.data.starIndex === 'undefined') return app.setToast(this, { content: '请选择星星等级' });
    var that = this;
    app.wxrequest({
      url: app.getUrl().courseStar,
      data: {
        course_id: that.data.options.id,
        user_id: app.gs('userInfoAll').id,
        score: that.data.starIndex * 1 + 1
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.data.detailInfo.star = that.data.starIndex * 1 + 1;
          that.setData({
            starOperation: true
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },

  // 点赞
  collectO: function collectO() {
    var that = this;
    var type = that.data.options.type * 1 === 1 ? 1 : that.data.options.type * 1 === 2 || that.data.options.type * 1 === 4 ? 3 : that.data.options.type * 1 === 3 ? 2 : null;
    app.userCollect(that.data.collect, that.data.options.id, that.data.detailInfo.user_id, type).then(function () {
      that.data.collect ? --that.data.detailInfo.collect_count : ++that.data.detailInfo.collect_count;
      that.setData({
        collect: !that.data.collect,
        detailInfo: that.data.detailInfo
      });
    }, function (err) {
      console.log(err);
    });
  },
  startAnswer: function startAnswer(e) {
    if (e.currentTarget.dataset.type === 'open') this.lostTime(60);else if (e.currentTarget.dataset.type === 'practice') this.lostTime(60);else {
      if (timer) clearInterval(timer);
    }
    this.setData({
      answerQuestion: !this.data.answerQuestion,
      finish: e.currentTarget.dataset.type === 'upAnswer' ? 1 : 0
    });
  },

  // scroll滚动监听
  scrollOperation: function scrollOperation(e) {
    // if (this.data.options && this.data.options.type * 1 === 3) return
    // if (!CAN_CHANGE) return
    if (this.data.options && this.data.options.type * 1 !== 3) {
      if (!CAN_CHANGE) return;
      var s = e.detail.scrollTop;
      console.log('s', s);
      console.log('NEED_SHOW[1]', NEED_SHOW[1]);
      var currentIndex = 0;
      if (s < NEED_SHOW[0]) currentIndex = 0;else if (s > NEED_SHOW[0] && s < NEED_SHOW[1]) currentIndex = 1;else if (s > NEED_SHOW[1]) currentIndex = 2;
      this.setData({
        currentIndex: currentIndex
      });
    }
    // let change = e.detail.deltaY
    var change = 10;
    if (change <= 0) {
      // 下方隐藏，上方缩小
      this.setData({
        needSmall: this.data.play ? 0 : true
      });
    }
  },
  touchend: function touchend() {
    // CAN_CHANGE = false
  },
  touchmove: function touchmove() {
    // console.log('move', e)
  },
  toucstart: function toucstart() {
    // CAN_CHANGE = true
  },
  noneedsmall: function noneedsmall() {
    if (this.data.privice === 'need') {
      this.setData({
        needSmall: !this.data.needSmall
      });
    } else if (!this.data.privice) {
      app.cloud().getMoney().then(function (res) {
        that.setData({
          privice: res.privice
        });
      });
    }
  },
  scrollUp: function scrollUp() {
    if (MOVE) return;
    CAN_CHANGE = false;
    this.setData({
      needSmall: false
    });
  },

  // 用户回复操作
  replyOperation: function replyOperation(e) {
    console.log(e);
    if (this.data.replyFocus) return;
    if (e.currentTarget.dataset.id === app.gs('userInfoAll').id) return app.setToast(this, { content: '不能回复自己哦' });
    this.setData({
      replyName: e.currentTarget.dataset.name,
      rIndex: e.currentTarget.dataset.cindex,
      answer_user_id: e.currentTarget.dataset.name === '回复楼主' ? 0 : e.currentTarget.dataset.id || 0,
      answer_is_teach: e.currentTarget.dataset.teach || 0,
      replyFocus: true
    });
  },

  // 失焦
  replyBlur: function replyBlur() {
    var _this = this;

    setTimeout(function () {
      _this.setData({
        rIndex: -1,
        replyFocus: false
      });
    }, 200);
  },

  // 回复
  replyConfirm: function replyConfirm(e) {
    console.log(e);
    if (REPLY) return;
    REPLY = true;
    if (!e.detail.value.length) return app.setToast(that, { content: '请输入您的回复内容' });
    var that = this;
    var index = that.data.rIndex;
    app.wxrequest({
      url: app.getUrl().courseDiscussSub,
      data: {
        evaluate_id: that.data.commentArr[index].evaluate_id,
        evaluate_user_id: that.data.commentArr[index].user_id,
        reply_user_id: app.gs('userInfoAll').id,
        course_id: that.data.detailInfo.id,
        dis_comment: e.detail.value,
        answer_user_id: that.data.answer_user_id || ''
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.data.commentArr[index].next.push({
            reply_user_id: app.gs('userInfoAll').id,
            reply_nickname: app.gs('userInfoAll').nickname || '默认用户',
            reply_is_teach: app.gs('userInfoAll').is_teach || 0,
            dis_comment: e.detail.value,
            answer_nickname: that.data.replyName,
            answer_user_id: that.data.answer_user_id,
            answer_is_teach: that.data.answer_is_teach || 0
          });
          that.setData({
            commentArr: that.data.commentArr
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      },
      complete: function complete() {
        REPLY = false;
      }
    });
  },

  // 展示图片
  showImg: function showImg(e) {
    app.showImg(e.currentTarget.dataset.src, e.currentTarget.dataset.type === 'swiper' ? this.data.swiperArr : this.data.detailInfo.show_image);
  },
  showImg2: function showImg2(e) {
    app.showImg(e.currentTarget.dataset.src, this.data.detailInfo[e.currentTarget.dataset.label]);
  },

  // 支付操作
  buyOperation: function buyOperation() {
    // todo 发起支付
    wx.navigateTo({
      url: '/offlinePage/pagesnine/offlineApply/offlineApply?id=' + this.data.detailInfo.id + '&price=' + this.data.detailInfo.price + '&freight=' + this.data.detailInfo.freight
    });
  },

  // 获取滚动高度
  getScrollInHeight: function getScrollInHeight() {
    var query = wx.createSelectorQuery().in(this);
    query.selectAll('.need-check').boundingClientRect(function (res) {
      var i = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = res[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var v = _step.value;

          NEED_SHOW[i] += v.height;
          if (v.id === 's1') {
            i = 1;
            NEED_SHOW[i] += NEED_SHOW[i - 1];
          } else if (v.id === 's2') {
            i = 2;
            NEED_SHOW[i] += NEED_SHOW[i - 1];
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }).exec();
  },
  goMapPoint: function goMapPoint(e) {
    console.log(e.currentTarget.dataset);
    wx.openLocation(_extends({
      scale: 10
    }, e.currentTarget.dataset));
  },

  // 获取评论
  getEvaluate: function getEvaluate() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().evaluate,
      data: {
        course_id: that.data.options.id,
        page: ++PAGE
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = res.data.data.lists[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var v = _step2.value;

              v.create_time = app.moment(v.create_time * 1000);
              v['page'] = 1;
              v['more'] = v.next.length < 10 ? 0 : 1;
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          that.setData({
            total: res.data.data.total,
            commentArr: that.data.commentArr.concat(res.data.data.lists),
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },

  // 获取更多的评论
  getMoreNext: function getMoreNext(e) {
    var that = this;
    app.wxrequest({
      url: app.getUrl().courseDiscuss,
      data: {
        evaluate_id: that.data.commentArr[e.currentTarget.dataset.index].evaluate_id,
        page: ++e.currentTarget.dataset.page
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          ++that.data.commentArr[e.currentTarget.dataset.index].page;
          that.data.commentArr[e.currentTarget.dataset.index].next = that.data.commentArr[e.currentTarget.dataset.index].next.concat(res.data.data.lists);
          that.data.commentArr[e.currentTarget.dataset.index].more = res.data.data.lists.length < res.data.data.pre_page ? 0 : 1;
          that.setData({
            commentArr: that.data.commentArr
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },

  // 评论弹窗触顶
  onScrollUp: function onScrollUp() {
    PAGE = 0;
    this.data.commentArr = [];
    this.getEvaluate();
  },

  // 评论弹窗触底
  onreachbottom: function onreachbottom() {
    if (this.data.more >= 1) this.getEvaluate();
  },

  // 分享
  onShareAppMessage: function onShareAppMessage() {
    var that = this;
    return {
      title: '\u5411\u60A8\u63A8\u8350' + that.data.detailInfo.title + '\u6559\u5B66',
      path: '/coursePage/pageszero/courseDetail/courseDetail?id=' + that.data.options.id + '&type=' + that.data.options.type
    };
  },

  // 获取详情
  getDetail: function getDetail() {
    if (this.data.options.type * 1 === 3) return this.getStoreDetail();else if (this.data.options.type * 1 === 2 || this.data.options.type * 1 === 4) return this.getOfflineDetail();
    var that = this;
    app.wxrequest({
      url: app.getUrl().courseDetail,
      data: {
        course_id: that.data.options.id,
        user_id: app.gs('userInfoAll').id
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          if (!res.data.data) {
            app.setToast(that, { content: '内容已被删除' });
            setTimeout(function () {
              wx.navigateBack();
            }, 1000);
          }
          try {
            res.data.data['collect_count'] >= 0 ? res.data.data.collect_count = res.data.data.collect_count * 1 + res.data.data.collect_base : res.data.data['collect_count'] = 0;
          } catch (err) {
            res.data.data['collect_count'] = 0;
          }
          if (res.data.data.detail) {
            res.data.data.detail = res.data.data.detail.split(',');
          }
          that.setData({
            collect: res.data.data.is_collect >= 1 ? true : 0,
            detailInfo: res.data.data
          }, that.getEvaluate);
          app.setBar(res.data.data.title);
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },

  // 获取门店详情
  getStoreDetail: function getStoreDetail() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().dotDetail,
      data: {
        dot_id: that.data.options.id,
        user_id: app.gs('userInfoAll').id
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          if (!res.data.data) {
            app.setToast(that, { content: '学堂暂停营业' });
            setTimeout(function () {
              wx.navigateBack();
            }, 1000);
          }
          res.data.data['collect_count'] >= 0 ? res.data.data.collect_count = res.data.data.collect_count * 1 + res.data.data.collect_base : res.data.data['collect_count'] = 0;
          res.data.data.class_image = res.data.data.class_image ? res.data.data.class_image.split(',') : [];
          res.data.data.room_images = res.data.data.room_images ? res.data.data.room_images.split(',') : [];
          res.data.data.show_image = res.data.data.show_image ? res.data.data.show_image.split(',') : [];
          res.data.data.room_teacher = res.data.data.room_teacher ? res.data.data.room_teacher.split(',') : [];
          app.setBar(res.data.data.room_name);
          that.setData({
            collect: res.data.data.is_collect >= 1 ? true : 0,
            swiperArr: res.data.data.room_images,
            detailInfo: res.data.data
          });
          wx.getLocation({
            success: function success(res2) {
              if (res2.latitude) {
                var d = app.distance(res2.latitude, res2.longitude, res.data.data.latitude, res.data.data.longitude);
                that.setData({
                  storeDistance: d > 1000 ? '离你最近' + (d / 1000).toFixed(2) + 'km' : '离你最近' + d + 'm'
                });
              }
            }
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },

  // 获取线下课程详情
  getOfflineDetail: function getOfflineDetail() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().activeDetail,
      data: {
        active_id: that.data.options.id,
        user_id: app.gs('userInfoAll').id
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          if (!res.data.data) {
            app.setToast(that, { content: '课程已被删除' });
            setTimeout(function () {
              wx.navigateBack();
            }, 1000);
          }
          res.data.data['collect_count'] >= 0 ? res.data.data.collect_count = res.data.data.collect_count * 1 + res.data.data.collect_base : res.data.data['collect_count'] = 0;
          res.data.data.show_image = res.data.data.show_image ? res.data.data.show_image.split(',') : [];
          res.data.data.room_images = res.data.data.room_images ? res.data.data.room_images.split(',') : [];
          that.setData({
            collect: res.data.data.is_collect >= 1 ? true : 0,
            detailInfo: res.data.data
          });
          app.setBar(res.data.data.title);
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },

  // 获取驻店课程
  getOfflineCourse: function getOfflineCourse() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().dotRelease,
      data: {
        user_id: that.data.detailInfo.user_id,
        style: that.data.currentIndex * 1 === 1 ? 2 : 4,
        page: ++that.data.page
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            commentArr: that.data.commentArr.concat(res.data.data.lists),
            more: res.data.data.lists.length < res.data.data.pre_page ? 0 : 1
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },

  // 发布直接评论
  writeConfirm: function writeConfirm(e) {
    var that = this;
    if (e.detail.value.content.length <= 4) return app.setToast(that, { content: '评论内容需大于5个字' });
    app.wxrequest({
      url: app.getUrl().courseEvaluateSub,
      data: {
        course_id: that.data.options.id,
        user_id: app.gs('userInfoAll').id,
        comment: e.detail.value.content,
        course_user_id: that.data.detailInfo.user_id
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.data.commentArr.unshift({
            avatar_url: app.gs('userInfoAll').avatar_url,
            user_id: app.gs('userInfoAll').id,
            nickname: app.gs('userInfoAll').nickname,
            star_num: that.data.detailInfo.star,
            create_time: '刚刚',
            next: [],
            comment: e.detail.value.content
          });
          that.setData({
            inputValue: '',
            commentArr: that.data.commentArr
          }, that.goComment);
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    if (!app.gs('userInfoAll')) return app.wxlogin();
    var that = this
    app.cloud().getMoney().then(function (res) {
      that.setData({
        privice: res.privice
      });
      if (res.privice === 'noneed' && options.type != 3) {
        app.setToast(that, {content: '内容已删除，不可访问'})
        wx.redirectTo({
          url: '/pages/index/index',
        })
      }
    });
    // type 对应规则 1 线上课程 2 线下课程 3 教室
    if (options.type === 'search') options.type = 1;
    this.setData({
      options: options
    }, this.getDetail);
    if (options.type * 1 === 2 || options.type * 1 === 4) {
      this.data.videoTab[2].t = '作品秀';
      this.setData({
        videoTab: this.data.videoTab
      });
    } else if (options.type * 1 === 3) {
      this.data.videoTab[1].t = '线下课程';
      this.data.videoTab[2].t = '驻店课程';
      this.data.videoTab.push({ t: '作品秀' });
      this.setData({
        videoTab: this.data.videoTab
      });
    }
    // TODO: onLoad
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function onReady() {
    this.getScrollInHeight();
    // TODO: onReady
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function onShow() {
    // TODO: onShow
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function onHide() {
    // TODO: onHide
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function onUnload() {
    PAGE = 0;
    NEED_SHOW[0] = NEED_SHOW[1] = NEED_SHOW[2] = 0;
    // TODO: onUnload
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // TODO: onPullDownRefresh
  }
});