// const wechat = require('./utils/wechat')
// const Promise = require('./utils/bluebird')
/*eslint-disable*/
const useUrl = require('./utils/service')
const wxParse = require('./wxParse/wxParse')
const zanType = {
  'video': 3,
  'answer': 2,
  'article': 1,
  'column': 0,
  'qun': 4,
  'comment': 5
}
const upCommentType = {
  'video': 1,
  'answer': 3,
  'article': 0,
  'column': 0,
  'qun': 2,
  'comment': 5
}
// const bgMusic = wx.getBackgroundAudioManager()
// const updateManager = wx.getUpdateManager()
//
// updateManager.onCheckForUpdate(function (res) {
//   // 请求完新版本信息的回调
//   console.log(res.hasUpdate)
// })
//
// updateManager.onUpdateReady(function () {
//   // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
//   updateManager.applyUpdate()
// })
// updateManager.onUpdateFailed(function () {
//   // 新的版本下载失败
// })
// const QQMapWX = require('./utils/qmapsdk')
// const qqmapsdkkey = '5YBBZ-LHYWP-NVGD6-LHZB3-GTWYK-TQBRO'
// let qqmapsdk
// type 0：文章；1：视频；2：社群；3：问答；
// progress 0：未开始；1：报名中；2：结束
const Moment = require('./utils/moment')
Moment.locale('en', {
  relativeTime : {
    future: '%s',
    past: '%s前',
    s:  '刚刚',
    m:  '1分钟',
    mm: '%d分钟',
    h:  '1小时',
    hh: '%d小时',
    d:  '1天',
    dd: '%d天',
    M:  '1个月',
    MM: '%d月',
    y:  '1年',
    yy: '%d年'
  }
})
// bindload="wxParseImgLoad"
// moment.locale('zh-cn')
App({
  data: {
    name: '脑籽知识商城',
    baseDomain: 'https://rtx.24sky.cn',
    // baseDomain: 'https://www.1688rm.com',
    testImg: 'https://c.jiangwenqiang.com/api/logo.jpg',
    reservation_bg: 'https://c.jiangwenqiang.com/workProject/payKnowledge/reservation_bg.png',
    imgDomain: 'https://rtx.24sky.cn'
    // imgDomain: 'https://www.1688rm.com'
  },
  setComponentsData (that, e) {
    that.setData({
      componentsData: {
        user_id: e.currentTarget.dataset.userid,
        obj_id: e.currentTarget.dataset.id,
        type: e.currentTarget.dataset.type,
        index: e.currentTarget.dataset.index
      }
    })
  },
  moment (time) {
    return Moment(time, 'YYYYMMDD HH:mm:ss').fromNow()
  },
  momentDay (time) {
    return Moment().day(time)
  },
  momentFormat (time, formatStr) {
    return Moment(time).format(formatStr)
  },
  call (phoneNumber = '13378692079') {
    wx.makePhoneCall({
      phoneNumber
    })
  },
  getSelf (_this) {
    let that = this
    this.wxrequest({
      url: 'https://c.jiangwenqiang.com/api/payKonwledge.json',
      method: 'GET',
      data: {},
      success (res) {
        wx.hideLoading()
        that.WP('notDel', 'html', res.data[0].content, _this, 5)
        _this.setData({
          FuckU: res.data[0]
        })
      }
    })
  },
  // 获取消息数目
  gML (that) {
    let _that = that
    let _this = this
    _this.wxrequest({
      url: useUrl.getUserMessageLists,
      data: {
        session_key: _this.gs(),
        page: 1,
        date_time: (new Date().getFullYear() + '-' + ((new Date().getMonth() * 1 + 1) < 10 ? '0' + (new Date().getMonth() * 1 + 1) : (new Date().getMonth() * 1 + 1)) + '-' + ((new Date().getDate() * 1) < 10 ? '0' + (new Date().getDate()) : (new Date().getDate())))
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 200) {
          let count = 0
          for (let v of res.data.data) {
            if (parseInt(v.is_look) === 0) {
              count++
            }
          }
          _that.setData({
            messageCount: count
          })
        } else {
          _this.setToast(that, {content: res.data.message})
        }
      }
    })
  },
  // 富文本解析
  WP (title, type, data, that, image) {
    wxParse.wxParse(title, type, data, that, image)
  },
  // 解析时间
  moment (time) {
    return Moment(time, 'YYYYMMDD HH:mm:ss').fromNow()
  },
  // 发起微信支付
  wxpay (obj) {
    let objs = {
      timeStamp: obj.timeStamp,
      nonceStr: obj.nonceStr,
      package: obj.package,
      signType: obj.signType || 'MD5',
      paySign: obj.paySign,
      success: function (payRes) {
        if (obj.success) {
          if (payRes.errMsg === 'requestPayment:ok') {
            obj.success(payRes)
          } else {
            obj.fail(payRes)
          }
        } else {
          console.log('未传入success回调函数', payRes)
        }
      },
      fail: function (err) {
        if (obj.fail) {
          obj.fail(err)
        } else {
          console.log('未传入fail回调函数,err:', err.errMsg)
        }
      },
      complete: obj.complete || function () {}
    }
    wx.requestPayment(objs)
  },
  // 下载内容获取临时路径
  downLoad (url) {
    return new Promise ((resolve, reject) => {
      wx.downloadFile({
        url,
        success (res) {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath)
          } else {
            resolve(0)
          }
        }
      })
    })
  },
  // 选择图片上传
  wxUploadImg (cb, count = 1) {
    let _that = this
    wx.chooseImage({
      count,
      success (res) {
        wx.showLoading({
          title: '图片上传中'
        })
        for (let v of res.tempFilePaths) {
          wx.uploadFile({
            url: useUrl.upload,
            filePath: v,
            name: 'file',
            formData: {
              key: _that.gs(),
              file: 'file'
            },
            success (res) {
              // console.log(res)
              wx.hideLoading()
              let parseData = JSON.parse(res.data)
              if (parseData.code === 1) {
                if (cb) {
                  cb(parseData.data, v)
                }
              }
            }
          })
        }
      }
    })
  },
  // 上传媒体文件
  wxUpload (obj) {
    let s = {
      url: obj.url,
      filePath: obj.filePath,
      name: obj.name || 'file',
      header: {
        'content-type' : 'multipart/form-data'
      },
      formData: obj.formData,
      success: obj.success || function (res) {
        console.log('未传入成功回调函数', res)
      },
      fail: obj.fail || function (res) {
        console.log('为传入失败回调函数', res)
      },
      complete: obj.complete || function () {}
    }
    wx.uploadFile(s)
  },
  setNav () {
    let that = this
    let navArr = this.gs('navArr')
    let currentPage = getCurrentPages()
    let currentPath = currentPage[currentPage.length - 1]['__route__'].replace('pages', '..')
    for (let v of navArr) {
      if (v.path === currentPath) {
        v['active'] = true
        that.setBar(v.title)
        break
      }
    }
    return navArr
  },
  // 请求数据
  wxrequest (obj) {
    let that = this
    wx.showLoading({
      title: '请求数据中...',
      mask: true
    })
    // console.log('obj', obj)
    // if (!obj.data.iv) {
    //   obj.data = Object.assign(obj.data, {session_key: that.gs()})
    // }
    wx.request({
      url: obj.url || useUrl.login,
      method: obj.method || 'POST',
      data: obj.data || {},
      header: {
        'content-type': obj.header || 'application/x-www-form-urlencoded'
      },
      success: obj.success || function () {
        console.log('未传入success回调函数')
      },
      fail: obj.fail || function (err) {
        console.log('未传入fail回调函数,err:' + err.errMsg)
      },
      complete: obj.complete || function (res) {
        wx.stopPullDownRefresh()
        // console.log(res)
        // sessionId 失效
      //   if (res.data.status === 401) {
      //     setTimeout(() => {
      //       if (!that.gs()) {
      //         let page = getCurrentPages()
      //         wx.login({
      //           success (res) {
      //             if (res.code) {
      //               wx.getUserInfo({
      //                 lang: 'zh_CN',
      //                 success (res2) {
      //                   let {iv, encryptedData, rawData, signature} = res2
      //                   that.wxrequest({
      //                     url: useUrl.login,
      //                     data: {
      //                       code: res.code,
      //                       iv,
      //                       encryptedData,
      //                       rawData,
      //                       signature
      //                     },
      //                     success (res3) {
      //                       console.log(1)
      //                       wx.setStorageSync('session_key', res3.data.data.session_key)
      //                       page[(page.length - 1) >= 0 ? (page.length - 1) : 0].onLoad(page[(page.length - 1) >= 0 ? (page.length - 1) : 0].options)
      //                     }
      //                   })
      //                 },
      //                 fail (err) {
      //                   wx.showToast({
      //                     title: '用户拒绝授权'
      //                   })
      //                 }
      //               })
      //             } else {
      //               wx.showToast({
      //                 title: '请删除小程序后，重新打开并授权'
      //               })
      //             }
      //           }
      //         })
      //       } else {
      //         wx.login({
      //           success (res) {
      //             if (res.code) {
      //               wx.getUserInfo({
      //                 lang: 'zh_CN',
      //                 success (res2) {
      //                   let {iv, encryptedData, rawData, signature} = res2
      //                   that.wxrequest({
      //                     url: useUrl.login,
      //                     data: {
      //                       code: res.code,
      //                       iv,
      //                       encryptedData,
      //                       rawData,
      //                       signature
      //                     },
      //                     success (res3) {
      //                       console.log(2)
      //                       wx.setStorageSync('session_key', res3.data.data.session_key)
      //                       obj.data.session_key = that.gs()
      //                       that.wxrequest(obj)
      //                     }
      //                   })
      //                 },
      //                 fail (err) {
      //                   wx.showToast({
      //                     title: '用户拒绝授权'
      //                   })
      //                 }
      //               })
      //             } else {
      //               wx.showToast({
      //                 title: '请删除小程序后，重新打开并授权'
      //               })
      //             }
      //           }
      //         })
      //       }
      //     }, 300)
      //   }
      }
    })
  },
  goOther (e) {
    if (!e.currentTarget.dataset.url) {
      wx.previewImage({
        urls: [e.currentTarget.dataset.src]
      })
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  // 用户登陆
  wxlogin (loginSuccess, params) {
    // console.log('loginSuccess', loginSuccess)
    // console.log('params', params)
    let that = this
    // if (wx.getStorageSync('session_key')) {
    //   // console.log(1)
    //   let checkObj = {
    //     url: useUrl.carList,
    //     data: {
    //       session_key: wx.getStorageSync('session_key')
    //     },
    //     success (res) {
    //       wx.hideLoading()
    //       // session失效
    //       if (res.data.status === 401) {
    //         console.log('session_key失效')
    //         // 无条件获取登陆code
    //         wx.login({
    //           success (res) {
    //             // console.log(res)
    //             let code = res.code
    //             // 获取用户信息
    //             let obj = {
    //               success (data) {
    //                 wx.setStorageSync('userInfo', data.userInfo)
    //                 let {iv, encryptedData, rawData, signature} = data
    //                 let recommendId = ''
    //                 if (params) {
    //                   recommendId: params.id
    //                 }
    //                 // 获取session_key
    //                 let objs = {
    //                   url: useUrl.login,
    //                   data: {
    //                     parent_openid: recommendId || 0,
    //                     code: code,
    //                     iv: iv,
    //                     rawData,
    //                     signature,
    //                     encryptedData
    //                   },
    //                   success (res) {
    //                     console.log(objs.data)
    //                     // let session_key = 'akljgaajgoehageajnafe'
    //                     // console.log(res)
    //                     wx.setStorageSync('session_key', res.data.data.session_key)
    //                     // console.log(session)
    //                     if (loginSuccess) {
    //                       loginSuccess(params)
    //                     }
    //                   }
    //                 }
    //                 that.wxrequest(objs)
    //               },
    //               fail (res) {
    //                 console.log(res)
    //                 wx.showToast({
    //                   title: '您未授权小程序,请授权登陆'
    //                 })
    //               }
    //             }
    //             that.getUserInfo(obj)
    //           },
    //           fail (err) {
    //             console.log('loginError' + err)
    //           }
    //         })
    //       } else {
    //         console.log('session_key有效')
    //         if (loginSuccess) {
    //           loginSuccess(params)
    //         }
    //       }
    //     }
    //   }
    //   that.wxrequest(checkObj)
    // } else {
      // console.log(2)
      // 无条件获取登陆code
      wx.login({
        success (res) {
          let code = res.code
          // 获取用户信息
          let obj = {
            success (data) {
              // console.log('getuserinfo', data)
              if (!data.iv) return
              // console.log('goto')
              wx.setStorageSync('userInfo', data.userInfo)
              // let {iv, encryptedData, rawData, signature} = data
              // let iv = data.iv
              // let encryptedData = data.encryptedData
              // let recommendId = ''
              // console.log('params', params)
              // if (params) {
              //   recommendId = params.id
              // }
              // console.log('recommendId', recommendId)
              // 获取session_key
              let objs = {
                url: useUrl.login,
                data: {
                  code,
                  username: data.userInfo.nickName,
                  avatar: data.userInfo.avatarUrl,
                  sex: data.userInfo.gender
                },
                success (session) {
                  console.log('session', session)
                  // console.log(objs.data)
                  wx.hideLoading()
                  // let s = 'DUGufWMOkMIolSIXLajTvCEvXAYQZwSpnafUVlSagdNEReVSRDAECzwEVAtFbPWg'
                  wx.setStorageSync('key', session.data.data.key)
                  let currentPage = getCurrentPages()
                  let query = ''
                  console.log('currentPage', currentPage)
                  try {
                    let s = currentPage[currentPage.length - 1].options
                    for (let i in s) {
                      query += `${i}=${s[i]}&`
                    }
                  } catch (err) {
                    query = currentPage[currentPage.length - 1]['__displayReporter']['showOptions']['query']
                  }
                  console.log('query', query)
                  wx.reLaunch({
                    url: '/' + currentPage[currentPage.length - 1]['__route__'] + (query.length > 0 ? '?' + query : '')
                  })
                }
              }
              that.wxrequest(objs)
            },
            fail () {
              wx.showToast({
                title: '您未授权小程序,请授权登陆'
              })
            }
          }
          that.getUserInfo(obj)
        },
        fail (err) {
          console.log('loginError' + err)
        }
      })
    // }
  },
  // 获取缓存session_key
  gs (key) {
    return wx.getStorageSync(key || 'key')
  },
  // 设置页面是否加载
  setMore (params, that) {
    if (params.length === 0) {
      that.setData({
        more: false
      })
    } else {
      that.setData({
        more: true
      })
    }
  },
  // 获取用户信息
  getUserInfo (obj) {
    wx.getUserInfo({
      withCredentials: obj.withCredentials || true,
      lang: obj.lang || 'zh_CN',
      success: obj.success || function (res) {
        console.log('getUserInfoSuccess', res)
      },
      fail: obj.fail || function (res) {
        console.log('getUserInfoFail', res)
      }
    })
  },
  // 获取用户缓存信息
  gu (cb) {
    if(wx.getStorageSync('userInfo')) {
      return wx.getStorageSync('userInfo')
    } else {
      let obj = {
        success (res) {
          // console.log(res)
          wx.setStorageSync('userInfo', res.userInfo)
          if (cb) {
            cb()
          }
        }
      }
      return this.getUserInfo(obj)
    }
  },
  // 设置用户的缓存信息
  su (key, obj) {
    wx.setStorageSync(key, obj)
  },
  upComment (_that, id, type, cb) {
    if (!_that.data.pwd) return this.setToast(_that, {content: '请输入您的评论'})
    let that = this
    this.wxrequest({
      url: that.getUrl().operationComment,
      data: {
        key: that.gs(),
        type: upCommentType[type],
        obj_id: id,
        content: _that.data.pwd
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          if (cb) {
            cb(res)
          }
        } else {
          app.setToast(_that, {content: res.data.msg})
        }
      }
    })
  },
  // 获取消息数量
  getMessageCount (that) {
    let self = this
    let _this = that
    let gmc = {
      url: useUrl.getNotReadMessage,
      data: {
        session_key: self.gs()
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          _this.setData({
            mCount: res.data.data.count
          })
        }
      }
    }
    this.wxrequest(gmc)
  },
  // 输入内容
  inputValue (e, that, cb) {
    let value = e.detail.value
    let type = e.currentTarget.dataset.type
    if (type === 'loginInput') {
      that.setData({
        loginInput: value // 登录输入
      })
    } else if (type === 'pwd') {
      that.setData({
        pwd: value // 密码输入
      })
      if (cb) {
        cb(that)
      }
    } else if (type === 'money') {
      that.setData({
        money: value
      })
      if (cb) {
        cb(that)
      }
    } else if (type === 'name') {
      that.setData({
        name: value // 姓名
      })
    } else if (type === 'phone') {
      that.setData({
        phone: value // 手机号码
      })
    } else if (type === 'idCard') {
      that.setData({
        idCard: value // 身份证号码
      })
    } else if (type === 'contentTwo') {
      that.setData({
        contentTwo: value // 翻译
      })
    } else if (type === 'buddingText') {
      that.setData({
        buddingText: value // 我要配音
      })
    } else if (type === 'content') {
      that.setData({
        content: value
      })
    } else if (type === 'contentOne') {
      that.setData({
        contentOne: value
      })
    } else if (type === 'userNote') {
      that.setData({
        userNote: value
      })
    }
  },
  // 跳转绘本详情
  goHBdetail (e) {
    wx.navigateTo({
      url: `../hbDetail/hbDetail?id=${e.currentTarget.dataset.id}&title=${e.currentTarget.dataset.title}`
    })
  },
  // 手机号码验证
  checkMobile (mobile) {
    if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(mobile))) {
      return true
    }
  },
  // 信息弹窗
  setToast (that, toast, time) {
    let defaultToast = {
      image: '../../images/jiong.png',
      show: true,
      bgc: '#fff',
      color: '#000',
      content: '服务器开小差啦~~'
    }
    Object.assign(defaultToast, toast)
    that.setData({
      toast: defaultToast
    })
    setTimeout(() => {
      defaultToast.show = false
      that.setData({
        toast: defaultToast
      })
    }, (time || 1500))
  },
  // 设置公众号弹窗
  setGzh (that, gzh) {
    let defaultToast = {
      image: '../../images/gzh.png',
      name: '群消息',
      show: true
    }
    Object.assign(defaultToast, gzh)
    wx.setClipboardData({
      data: defaultToast.name
    })
    that.setData({
      gzh: defaultToast
    })
  },
  // 关闭公众号弹窗
  closeGzh (that) {
    that.data.gzh.show = false
    that.setData({
      gzh: that.data.gzh
    })
  },
  // 预览图片
  showImg (src, imgArr) {
    wx.previewImage({
      current: src,
      urls: imgArr
    })
  },
  goComment (e, arr, that) {
    this.su('commentInfo', that.data[arr][e.currentTarget.dataset.index])
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  // 跳转方式判断
  gn (url) {
    if (getCurrentPages().length >= 5) {
      wx.redirectTo({
        url
      })
    } else {
      wx.navigateTo({
        url
      })
    }
  },
  // 设置顶部文字
  setBar (text) {
    wx.setNavigationBarTitle({
      title: text
    })
  },
  // 逆地址解析
  getLocation (that, type, cb) {
    this.reverseGeocoder(that, type, cb)
  },
  // 获取请求路劲
  getUrl () {
    return useUrl
  },
  // 跳转搜索
  search (type, content) {
    wx.navigateTo({
      url: `../heightBudding/heightBudding?type=${type}&content=${content}`
    })
  },
  // 逆地址解析执行
  // reverseGeocoder (that, type = true, cb) {
  //   let _that = this
  //   qqmapsdk = new QQMapWX({
  //     key: qqmapsdkkey
  //   })
  //   console.log(type)
  //   let obj = {
  //     success (res) {
  //       if (cb) {
  //         cb(res)
  //       }
  //       that.setData({
  //         address: res.result.address,
  //         location: res.result.location
  //       })
  //     },
  //     fail (res) {
  //       if (!type) {
  //         return wx.showToast({
  //           title: '未选择获取地址位置'
  //         })
  //       }
  //       wx.showToast({
  //         title: '请授权后再次点击'
  //       })
  //       setTimeout(function () {
  //         let settingObj = {
  //           success (res) {
  //             // 授权失败
  //             if (!res.authSetting['scope.userLocation']) {
  //               wx.showToast({
  //                 title: '请允许获取您的地理位置信息',
  //                 mask: true
  //               })
  //               setTimeout(function () {
  //                 return _that.reverseGeocoder(that, cb)
  //               }, 1000)
  //             } else {
  //               // 授权成功
  //               return _that.reverseGeocoder(that, cb)
  //             }
  //           },
  //           fail (res) {
  //             console.log(res)
  //           }
  //         }
  //         wx.openSetting(settingObj)
  //       }, 1000)
  //     }
  //   }
  //   qqmapsdk.reverseGeocoder(obj)
  // },
  getFont () {
    let that = this
    wx.loadFontFace({
      family: 'jwq',
      source: 'url("https://at.alicdn.com/t/font_718305_0nntgpn0yem.ttf")',
      success (res) {
        console.log(res)
        console.log(res.status) //  loaded
      },
      fail (res) {
        that.loadFont()
        console.log(res.status) //  error
      }
    })
  },
  dianzan (e, dataList, _that) {
    let that = this
    that.wxrequest({
      url: that.getUrl().like,
      data: {
        obj_id: e.currentTarget.dataset.id,
        key: that.gs(),
        type: zanType[e.currentTarget.dataset.type] // 0：专栏；1：文章；2：回答；3：视频；4：社群；5评论
      },
      success (res) {
        wx.hideLoading()
        if (res.data.code === 1) {
          if (e.currentTarget.dataset.index * 1 === -1) {
            _that.data[dataList].like = _that.data[dataList].is_like * 1 === 1 ? --_that.data[dataList].like : ++_that.data[dataList].like
            _that.data[dataList].is_like = _that.data[dataList].is_like * 1 === 1 ? 0 : 1
          } else {
            _that.data[dataList][e.currentTarget.dataset.index].like = _that.data[dataList][e.currentTarget.dataset.index].is_like * 1 === 1 ? --_that.data[dataList][e.currentTarget.dataset.index].like : ++_that.data[dataList][e.currentTarget.dataset.index].like
            _that.data[dataList][e.currentTarget.dataset.index].is_like = _that.data[dataList][e.currentTarget.dataset.index].is_like * 1 === 1 ? 0 : 1
          }
          let setdata = {}
          setdata[dataList] = _that.data[dataList]
          _that.setData(setdata)
        } else {
          that.setToast(_that, {content: res.data.msg})
        }
      }
    })
  },
  /**
   * 生命周期函数--监听小程序初始化
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch () {
    this.getFont()
  },
  /**
   * 生命周期函数--监听小程序显示
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow () {
    // console.log(' ========== Application is showed ========== ')
  },
  /**
   * 生命周期函数--监听小程序隐藏
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide () {
    // console.log(' ========== Application is hid ========== ')
  }
})
