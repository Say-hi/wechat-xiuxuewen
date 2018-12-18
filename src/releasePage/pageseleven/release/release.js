/*eslint-disable*/

// 获取全局应用程序实例对象
const app = getApp()
let change = true
let Key = null
const COS = require('./cos-js-sdk-v5.min')
const config = require('./config')
var cos = new COS({
  getAuthorization: function (params, callback) {//获取签名 必填参数

    // 方法一（推荐）服务器提供计算签名的接口
    /*
     wx.request({
     url: 'SIGN_SERVER_URL',
     data: {
     Method: params.Method,
     Key: params.Key
     },
     dataType: 'text',
     success: function (result) {
     callback(result.data);
     }
     });
     */

    // 方法二（适用于前端调试）
    var authorization = COS.getAuthorization({
      SecretId: config.SecretId,
      SecretKey: config.SecretKey,
      Method: params.Method,
      Key: params.Key
    });
    callback(authorization);
  }
});

var requestCallback = function (err, data) {
  console.log(Key)
  var url = cos.getObjectUrl({
    Key
  });
  console.log(url)
  if (err && err.error) {
    wx.showModal({title: '返回错误', content: '请求失败：' + err.error.Message + '；状态码：' + err.statusCode, showCancel: false});
  } else if (err) {
    wx.showModal({title: '请求出错', content: '请求出错：' + err + '；状态码：' + err.statusCode, showCancel: false});
  } else {
    wx.showToast({title: '请求成功', icon: 'success', duration: 3000});
  }
};

var option = {
  data: {
    list: [],
  },
};

option.simpleUpload = function () {
  // 选择文件
  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      var filePath = res.tempFilePaths[0]
      var Key = 'image/' + filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名

      cos.postObject({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: Key,
        FilePath: filePath,
        onProgress: function (info) {
          console.log(JSON.stringify(info));
        }
      }, requestCallback);
    }
  })
};
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tipsArr: [
      {
        t: 'asdf'
      },
      {
        t: '啊撒旦看风景'
      }
    ],
    testImg: app.data.testImg,
    upImgArr: [],
    upImgArrProgress: [],
    content: 0
  },
  inputValue (e) {
    this.setData({
      content: e.detail.value
    })
  },
  chooseTip (e) {
    this.data.tipsArr[e.currentTarget.dataset.index]['choose'] = !this.data.tipsArr[e.currentTarget.dataset.index]['choose']
    this.setData({
      tipsArr: this.data.tipsArr
    })
  },
  // 上传图片
  wxUploadImg (index = -1) {
    let that = this
    let length = that.data.upImgArr.length || 0
    wx.chooseImage({
      count: index >= 0 ? 1 : 9 - length,
      success (res) {
        for (let [i, v] of res.tempFilePaths.entries()) {
          if (!that.data.upImgArr[index >= 0 ? index : length + i]) {
            that.data.upImgArr[index >= 0 ? index : length + i] = {
              temp: null,
              real: null
            }
          }
          that.data.upImgArr[index >= 0 ? index : length + i]['real'] = ''
          that.data.upImgArr[index >= 0 ? index : length + i]['temp'] = v
        }
        that.setData({
          upImgArr: that.data.upImgArr
        })
        if(index) {}
        (function upLoad (j) {
          let v = res.tempFilePaths[j]
          const task = wx.uploadFile({
            url: app.getUrl().upImage,
            filePath: v,
            name: 'file',
            formData: {
              id: app.gs('userInfoAll').id || 10000,
              file: v
            },
            success (res2) {
              that.data.upImgArr[index >= 0 ? index : length + j].real = JSON.parse(res2.data).data
              if (j + 1 >= res.tempFilePaths.length) {}
              else { upLoad(j + 1) }
            }
          })
          task.onProgressUpdate(res => {
            that.data.upImgArrProgress[index >= 0 ? index : length + j] = res.progress
            console.log(res.progress)
            that.setData({
              upImgArrProgress: that.data.upImgArrProgress
            })
          })
        })(0)
      }
    })
  },
  // 图片操作
  imgOperation (e) {
    if (!this.data.upImgArr[e.currentTarget.dataset.index].real) return app.setToast(this, {content: '请稍后操作'})
    let that = this
    let itemList = ['查看图片', '替换图片', '删除图片']
    for (let v of this.data.upImgArr) {
      if (!v.real) itemList = ['查看图片', '替换图片']
    }
    wx.showActionSheet({
      itemList,
      success (res) {
        if (res.tapIndex === 0) {
          app.showImg(that.data.upImgArr[e.currentTarget.dataset.index].temp, [that.data.upImgArr[e.currentTarget.dataset.index].temp])
        } else if (res.tapIndex === 2) {
          that.data.upImgArr.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            upImgArr: that.data.upImgArr
          })
        } else if (res.tapIndex === 1) {
          that.wxUploadImg(e.currentTarget.dataset.index)
        }
      }
    })
  },

  testUP () {
    option.simpleUpload()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options
    })
    app.setBar(options.type || '发布问题')
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
