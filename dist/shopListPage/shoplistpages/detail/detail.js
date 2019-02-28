'use strict';

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    labelIndex: 0,
    specifi: [{
      t: 'color',
      chooses: [{
        t: '可可棕',
        id: 1
      }, {
        t: '可可棕',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }]
    }, {
      t: 'color',
      chooses: [{
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }]
    }, {
      t: 'color',
      chooses: [{
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }]
    }, {
      t: 'color',
      chooses: [{
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }, {
        t: 'adsf',
        id: 1
      }]
    }]
  },
  goSubmit: function goSubmit() {
    wx.navigateTo({
      url: '../submit/submit'
    });
  },
  buy: function buy(e) {
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

  // chooseSp (e) {
  //   let that = this
  //   let {oindex, index} = e.currentTarget.dataset
  //   for (let v of that.data.specifi[oindex].chooses) {
  //     v['choose'] = false
  //   }
  //   that.data.specifi[oindex].chooses[index]['choose'] = true
  //   let setStr = `specifi[${oindex}]`
  //   this.setData({
  //     [setStr]: that.data.specifi[oindex]
  //   })
  // },
  chooseSp: function chooseSp(e) {
    this.setData({
      labelIndex: e.currentTarget.dataset.index
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
    return {
      title: '\u5411\u60A8\u63A8\u8350\u5E97\u94FA\u3010' + app.gs('shopInfoAll').name + '\u3011',
      imageUrl: '' + (app.gs('shopInfoAll').avatar || ''),
      path: '/shopPage/shoppages/index/index?mid=' + app.gs('shopInfoAll').id
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function onLoad(options) {
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
//# sourceMappingURL=detail.js.map
