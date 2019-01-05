// 获取全局应用程序实例对象
const app = getApp()
const COS = require('../cos-js-sdk-v5.min.js')
const config = require('../config')
const bmap = require('../../../../utils/bmap-wx')
const cos = new COS({
  getAuthorization (params, callback) {
    let authorization = COS.getAuthorization({
      SecretId: config.SecretId,
      SecretKey: config.SecretKey,
      Method: params.Method,
      Key: params.Key
    })
    callback(authorization)
  }
})
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userAddress: {
      address: '选择地址定位'
    },
    openType: '',
    tipsArr: [
      {
        t: 'asdf'
      },
      {
        t: '啊撒旦看风景'
      }
    ],
    labelIndex: -1,
    labelArr: ['富力天域', '十年纹绣', 'ID品牌'],
    testImg: app.data.testImg,
    upImgArr: [],
    upImgArrProgress: [],
    upImgArr3: [],
    upImgArrProgress3: [],
    upImgArr4: [],
    upImgArrProgress4: [],
    upImgArr5: [],
    upImgArrProgress5: [],
    upImgArr6: [],
    upImgArrProgress6: [],
    content: 0
  },
  Bmap (that, site) {
    let BMap = new bmap.BMapWX({
      ak: 'RBTsmFCaerZ25VkuGhpSIZa5lyC36BcV'
    })
    BMap.regeocoding({
      location: site || null,
      success (res) {
        that.data.addressInfo = res
      },
      fail (data) {
        console.log('fail', data)
      }
    })
  },
  // 多图上传
  upImg2 (index) {
    let imgArr = 'upImgArr3'
    let progressArr = 'upImgArrProgress3'
    let that = this
    let length = that.data[imgArr].length || 0
    let id = app.gs('userInfoAll').id || 10000
    wx.chooseImage({
      count: index >= 0 ? 1 : 9 - length,
      success (res) {
        for (let [i, v] of res.tempFilePaths.entries()) {
          if (!that.data[imgArr][index >= 0 ? index : length + i]) {
            that.data[imgArr][index >= 0 ? index : length + i] = {
              temp: null,
              real: null
            }
          }
          that.data[imgArr][index >= 0 ? index : length + i]['real'] = ''
          that.data[imgArr][index >= 0 ? index : length + i]['temp'] = v
        }
        that.setData({
          upImgArr3: that.data[imgArr]
        })
        if (index >= 0) {
          cos.deleteObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: that.data[imgArr][index].Key
          })
        }
        (function upLoad (j) {
          let v = res.tempFilePaths[j]
          let Key = `image/${id}/${v.substr(v.lastIndexOf('/') + 1)}` // 这里指定上传的文件名
          cos.postObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: Key,
            FilePath: v,
            onProgress: function (info) {
              that.data[progressArr][index >= 0 ? index : length + j] = info.percent * 100
              that.setData({
                upImgArrProgress3: that.data[progressArr]
              })
            }
          }, (err, data) => {
            if (err) {
              that.data[imgArr][index >= 0 ? index : length + j]['upFail'] = true
              that.setData({
                upImgArr3: that.data[imgArr]
              })
            } else {
              console.log(data)
              that.data[imgArr][index >= 0 ? index : length + j]['real'] = `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/${Key}`
              that.data[imgArr][index >= 0 ? index : length + j]['Key'] = Key
              that.setData({
                upImgArr3: that.data[imgArr]
              })
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1)
          })
        })(0)
      }
    })
  },
  // 图片操作
  imgOperation (e) {
    if (!this.data.upImgArr3[e.currentTarget.dataset.index].real) return app.setToast(this, {content: '请稍后操作'})
    let that = this
    let itemList = ['查看图片', '替换图片', '删除图片']
    for (let v of this.data.upImgArr3) {
      if (!v.real) itemList = ['查看图片', '替换图片']
    }
    wx.showActionSheet({
      itemList,
      success (res) {
        if (res.tapIndex === 0) {
          app.showImg(that.data.upImgArr3[e.currentTarget.dataset.index].temp, [that.data.upImgArr3[e.currentTarget.dataset.index].temp])
        } else if (res.tapIndex === 2) {
          cos.deleteObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: that.data.upImgArr3[e.currentTarget.dataset.index].Key
          }, () => {
            that.data.upImgArr3.splice(e.currentTarget.dataset.index, 1)
            that.setData({
              upImgArr3: that.data.upImgArr3
            })
          })
        } else if (res.tapIndex === 1) {
          that.upImg2(e.currentTarget.dataset.index)
        }
      }
    })
  },
  // 多图上传
  upImg3 (index) {
    let imgArr = 'upImgArr4'
    let progressArr = 'upImgArrProgress4'
    let that = this
    let length = that.data[imgArr].length || 0
    let id = app.gs('userInfoAll').id || 10000
    wx.chooseImage({
      count: index >= 0 ? 1 : 9 - length,
      success (res) {
        for (let [i, v] of res.tempFilePaths.entries()) {
          if (!that.data[imgArr][index >= 0 ? index : length + i]) {
            that.data[imgArr][index >= 0 ? index : length + i] = {
              temp: null,
              real: null
            }
          }
          that.data[imgArr][index >= 0 ? index : length + i]['real'] = ''
          that.data[imgArr][index >= 0 ? index : length + i]['temp'] = v
        }
        that.setData({
          upImgArr4: that.data[imgArr]
        })
        if (index >= 0) {
          cos.deleteObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: that.data[imgArr][index].Key
          })
        }
        (function upLoad (j) {
          let v = res.tempFilePaths[j]
          let Key = `image/${id}/${v.substr(v.lastIndexOf('/') + 1)}` // 这里指定上传的文件名
          cos.postObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: Key,
            FilePath: v,
            onProgress: function (info) {
              that.data[progressArr][index >= 0 ? index : length + j] = info.percent * 100
              that.setData({
                upImgArrProgress4: that.data[progressArr]
              })
            }
          }, (err, data) => {
            if (err) {
              that.data[imgArr][index >= 0 ? index : length + j]['upFail'] = true
              that.setData({
                upImgArr4: that.data[imgArr]
              })
            } else {
              console.log(data)
              that.data[imgArr][index >= 0 ? index : length + j]['real'] = `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/${Key}`
              that.data[imgArr][index >= 0 ? index : length + j]['Key'] = Key
              that.setData({
                upImgArr4: that.data[imgArr]
              })
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1)
          })
        })(0)
      }
    })
  },
  // 图片操作
  imgOperation2 (e) {
    if (!this.data.upImgArr4[e.currentTarget.dataset.index].real) return app.setToast(this, {content: '请稍后操作'})
    let that = this
    let itemList = ['查看图片', '替换图片', '删除图片']
    for (let v of this.data.upImgArr4) {
      if (!v.real) itemList = ['查看图片', '替换图片']
    }
    wx.showActionSheet({
      itemList,
      success (res) {
        if (res.tapIndex === 0) {
          app.showImg(that.data.upImgArr4[e.currentTarget.dataset.index].temp, [that.data.upImgArr4[e.currentTarget.dataset.index].temp])
        } else if (res.tapIndex === 2) {
          cos.deleteObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: that.data.upImgArr4[e.currentTarget.dataset.index].Key
          }, () => {
            that.data.upImgArr4.splice(e.currentTarget.dataset.index, 1)
            that.setData({
              upImgArr4: that.data.upImgArr4
            })
          })
        } else if (res.tapIndex === 1) {
          that.upImg3(e.currentTarget.dataset.index)
        }
      }
    })
  },
  // 多图上传
  upImg4 (index) {
    let imgArr = 'upImgArr5'
    let progressArr = 'upImgArrProgress5'
    let that = this
    let length = that.data[imgArr].length || 0
    let id = app.gs('userInfoAll').id || 10000
    wx.chooseImage({
      count: index >= 0 ? 1 : 9 - length,
      success (res) {
        for (let [i, v] of res.tempFilePaths.entries()) {
          if (!that.data[imgArr][index >= 0 ? index : length + i]) {
            that.data[imgArr][index >= 0 ? index : length + i] = {
              temp: null,
              real: null
            }
          }
          that.data[imgArr][index >= 0 ? index : length + i]['real'] = ''
          that.data[imgArr][index >= 0 ? index : length + i]['temp'] = v
        }
        that.setData({
          upImgArr5: that.data[imgArr]
        })
        if (index >= 0) {
          cos.deleteObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: that.data[imgArr][index].Key
          })
        }
        (function upLoad (j) {
          let v = res.tempFilePaths[j]
          let Key = `image/${id}/${v.substr(v.lastIndexOf('/') + 1)}` // 这里指定上传的文件名
          cos.postObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: Key,
            FilePath: v,
            onProgress: function (info) {
              that.data[progressArr][index >= 0 ? index : length + j] = info.percent * 100
              that.setData({
                upImgArrProgress5: that.data[progressArr]
              })
            }
          }, (err, data) => {
            if (err) {
              that.data[imgArr][index >= 0 ? index : length + j]['upFail'] = true
              that.setData({
                upImgArr5: that.data[imgArr]
              })
            } else {
              console.log(data)
              that.data[imgArr][index >= 0 ? index : length + j]['real'] = `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/${Key}`
              that.data[imgArr][index >= 0 ? index : length + j]['Key'] = Key
              that.setData({
                upImgArr5: that.data[imgArr]
              })
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1)
          })
        })(0)
      }
    })
  },
  // 图片操作
  imgOperation3 (e) {
    if (!this.data.upImgArr5[e.currentTarget.dataset.index].real) return app.setToast(this, {content: '请稍后操作'})
    let that = this
    let itemList = ['查看图片', '替换图片', '删除图片']
    for (let v of this.data.upImgArr5) {
      if (!v.real) itemList = ['查看图片', '替换图片']
    }
    wx.showActionSheet({
      itemList,
      success (res) {
        if (res.tapIndex === 0) {
          app.showImg(that.data.upImgArr5[e.currentTarget.dataset.index].temp, [that.data.upImgArr5[e.currentTarget.dataset.index].temp])
        } else if (res.tapIndex === 2) {
          cos.deleteObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: that.data.upImgArr5[e.currentTarget.dataset.index].Key
          }, () => {
            that.data.upImgArr5.splice(e.currentTarget.dataset.index, 1)
            that.setData({
              upImgArr5: that.data.upImgArr5
            })
          })
        } else if (res.tapIndex === 1) {
          that.upImg4(e.currentTarget.dataset.index)
        }
      }
    })
  },
  // 门店头像上传
  upImg5 () {
    if (this.data.upImgArr6.length >= 1 && !this.data.upImgArr6[0].real) return app.setToast(this, {content: '请等待上传完毕'})
    let index = 0
    let imgArr = 'upImgArr6'
    let progressArr = 'upImgArrProgress6'
    let that = this
    let length = that.data[imgArr].length || 0
    let id = app.gs('userInfoAll').id || 10000
    wx.chooseImage({
      count: 1,
      success (res) {
        for (let [i, v] of res.tempFilePaths.entries()) {
          if (!that.data[imgArr][index >= 0 ? index : length + i]) {
            that.data[imgArr][index >= 0 ? index : length + i] = {
              temp: null,
              real: null
            }
          }
          that.data[imgArr][index >= 0 ? index : length + i]['real'] = ''
          that.data[imgArr][index >= 0 ? index : length + i]['temp'] = v
        }
        that.setData({
          upImgArr6: that.data[imgArr]
        })
        if (index >= 0) {
          cos.deleteObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: that.data[imgArr][index].Key
          })
        }
        (function upLoad (j) {
          let v = res.tempFilePaths[j]
          let Key = `image/${id}/${v.substr(v.lastIndexOf('/') + 1)}` // 这里指定上传的文件名
          cos.postObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: Key,
            FilePath: v,
            onProgress: function (info) {
              that.data[progressArr][index >= 0 ? index : length + j] = info.percent * 100
              that.setData({
                upImgArrProgress6: that.data[progressArr]
              })
            }
          }, (err, data) => {
            if (err) {
              that.data[imgArr][index >= 0 ? index : length + j]['upFail'] = true
              that.setData({
                upImgArr6: that.data[imgArr]
              })
            } else {
              console.log(data)
              that.data[imgArr][index >= 0 ? index : length + j]['real'] = `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/${Key}`
              that.data[imgArr][index >= 0 ? index : length + j]['Key'] = Key
              that.setData({
                upImgArr6: that.data[imgArr]
              })
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1)
          })
        })(0)
      }
    })
  },
  upno () {
    app.setToast(this, {content: '图片上传中，请稍后操作'})
  },
  // 选择地址
  address () {
    let that = this
    wx.getSetting({
      success (res) {
        // 用户未授权
        if (!res.authSetting['scope.userLocation']) {
          console.log(res)
          wx.chooseLocation({
            success (res) {
              that.Bmap(that, `${res.longitude},${res.latitude}`)
            },
            fail (err) {
              console.log(err)
              that.setData({
                openType: 'openSetting'
              })
            }
          })
        } else {
          // 用户已授权
          wx.chooseLocation({
            success (res) {
              that.Bmap(that, `${res.longitude},${res.latitude}`)
              that.setData({
                openType: null,
                userAddress: res
              })
            }
          })
        }
      }
    })
  },
  // 获取设置
  opensetting (e) {
    if (!e.detail.authSetting['scope.userLocation']) {
      this.setData({
        openType: 'openSetting'
      })
    } else {
      this.setData({
        openType: null
      })
    }
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
    let id = app.gs('userInfoAll').id || 10000
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
        if (index >= 0) {
          cos.deleteObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: that.data.upImgArr[index].Key
          })
        }
        (function upLoad (j) {
          let v = res.tempFilePaths[j]
          let Key = `image/${id}/${v.substr(v.lastIndexOf('/') + 1)}` // 这里指定上传的文件名
          cos.postObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: Key,
            FilePath: v,
            onProgress: function (info) {
              that.data.upImgArrProgress[index >= 0 ? index : length + j] = info.percent * 100
              that.setData({
                upImgArrProgress: that.data.upImgArrProgress
              })
            }
          }, (err, data) => {
            if (err) {
              console.error('upLoadErr', err)
              that.data.upImgArr[index >= 0 ? index : length + j]['upFail'] = true
              that.setData({
                upImgArr: that.data.upImgArr
              })
            } else {
              console.log(data)
              that.data.upImgArr[index >= 0 ? index : length + j]['real'] = `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/${Key}`
              that.data.upImgArr[index >= 0 ? index : length + j]['Key'] = Key
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1)
          })
        })(0)
      }
    })
  },

  goRelease (e) {
    let that = this
    if (!that.data.upImgArr6[0].real) return app.setToast(that, {content: '请上传教室头像'})
    else if (!e.detail.value.name) return app.setToast(that, {content: '请填写教室名字'})
    else if (that.data.userAddress.address === '选择地址定位') return app.setToast(that, {content: '请选择教室所处地理位置'})
    let roomImages = []
    let showImage = []
    let roomTeacher = []
    for (let v of that.data.upImgArr3) {
      if (!v.real) return app.setToast(that, {content: '请等待图片上传完成'})
      roomImages.push(v.real)
    }
    if (roomImages.length < 1) return app.setToast(that, {content:'请至少上传一张教室宣传图片'})
    for (let v of that.data.upImgArr5) {
      if (!v.real) return app.setToast(that, {content: '请等待图片上传完成'})
      showImage.push(v.real)
    }
    if (showImage.length < 1) return app.setToast(that, {content:'请至少上传一张学员作品秀'})
    for (let v of that.data.upImgArr4) {
      if (!v.real) return app.setToast(that, {content: '请等待图片上传完成'})
      roomTeacher.push(v.real)
    }
    app.wxrequest({
      url: app.getUrl().teacherDotSub,
      data: {
        id: that.data.id || '',
        avatar: that.data.upImgArr6[0].real,
        user_id: app.gs('userInfoAll').id,
        room_name: e.detail.value.name,
        room_des: e.detail.value.desc || '',
        label_one: e.detail.value.label0 || '富力天域',
        label_two: e.detail.value.label1 || '十年纹绣',
        label_three: e.detail.value.label2 || 'ID品牌',
        room_images: roomImages.join(','),
        show_image: showImage.join(','),
        room_teacher: roomTeacher.join(','),
        code: that.data.addressInfo ? that.data.addressInfo.originalData.result.addressComponent.adcode : that.data.shopInfo.code,
        longitude: that.data.userAddress.longitude,
        latitude: that.data.userAddress.latitude,
        room_address: `${that.data.userAddress.address}${e.detail.value.address || ''}`
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          wx.navigateTo({
            url: `../../coursePage/courseDetail/courseDetail?id=${res.data.data}&type=3`
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  getRoomInfo () {
    let that = this
    app.wxrequest({
      url: app.getUrl().teacherDotDetail,
      data: {
        user_id: app.gs('userInfoAll').id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          if (!res.data.data) return
          that.data.upImgArr6.push({
            temp: res.data.data.avatar,
            real: res.data.data.avatar
          })
          that.data.labelArr[0] = res.data.data.label_one
          that.data.labelArr[1] = res.data.data.label_two
          that.data.labelArr[2] = res.data.data.label_three
          for (let v of res.data.data.room_images.split(',')) {
            that.data.upImgArr3.push({
              temp: v,
              real: v
            })
            that.data.upImgArrProgress3.push(100)
          }
          for (let v of res.data.data.show_image.split(',')) {
            that.data.upImgArr5.push({
              temp: v,
              real: v
            })
            that.data.upImgArrProgress5.push(100)
          }
          if (res.data.data.room_teacher) {
            for (let v of res.data.data.room_teacher.split(',')) {
              that.data.upImgArr4.push({
                temp: v,
                real: v
              })
              that.data.upImgArrProgress4.push(100)
            }
          }
          that.setData({
            shopInfo: res.data.data,
            id: res.data.data.id,
            upImgArrProgress4: that.data.upImgArrProgress4,
            upImgArrProgress3: that.data.upImgArrProgress3,
            upImgArrProgress5: that.data.upImgArrProgress5,
            labelArr: that.data.labelArr,
            upImgArr3: that.data.upImgArr3,
            upImgArr4: that.data.upImgArr4,
            upImgArr5: that.data.upImgArr5,
            upImgArr6: [{
              temp: res.data.data.avatar,
              real: res.data.data.avatar
            }],
            upImgArrProgress6: [100],
            userAddress: {
              address: res.data.data.room_address,
              latitude: res.data.data.latitude,
              longitude: res.data.data.longitude
            }
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      options
    })
    this.getRoomInfo()
    app.setBar(options.type || '教室信息设置')
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
