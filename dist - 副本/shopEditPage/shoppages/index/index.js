'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 获取全局应用程序实例对象
var app = getApp();
var UpLoad = require('../upLoad');
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sale: 1
  },
  blurinput: function blurinput(e) {
    var index = e.currentTarget.dataset.index;
    if (index < 0) {
      this.setData(_defineProperty({}, 'info.freight', (e.detail.value * 1).toFixed(2)));
    } else {
      var str = 'info.sku[' + e.currentTarget.dataset.index + '].' + (e.currentTarget.dataset.type === 'price' ? 'price' : 'stock');
      this.setData(_defineProperty({}, str, (e.detail.value * 1).toFixed(e.currentTarget.dataset.type === 'price' ? 2 : 0)));
    }
  },
  back: function back() {
    wx.navigateBack();
  },
  chooseSale: function chooseSale(e) {
    this.setData({
      sale: e.currentTarget.dataset.type
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
          try {
            var sku = res.data.data.sku;
            sku.map(function (v, i) {
              if (!v.img) {
                sku[i].img = [];
              } else {
                var temp = v.img.split(',');
                var tempArr = [];
                temp.map(function (vv, ii) {
                  tempArr.push({
                    temp: vv,
                    key: vv,
                    real: vv,
                    progress: 100
                  });
                });
                sku[i].img = tempArr;
              }
            });
          } catch (err) {
            console.log(err);
          }
          that.setData({
            info: res.data.data
          });
        } else {
          app.setToast(that, { content: res.data.desc });
        }
      }
    });
  },
  release: function release() {
    var info = this.data.info;
    var that = this;
    var SKUS = info.sku;
    info.sku.map(function (v, index) {
      var temp = [];
      if (!v.img.length) temp.push(info.img);
      v.img.map(function (s, y) {
        if (s.progress < 98) return app.setToast(that, { content: '\u8BF7\u7B49\u5F85\u3010' + (v.value <= -1 ? '统一规格' : v.value) + '\u3011\u5206\u7C7B\u7684\u56FE\u7247\u4E0A\u4F20\u5B8C\u6210' });
        temp.push(s.real);
      });
      SKUS[index].img = temp.join(',');
    });
    app.wxrequest({
      url: app.getUrl().shopEdit,
      data: {
        pid: info.id,
        cid: info.cid,
        imgs: info.imgs,
        mid: app.gs('shopInfoAll').id,
        parent_id: info.mid * 1 === 0 ? info.parent_id * 1 === 0 ? info.id : info.parent_id : 0,
        title: info.title,
        img: info.img,
        // old_price: info.old_price,
        old_price: info.sku[0].price,
        freight: info.freight,
        is_up: that.data.sale === 1 ? 1 : -1,
        label: info.label,
        sku: JSON.stringify(SKUS)
      },
      success: function success(res2) {
        wx.hideLoading();
        if (res2.data.status === 200) {
          wx.showToast({
            title: '添加成功'
          });
          wx.navigateBack();
        } else {
          app.setToast(that, { content: res2.data.desc });
        }
      }
    });
  },
  addItemImg: function addItemImg(e) {
    new UpLoad({ count: 3, this: this, imgArr: e.currentTarget.dataset.index }).chooseImage();
  },

  // 修改规格图片
  changeItemImg: function changeItemImg(e) {
    new UpLoad({ count: 3, this: this, imgArr: e.currentTarget.dataset.oindex, index: e.currentTarget.dataset.index }).imgOp();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
    this.data.options = options;
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