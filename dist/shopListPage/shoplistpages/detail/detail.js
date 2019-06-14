'use strict';

// 获取全局应用程序实例对象
var app = getApp();
console.log(app.data.all_Screen);
var startX = 0;
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ngshow: 1,
    enable_progress_gesture: true,
    systemVersion: app.data.systemVersion,
    num: 1,
    labelIndex: 0,
    all_Screen: app.data.all_screen,
    discount_name: app.gs('shopInfoAll').discount_name,
    discount_value: app.gs('shopInfoAll').discount_value
  },
  videotouchstart: function videotouchstart(e) {
    console.log(e);
    startX = e.changedTouches[0].clientX;
  },
  videotouchend: function videotouchend(e) {
    console.log(e);
    if (startX - e.changedTouches[0].clientX >= 30) {
      console.log(1);
      this.setData({
        current: 1
      });
    }
  },
  showImg: function showImg(e) {
    wx.previewImage({
      urls: this.data.info.detail,
      current: this.data.info.detail[e.currentTarget.dataset.index]
    });
  },
  goSubmit: function goSubmit() {
    if (this.data.num > this.data.info.sku[this.data.labelIndex].stock) return app.setToast(this, { content: '该产品已无库存' });
    if (this.data.addCar) {
      var that = this;
      return app.wxrequest({
        url: app.getUrl().shopCartAdd,
        data: Object.assign({
          uid: app.gs('userInfoAll').id,
          mid: that.data.info.mid,
          count: that.data.num,
          sku_id: that.data.info.sku[that.data.labelIndex].id,
          pid: that.data.info.id
        }),
        success: function success(res) {
          wx.hideLoading();
          if (res.data.status === 200) {
            wx.showToast({
              title: '添加成功'
            });
            that.setData({
              num: 1,
              buyMask: that.data.info.label * 1 !== -1
            });
          } else {
            app.setToast(that, { content: res.data.desc });
          }
        }
      });
    }
    var _data$info = this.data.info,
        img = _data$info.img,
        title = _data$info.title,
        label = _data$info.label,
        sku = _data$info.sku,
        freight = _data$info.freight,
        id = _data$info.id;

    app.su('buyInfo', [{
      id: id,
      img: img,
      title: title,
      label: label,
      freight: freight,
      sku: sku[this.data.labelIndex],
      count: this.data.num
    }]);
    wx.redirectTo({
      url: '../submit/submit?type=now'
    });
  },
  sptChange: function sptChange() {
    this.setData({
      showPingTeam: !this.data.showPingTeam
    });
  },
  buy: function buy(e) {
    if (this.data.ping) {
      this.setData({
        ngshow: ++this.data.ngshow
      });
      return;
    }
    this.data.addCar = e.currentTarget.dataset.type === 'car';
    this.setData({
      buyMask: !this.data.buyMask
    });
  },
  noUse: function noUse() {
    app.noUse();
  },
  numOperation: function numOperation(e) {
    var type = e.currentTarget.dataset.type;
    if (type === 'add') {
      if (this.data.num >= this.data.info.sku[this.data.labelIndex].stock) return app.setToast(this, { content: '已达库存上限' });
      this.setData({
        num: ++this.data.num
      });
    } else {
      if (this.data.num <= 1) return;
      this.setData({
        num: --this.data.num
      });
    }
  },
  chooseSp: function chooseSp(e) {
    this.setData({
      labelIndex: e.currentTarget.dataset.index,
      current: 0
    });
  },
  shopProduct: function shopProduct(pid) {
    var that = this;
    app.wxrequest({
      url: app.getUrl().shopProduct,
      data: {
        pid: pid
      },
      success: function success(res) {
        wx.hideLoading();
        if (res.data.status === 200) {
          res.data.data.imgs = res.data.data.imgs ? res.data.data.imgs.split(',') : [];
          res.data.data.detail = res.data.data.detail ? res.data.data.detail.split(',') : [];
          app.setBar(res.data.data.title);
          res.data.data['stock'] = 0;
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = res.data.data.sku[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var v = _step.value;

              v['discount'] = (v.price * that.data.discount_value).toFixed(2);
              res.data.data['stock'] += v.stock * 1;
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

          var sku = res.data.data.sku;
          sku.map(function (v, i) {
            if (!v.img) {
              sku[i].img = [];
            } else {
              var temp = v.img.split(',');
              var tempArr = [];
              temp.map(function (vv, ii) {
                tempArr.push(vv);
              });
              sku[i].img = tempArr;
            }
          });
          that.setData({
            info: res.data.data
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
      options: options,
      ping: options.ping === 'ping'
    });
    this.shopProduct(options.id);
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