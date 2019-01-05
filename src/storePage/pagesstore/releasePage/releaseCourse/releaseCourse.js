// 获取全局应用程序实例对象
const app = getApp()
const COS = require('../cos-js-sdk-v5.min.js')
const config = require('../config')
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
    courseArr: ['视频课程', '免费线下课程', '驻店课程'],
    labelArr: app.data.label,
    courseIndex: 0,
    labelIndex: 0,
    videoUrl: null,
    upImgArr: [],
    upImgArrProgress: [],
    upImgArr2: [],
    upImgArrProgress2: [],
    upImgArr3: [],
    upImgArrProgress3: [],
    upImgArr4: [],
    upImgArrProgress4: [],
    startDay: app.momentFormat(new Date(), 'YYYY/MM/DD'),
    startDay2: app.momentFormat(app.momentAdd(1, 'd'), 'YYYY/MM/DD'),
    endDay: app.momentFormat(app.momentAdd(3, 'M'), 'YYYY/MM/DD'),
    endDayShould: ''
  },
  inputValue (e) {
    app.inputValue(e, this)
  },
  chooseF (e) {
    if (e.currentTarget.dataset.type === 'course') {
      if (this.data.id) return app.setToast(this, {content: '不可修改课程类型'})
      this.setData({
        courseIndex: e.currentTarget.dataset.index
      })
    } else {
      this.setData({
        labelIndex: e.currentTarget.dataset.index
      })
    }
  },

  upVideo () {
    if (this.data.upText === '上传中' || this.data.upText === '等待上传') return
    let that = this
    this.setData({
      speed: '0KB/s',
      upText: '等待上传'
    })
    let start = new Date().getTime()
    wx.chooseVideo({
      compressed: that.data.compressd,
      success (res) {
        that.setData({
          duration: res.duration,
          videoUrl: res.tempFilePath,
          size: res.size / 1024 > 1024 ? res.size / 1024 / 1024 + 'M' : res.size / 1024 + 'KB'
        })
        let v = res.tempFilePath
        let Key = `video/${app.gs('userInfoAll').id || 10000}/${v.substr(v.lastIndexOf('/') + 1)}`
        console.log(cos)
        // if (that.data.videoUlrR) {
        //   cos.deleteObject({
        //     Bucket: config.Bucket,
        //     Region: config.Region,
        //     Key: that.data.videoUlrR.replace('https://teach-1258261086.cos.ap-guangzhou.myqcloud.com', '')
        //   })
        // }
        cos.postObject({
          Bucket: config.Bucket,
          Region: config.Region,
          Key,
          FilePath: v,
          onProgress: function (info) {
            that.setData({
              percent: info.percent * 100,
              upText: '上传中',
              speed: info.speed / 1024 > 1024 ? (info.speed / 1024 / 1024).toFixed(2) + 'M/s' : (info.speed / 1024).toFixed(2) + 'KB/s'
            })
          }
        }, (err, data) => {
          that.data.time = (new Date().getTime() - start) / 1000
          if (err) {
            console.error('upLoadErr', err)
            that.setData({
              upText: '失败,请上传不超过100M大小的MP4格式视频'
            })
          } else {
            console.log('data', data)
            that.setData({
              upText: '成功',
              videoUlrR: `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/${Key}`
            })
          }
        })
      },
      fail () {
        that.setData({
          upText: '',
          speed: '替换视频'
        })
      }
    })
  },
  upImg (e, index) {
    let imgArr, progressArr
    if (e.currentTarget.dataset.type === 'detail') {
      imgArr = 'upImgArr2'
      progressArr = 'upImgArrProgress2'
    } else {
      imgArr = 'upImgArr'
      progressArr = 'upImgArrProgress'
    }
    if (this.data[imgArr].length > 0) {
      if (this.data[imgArr][0].real) {
        index = 0
      } else {
        return
      }
    }
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
        if (e.currentTarget.dataset.type === 'detail') {
          that.setData({
            upImgArr2: that.data[imgArr]
          })
        } else {
          that.setData({
            upImgArr: that.data[imgArr]
          })
        }
        // if (index >= 0) {
        //   cos.deleteObject({
        //     Bucket: config.Bucket,
        //     Region: config.Region,
        //     Key: that.data[imgArr][index].Key ? that.data[imgArr][index].Key : that.data[imgArr][index].real.replace('https://teach-1258261086.cos.ap-guangzhou.myqcloud.com', '')
        //   })
        // }
        function noUse () {}
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
              if (e.currentTarget.dataset.type === 'detail') {
                that.setData({
                  upImgArrProgress2: that.data[progressArr]
                })
              } else {
                that.setData({
                  upImgArrProgress: that.data[progressArr]
                })
              }
            }
          }, (err, data) => {
            if (err) {
              that.data[imgArr][index >= 0 ? index : length + j]['upFail'] = true
              if (e.currentTarget.dataset.type === 'detail') {
                that.setData({
                  upImgArr2: that.data[imgArr]
                })
              } else {
                that.setData({
                  upImgArr: that.data[imgArr]
                })
              }
            } else {
              console.log(data)
              that.data[imgArr][index >= 0 ? index : length + j]['real'] = `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/${Key}`
              that.data[imgArr][index >= 0 ? index : length + j]['Key'] = Key
              if (e.currentTarget.dataset.type === 'detail') {
                that.setData({
                  upImgArr2: that.data[imgArr]
                })
              } else {
                that.setData({
                  upImgArr: that.data[imgArr]
                })
              }
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1)
          })
        })(0)
      }
    })
  },

  bindDateChange (e) {
    if (e.currentTarget.dataset.type === 'start') {
      this.setData({
        userChooseStart: app.momentFormat(e.detail.value, 'YYYY/MM/DD'),
        startDay2: app.momentFormat(app.momentAdd(1, 'd', e.detail.value), 'YYYY/MM/DD'),
        userChooseEnd: app.momentFormat(app.momentAdd(1, 'd', e.detail.value), 'YYYY/MM/DD'),
        endDay: app.momentFormat(app.momentAdd(3, 'M', e.detail.value), 'YYYY/MM/DD')
      })
      app.setToast(this, {content: '请选择结束日期', image: null})
    } else {
      this.setData({
        userChooseEnd: app.momentFormat(e.detail.value, 'YYYY/MM/DD')
      })
    }
  },
  // 课程详情上传
  upImgDetail (index) {
    let imgArr = 'upImgArr2'
    let progressArr = 'upImgArrProgress2'
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
          upImgArr2: that.data[imgArr]
        })
        // if (index >= 0) {
        //   cos.deleteObject({
        //     Bucket: config.Bucket,
        //     Region: config.Region,
        //     Key: that.data[imgArr][index].Key
        //   })
        // }
        function noUse () {}
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
                upImgArrProgress2: that.data[progressArr],
                courseDetailUp: info.percent * 100 >= 99 ? 0 : 1
              })
            }
          }, (err, data) => {
            if (err) {
              that.data[imgArr][index >= 0 ? index : length + j]['upFail'] = true
              that.setData({
                upImgArr2: that.data[imgArr]
              })
            } else {
              console.log(data)
              that.data[imgArr][index >= 0 ? index : length + j]['real'] = `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/${Key}`
              that.data[imgArr][index >= 0 ? index : length + j]['Key'] = Key
              that.setData({
                upImgArr2: that.data[imgArr]
              })
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1)
          })
        })(0)
      }
    })
  },
  // 课程详情上传图片操作
  courseDetailUpImgOperation (e) {
    if (this.data.courseDetailUp) return app.setToast(this, {content: '图片上传中,请稍后操作'})
    let that = this
    let itemList = ['查看图片', '替换图片', '删除图片']
    for (let v of this.data.upImgArr2) {
      if (!v.real) itemList = ['查看图片', '替换图片']
    }
    wx.showActionSheet({
      itemList,
      success (res) {
        if (res.tapIndex === 0) {
          app.showImg(that.data.upImgArr2[e.currentTarget.dataset.index].temp, [that.data.upImgArr2[e.currentTarget.dataset.index].temp])
        } else if (res.tapIndex === 2) {
          // cos.deleteObject({
          //   Bucket: config.Bucket,
          //   Region: config.Region,
          //   Key: that.data.upImgArr2[e.currentTarget.dataset.index].Key
          // }, () => {
          //
          // })
          that.data.upImgArr2.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            upImgArr2: that.data.upImgArr2
          })
        } else if (res.tapIndex === 1) {
          that.upImgDetail(e.currentTarget.dataset.index)
        }
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
        // if (index >= 0) {
        //   cos.deleteObject({
        //     Bucket: config.Bucket,
        //     Region: config.Region,
        //     Key: that.data[imgArr][index].Key
        //   })
        // }
        function noUse () {}
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
          // cos.deleteObject({
          //   Bucket: config.Bucket,
          //   Region: config.Region,
          //   Key: that.data.upImgArr3[e.currentTarget.dataset.index].Key
          // }, () => {
          //
          // })
          that.data.upImgArr3.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            upImgArr3: that.data.upImgArr3
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
        // if (index >= 0) {
        //   cos.deleteObject({
        //     Bucket: config.Bucket,
        //     Region: config.Region,
        //     Key: that.data[imgArr][index].Key
        //   })
        // }
        function noUse () {}
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
          // cos.deleteObject({
          //   Bucket: config.Bucket,
          //   Region: config.Region,
          //   Key: that.data.upImgArr4[e.currentTarget.dataset.index].Key
          // }, () => {
          //
          // })
          that.data.upImgArr4.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            upImgArr4: that.data.upImgArr4
          })
        } else if (res.tapIndex === 1) {
          that.upImg3(e.currentTarget.dataset.index)
        }
      }
    })
  },

  upno () {
    app.setToast(this, {content: '图片上传中，请稍后操作'})
  },
  goRelease () {
    if (this.data.courseIndex * 1 === 0) {
      this.subOnline()
    } else {
      this.subOffline()
    }
  },
  // 发布线下课程
  subOffline () {
    let that = this
    if (!that.data.nameText) return app.setToast(this, {content: '请填写课程标题'})
    if (!that.data.upImgArr.length) return app.setToast(this, {content: '请上传课程封面'})
    let showImage = []
    let classImage = []
    for (let v of this.data.upImgArr4) {
      classImage.push(v.real)
    }
    if (!classImage.length && that.data.courseIndex * 1 === 2) return app.setToast(this, {content: '请上传至少一张教室环境图片'})
    for (let v of this.data.upImgArr3) {
      showImage.push(v.real)
    }
    if (!showImage.length) return app.setToast(this, {content: '请上传至少一张作品秀图片'})
    app.wxrequest({
      url: app.getUrl().teacherActiveSub,
      data: that.data.courseIndex * 1 === 1 ? {
        id: that.data.id || '',
        user_id: app.gs('userInfoAll').id,
        style: that.data.courseIndex * 2,
        label: that.data.labelArr[that.data.labelIndex].label,
        title: that.data.nameText,
        image: that.data.upImgArr[0].real,
        class_time: '随到随学',
        start_time: that.data.userChooseStart ? (new Date(that.data.userChooseStart).getTime()).toString().slice(0, 10) : (new Date(that.data.startDay).getTime()).toString().slice(0, 10),
        end_time: that.data.userChooseEnd ? (new Date(that.data.userChooseEnd).getTime()).toString().slice(0, 10) : (new Date(that.data.startDay2).getTime()).toString().slice(0, 10),
        show_image: showImage.join(','),
        class_image: ''
      } : {
        id: that.data.id || '',
        user_id: app.gs('userInfoAll').id,
        style: that.data.courseIndex * 2,
        label: that.data.labelArr[that.data.labelIndex].label,
        title: that.data.nameText,
        image: that.data.upImgArr[0].real,
        class_time: '随到随学',
        start_time: that.data.userChooseStart ? (new Date(that.data.userChooseStart).getTime()).toString().slice(0, 10) : (new Date(that.data.startDay).getTime()).toString().slice(0, 10),
        end_time: that.data.userChooseEnd ? (new Date(that.data.userChooseEnd).getTime()).toString().slice(0, 10) : (new Date(that.data.startDay2).getTime()).toString().slice(0, 10),
        show_image: showImage.join(','),
        class_image: classImage.join(',')
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.data.id = res.data.data
          wx.navigateTo({
            url: `../../coursePage/courseDetail2/courseDetail?id=${res.data.data}&type=${that.data.courseIndex * 2}`
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  // 发布线上课程
  subOnline () {
    let that = this
    if (!that.data.videoUlrR) return app.setToast(this, {content: '请上传课程视频'})
    else if (!that.data.upImgArr[0].real) return app.setToast(this, {content: '请上传视频封面图'})
    else if (!that.data.nameText) return app.setToast(this, {content: '请填写视频标题'})
    let detail = []
    for (let v of this.data.upImgArr2) {
      detail.push(v.real)
    }
    app.wxrequest({
      url: app.getUrl().teacherCourseSub,
      data: Object.assign({
        user_id: app.gs('userInfoAll').id,
        title: that.data.nameText,
        label: that.data.labelArr[that.data.labelIndex].label,
        video_url: that.data.videoUlrR,
        image: that.data.upImgArr[0].real,
        detail: detail.join(','),
        is_free: 0,
        video_time: Math.floor(that.data.duration) || 0
      }, that.data.id ? {id: that.data.id} : {}),
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.data.id = res.data.data
          wx.navigateTo({
            url: `../../coursePage/courseDetail2/courseDetail?id=${res.data.data}&type=1`
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  // 线上课程详情
  getDetail () {
    let that = this
    app.wxrequest({
      url: that.data.courseIndex * 1 === 0 ? app.getUrl().courseDetail : app.getUrl().activeDetail,
      data: that.data.courseIndex * 1 === 0 ? {
        course_id: that.data.id,
        user_id: app.gs('userInfoAll').id
      } : {
        active_id: that.data.id,
        user_id: app.gs('userInfoAll').id
      },
      success (res) {
        wx.hideLoading()
        let s = res.data.data
        // 封面
        if (s.image) {
          that.data.upImgArr.push({
            temp: s.image,
            real: s.image
          })
        }
        // 详情
        if (s.detail) {
          for (let v of s.detail.split(',')) {
            that.data.upImgArr2.push({
              temp: v,
              real: v
            })
          }
        }
        if (s.show_image) {
          for (let v of s.show_image.split(',')) {
            that.data.upImgArr3.push({
              temp: v,
              real: v
            })
            that.data.upImgArrProgress3.push(100)
          }
        }
        if (s.class_image) {
          for (let v of s.class_image.split(',')) {
            that.data.upImgArr4.push({
              temp: v,
              real: v
            })
            that.data.upImgArrProgress4.push(100)
          }
        }
        that.setData({
          userChooseStart: app.momentFormat(s.start_time * 1000, 'YYYY/MM/DD'),
          userChooseEnd: app.momentFormat(s.end_time * 1000, 'YYYY/MM/DD'),
          endDay: app.momentFormat(app.momentAdd(3, 'M', s.start_time * 1000), 'YYYY/MM/DD'),
          labelIndex: s.label - 1,
          videoUrl: s.video_url,
          upText: '成功',
          videoUlrR: s.video_url,
          nameText: s.title,
          upImgArr: that.data.upImgArr,
          upImgArr2: that.data.upImgArr2,
          upImgArr3: that.data.upImgArr3,
          upImgArrProgress3: that.data.upImgArrProgress3,
          upImgArr4: that.data.upImgArr4,
          upImgArrProgress4: that.data.upImgArrProgress4
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    if (options.id) {
      this.data.id = options.id
      this.setData({
        courseIndex: options.courseIndex
      }, this.getDetail)
    }
    app.setBar('发布课程')
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
