'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testImg: app.data.testImg,
    swiperIndex: 0,
    genderText: '女',
    experienceText: '零基础',
    teacherText: '无师自通',
    teacherArr: ['无师自通', '师从哪位'],
    questionArr: [{
      t: '发红'
    }, {
      t: '发蓝'
    }, {
      t: '不稳定'
    }, {
      t: '不上色'
    }, {
      t: '留色少'
    }, {
      t: '掉色快'
    }, {
      t: '上色慢'
    }],
    questionText: '发红，上色慢',
    personArr: [{
      t: '技能'
    }, {
      t: '形象'
    }, {
      t: '沟通'
    }, {
      t: '设计'
    }, {
      t: '配色'
    }, {
      t: '修护'
    }, {
      t: '并发症处理'
    }, {
      t: '拓店'
    }, {
      t: '管理'
    }, {
      t: '并发症处理'
    }, {
      t: '营销'
    }],
    personText: '技能，形象，并发症处理',
    showTop: 0,
    videoTab: [{
      t: '缴纳报名费'
    }, {
      t: '预约到店时间'
    }, {
      t: '到店学习'
    }],
    date: app.momentFormat(new Date(), 'YYYY-MM-DD'),
    endDate: app.momentFormat(app.momentAdd('3', 'M', new Date()), 'YYYY/MM/DD'),
    amArr: ['上午', '下午'],
    amIndex: 0,
    expectedArr: ['一天', '两天', '三天', '四天', '五天', '一个星期'],
    expectedIndex: 0
  },
  onShareAppMessage: function onShareAppMessage() {
    return {
      title: app.gs('shareText').t || '绣学问，真纹绣',
      path: '/pages/index/index',
      imageUrl: app.gs('shareText').g
    };
  },
  showBottomScorll: function showBottomScorll(e) {
    var type = e.currentTarget.dataset.type;
    var that = this;
    if (type === 'gender') {
      wx.showActionSheet({
        itemList: ['女', '男'],
        success: function success(res) {
          that.setData({
            genderText: res.tapIndex === 1 ? '男' : '女'
          });
        }
      });
    } else if (type === 'experience') {
      wx.showActionSheet({
        itemList: ['零基础', '有基础'],
        success: function success(res) {
          that.setData({
            experienceText: res.tapIndex === 1 ? '有基础' : '零基础'
          });
        }
      });
    } else {
      this.setData({
        chooseArr: type === 'teacher' ? this.data.teacherArr : type === 'question' ? this.data.questionArr : type === 'person' ? this.data.personArr : '',
        maskType: type
      }, this.maskChange);
    }
  },
  maskChange: function maskChange() {
    this.setData({
      maskShow: !this.data.maskShow
    });
  },
  maskChoose: function maskChoose(e) {
    if (this.data.maskType === 'question' || this.data.maskType === 'person') {
      this.data.chooseArr[e.currentTarget.dataset.index]['choose'] = !this.data.chooseArr[e.currentTarget.dataset.index]['choose'];
      this.setData({
        chooseArr: this.data.chooseArr
      });
    } else {
      this.setData({
        maskIndex: e.currentTarget.dataset.index
      });
    }
  },
  maskConfirm: function maskConfirm() {
    if (this.data.maskType === 'teacher') {
      if (this.data.maskIndex === 0) {
        this.setData({
          teacherText: '无师自通'
        });
      }
    } else {
      var tempArr = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.data.chooseArr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var v = _step.value;

          if (v.choose) {
            tempArr.push(v.t);
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

      if (this.data.maskType === 'question') {
        this.setData({
          questionArr: this.data.chooseArr,
          questionText: tempArr.join('，')
        });
      } else {
        this.setData({
          personArr: this.data.chooseArr,
          personText: tempArr.join('，')
        });
      }
    }
    this.maskChange();
  },
  inputValue: function inputValue(e) {
    app.inputValue(e, this);
  },

  // 选择地址
  chooseAddress: function chooseAddress() {
    if (this.data.lostTime) return;
    var that = this;
    wx.chooseAddress({
      success: function success(res) {
        if (res.telNumber) {
          // 获取信息成功
          wx.setStorageSync('addressInfo', res);
          that.setData({
            needSetting: false,
            addressInfo: res
          });
        }
      },
      fail: function fail() {
        wx.getSetting({
          success: function success(res) {
            if (!res.authSetting['scope.address']) {
              that.setData({
                needSetting: true
              });
              app.setToast(that, { content: '需授权获取地址信息' });
            }
          }
        });
      }
    });
  },

  // 获取设置
  openSetting: function openSetting() {
    var that = this;
    wx.openSetting({
      success: function success(res) {
        // console.log(res)
        if (res.authSetting['scope.address']) {
          that.setData({
            needSetting: false
          });
          that.chooseAddress();
        }
      }
    });
  },

  // 轮播切换
  swiperChange: function swiperChange() {
    this.setData({
      swiperIndex: this.data.swiperIndex
    });
  },
  pay: function pay() {
    var that = this;
    if (this.data.order_id) {
      return app.wxrequest({
        url: app.getUrl().payActiveAgain,
        data: {
          order_id: that.data.order_id,
          openid: app.gs()
        },
        success: function success(res) {
          wx.hideLoading();
          if (res.data.status === 200) {
            app.wxpay(Object.assign(res.data.data.msg, {
              success: function success() {
                that.setData({
                  swiperIndex: 1
                });
              },
              fail: function fail() {
                app.setToast(that, { content: '未完成支付' });
              }
            }));
          } else {
            app.setToast(that, { content: res.data.desc });
          }
        }
      });
    }
    app.wxrequest({
      url: app.getUrl().payActive,
      data: {
        openid: app.gs(),
        user_id: app.gs('userInfoAll').id,
        active_id: that.data.options.id,
        add_phone: that.data.addressInfo.telNumber,
        add_name: that.data.addressInfo.userName,
        count: 1,
        address: that.data.addressInfo.provinceName + that.data.addressInfo.cityName + that.data.addressInfo.countyName + that.data.addressInfo.detailInfo
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            order_id: res.data.data.order_id
          });
          app.wxpay(Object.assign(res.data.data.msg, {
            success: function success() {
              that.setData({
                swiperIndex: 1
              });
            },
            fail: function fail() {
              app.setToast(that, { content: '未完成支付' });
            }
          }));
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  dotPay: function dotPay() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().payDot,
      data: {
        openid: app.gs(),
        user_id: app.gs('userInfoAll').id,
        gift_id: that.data.options.id,
        name: that.data.addressInfo.userName,
        phone: that.data.addressInfo.telNumber,
        count: 1,
        address: '' + that.data.addressInfo.provinceName + that.data.addressInfo.cityName + that.data.addressInfo.countyName + that.data.addressInfo.detailInfo
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          app.wxpay(Object.assign(res.data.data.msg, {
            success: function success() {
              that.setData({
                swiperIndex: 1
              });
            },
            fail: function fail() {
              app.setToast(that, { content: '未完成支付' });
            }
          }));
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  activeSApply: function activeSApply() {
    var that = this;
    var makeTime = new Date(that.data.date).getTime();
    app.wxrequest({
      url: app.getUrl().activeSign,
      data: {
        order_id: that.data.order_id,
        sex: that.data.genderText === '女' ? 2 : 1,
        name: that.data.nameText,
        phone: that.data.phoneText,
        make_time: Math.floor(makeTime / 1000),
        day_up: that.data.amIndex * 1 + 1,
        experience: that.data.experienceText,
        follow_teach: that.data.teacherText,
        puzzled: that.data.questionText,
        perfect: that.data.personText,
        brand: that.data.brandText
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData({
            swiperIndex: 5,
            showTop: 1
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  nextTick: function nextTick(e) {
    if (e.currentTarget.dataset.index * 1 === 1) {
      if (!this.data.addressInfo) return app.setToast(this, { content: '请选择您的收货地址' });
      if (this.data.options.type === 'entering') return this.dotPay();
      return this.pay();
    } else if (e.currentTarget.dataset.index * 1 === 3 && (!this.data.nameText || this.data.phoneText.length * 1 !== 11)) {
      return app.setToast(this, { content: '请填写您的个人信息' });
    } else if (e.currentTarget.dataset.index * 1 === 5 && !this.data.brandText) {
      return app.setToast(this, { content: '请填写您使用的纹绣品牌' });
    } else if (e.currentTarget.dataset.index * 1 === 5 && this.data.brandText) {
      this.activeSApply();
    }
    this.setData({
      swiperIndex: e.currentTarget.dataset.index,
      showTop: e.currentTarget.dataset.index >= 2 ? 1 : 0
    });
  },

  // 用户选择
  userChoose: function userChoose(e) {
    if (e.currentTarget.dataset.type === 'am') {
      this.setData({
        amIndex: e.detail.value
      });
    } else if (e.currentTarget.dataset.type === 'time') {
      this.setData({
        date: e.detail.value
      });
    } else if (e.currentTarget.dataset.type === 'expected') {
      this.setData({
        expectedIndex: e.detail.value
      });
    } else if (e.currentTarget.dataset.type === 'gender') {
      this.setData({
        genderIndex: e.currentTarget.dataset.index
      });
    } else if (e.currentTarget.dataset.type === 'experience') {
      this.setData({
        experienceIndex: e.currentTarget.dataset.index
      });
    } else if (e.currentTarget.dataset.type === 'base') {
      this.setData({
        baseIndex: e.currentTarget.dataset.index
      });
    } else if (e.currentTarget.dataset.type === 'learn') {
      this.setData({
        learnIndex: e.currentTarget.dataset.index
      });
    }
  },
  getEnu: function getEnu() {
    var that = this;
    app.wxrequest({
      url: app.getUrl().activeEnum,
      data: {},
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          that.setData(_extends({}, res.data.data));
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
    if (options.type === 'entering') {
      this.setData({
        options: options,
        entering: true
      });
      app.setBar('门店入驻');
    } else {
      this.getEnu();
      this.setData({
        options: options
      });
      if (options.trade) {
        this.setData({
          swiperIndex: 1,
          order_id: options.id
        });
      }
      app.setBar('预约报名');
    }
    if (app.gs('addressInfo')) {
      this.setData({
        addressInfo: app.gs('addressInfo')
      });
    }

    // TODO: onLoad
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function onReady() {
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
    // TODO: onUnload
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    // TODO: onPullDownRefresh
  }
});