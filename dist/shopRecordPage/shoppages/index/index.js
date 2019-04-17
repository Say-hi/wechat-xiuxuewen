'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    tabIndex: 0,
    star_date: new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate(),
    end_date: new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate(),
    tabArr: ['全部收益', '今日收益', '已到账收益', '待到账收益'],
    directArr: ['', '直属上级', '间接上级', '商店收入'],
    page: 0
  },
  pickerChoose: function pickerChoose(e) {
    this.setData(_defineProperty({}, e.currentTarget.dataset.type, e.detail.value.replace(/-/g, '/')));
  },
  timeChoose: function timeChoose(e) {
    if (e.currentTarget.dataset.type === 'confirm') {
      if (new Date(this.data.end_date).getTime() < new Date(this.data.star_date)) return app.setToast(this, { content: '开始时间不能大于结束时间' });
    } else {
      return this.setData({
        star_date: new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate(),
        end_date: new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate()
      });
    }
    this.showTimeChoose();
  },
  showTimeChoose: function showTimeChoose() {
    this.setData({
      timeshow: !this.data.timeshow
    });
  },
  chooseTab: function chooseTab(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    });
  },
  getList: function getList() {
    var that = this;
    app.wxrequest({
      url: app.getUrl()[that.data.type === 'withdraw' ? 'shopUserRecord' : 'shopUserInDetail'],
      data: {
        uid: app.gs('userInfoAll').id,
        page: ++this.data.page
      },
      success: function success(res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        if (res.data.status === 200) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = res.data.data.lists[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var v = _step.value;

              v['create_time'] = app.momentFormat(v.create_time * 1000, 'YYYY-MM-DD HH:mm:ss');
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

          that.setData({
            list: that.data.list.concat(res.data.data.lists),
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  onShareAppMessage: function onShareAppMessage() {
    if (!app.gs('shopInfo').mid) {
      return {
        title: app.gs('shareText').t || '绣学问，真纹绣',
        path: '/pages/index/index',
        imageUrl: app.gs('shareText').g
      };
    } else {
      return {
        title: '\u5411\u60A8\u63A8\u8350\u5E97\u94FA\u3010' + app.gs('shopInfoAll').name + '\u3011',
        imageUrl: '' + (app.gs('shopInfoAll').avatar || ''),
        path: '/shopPage/shoppages/index/index?mid=' + app.gs('shopInfoAll').id + '&user=' + app.gs('userInfoAll').id
      };
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.setData({
      type: options.type,
      tabIndex: options.index
    }, this.getList);
    app.setBar(options.type === 'withdraw' ? '提现记录' : '收益明细');
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
  onReachBottom: function onReachBottom() {
    if (this.data.more > 0) this.getList();else app.setToast(this, { content: '没有更多内容啦' });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function onPullDownRefresh() {
    this.data.page = 0;
    this.data.list = [];
    this.getList();
    // TODO: onPullDownRefresh
  }
});