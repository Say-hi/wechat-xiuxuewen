// const wechat = require('./utils/wechat')
// const Promise = require('./utils/bluebird')
/*eslint-disable*/
const useUrl = require('./utils/service')
const wxParse = require('./wxParse/wxParse')

const statusBarHeight = wx.getSystemInfoSync().statusBarHeight

const MenuButtonBounding = wx.getMenuButtonBoundingClientRect()
const HEIGHT_TOP = MenuButtonBounding.bottom - statusBarHeight
console.log(MenuButtonBounding)
console.log(HEIGHT_TOP)
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
// moment.locale('zh-cn')
App({
  data: {
    searchText: null,
    bottomTabIndex: 0,
    statusBarHeight,
    HEIGHT_TOP,
    MenuButtonBounding,
    ALL_HEIGHT: statusBarHeight + HEIGHT_TOP,
    name: '绣学问小程序',
    label: [
      {
        t: '纹眉',
        label: 1
      },
      {
        t: '眼线',
        label: 2
      },
      {
        t: '纹唇',
        label: 3
      },
      {
        t: '其他',
        label: 4
      },
    ],
    baseDomain: 'https://rtx.24sky.cn',
    testImg: 'https://c.jiangwenqiang.com/api/logo.jpg',
    reservation_bg: 'https://c.jiangwenqiang.com/workProject/payKnowledge/reservation_bg.png',
    imgDomain: 'https://rtx.24sky.cn'
  },
  momentAdd (number, type, time) {
    if (time) {
      return Moment(time).add(number, type)
    } else {
      return  Moment().add(number, type)
    }
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
  // 富文本解析
  WP (title, type, data, that, image) {
    wxParse.wxParse(title, type, data, that, image)
  },
  // 解析时间
  moment (time) {
    return Moment(time).fromNow()
  },
  // 发起微信支付
  wxpay (obj) {
    console.log(obj)
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
        console.log(res)
        wx.showLoading({
          title: '图片上传中'
        })
        for (let v of res.tempFilePaths) {
          wx.uploadFile({
            url: useUrl.upImage,
            filePath: v,
            name: 'file',
            formData: {
              id: _that.gs('userInfoAll').id || 1,
              file: v
            },
            success (res) {
              console.log(res)
              wx.hideLoading()
              let parseData = JSON.parse(res.data)
              console.log(parseData)
              // if (parseData.code === 1) {
              //   if (cb) {
              //     cb(parseData.data, v)
              //   }
              // }
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
    // let that = this
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
  wxlogin (params) {
    let that = this
    wx.login({
      success (res) {
        let code = res.code
        // 获取用户信息
        let obj = {
          success (data) {
            wx.setStorageSync('userInfo', data.userInfo)
            let objs = {
              url: useUrl.login,
              data: {
                code,
                nickname: data.userInfo.nickName,
                avatar_url: data.userInfo.avatarUrl,
                sex: data.userInfo.gender,
                city: data.userInfo.city,
                country: data.userInfo.country,
                province: data.userInfo.province
              },
              success (session) {
                console.log('session', session)
                wx.hideLoading()
                wx.setStorageSync('key', session.data.data.openid)
                wx.setStorageSync('userInfoAll', Object.assign(that.gs('userInfoAll') ? that.gs('userInfoAll') : {}, {id: session.data.data.id}))
                let currentPage = getCurrentPages()
                let query = ''
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
          fail (err) {
            console.log(err)
            let objs = {
              url: useUrl.login,
              data: {
                code
              },
              success (session) {
                console.log('session', session)
                wx.hideLoading()
                wx.setStorageSync('key', session.data.data.openid)
                wx.setStorageSync('userInfoAll', Object.assign(that.gs('userInfoAll') ? that.gs('userInfoAll') : {}, {id: session.data.data.id}))
                let currentPage = getCurrentPages()
                let query = ''
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
          }
        }
        that.getUserInfo(obj)
      },
      fail (err) {
          console.log('loginError' + err)
        }
    })
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
  // 输入内容
  inputValue (e, that, cb) {
    let value = e.detail.value
    let type = e.currentTarget.dataset.type
    if (type === 'teacher') {
      that.setData({
        teacherText: value
      })
    } else if (type === 'name') {
      that.setData({
        nameText: value // 姓名
      })
    } else if (type === 'phone') {
      that.setData({
        phoneText: value // 手机号码
      })
    } else if (type === 'brand') {
      that.setData({
        brandText: value // 品牌
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
  // 手机号码验证
  checkMobile (mobile) {
    if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(mobile))) {
      return true
    }
  },
  // 信息弹窗
  setToast (that, toast, time) {
    let defaultToast = {
      image: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/background/jiong.png',
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
  // 预览图片
  showImg (src, imgArr) {
    wx.previewImage({
      current: src,
      urls: imgArr
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
  // 获取小程序状态栏内容
  getNavTab ({style = 1, cb = null}) {
    let that = this
    this.wxrequest({
      url: that.getUrl().style,
      data: {
        style
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          if (style === 1) {
            that.su('bottomNav', res.data.data)
            // 底部导航
            // for (let [i, v] of res.data.data.entries()) {
            //   wx.setTabBarItem({
            //     index: i,
            //     text: v.title,
            //     iconPath: v.icon,
            //     selectedIconPath: v.select_icon
            //   })
            // }
          } else {
            if (cb && typeof cb === 'function') {
              cb (res)
            }
          }
        } else {
          console.log('err', res)
        }
      }
    })
  },
  // 地址计算
  distance (lat1, lng1, lat2, lng2) {
    let lat = [lat1, lat2]
    let lng = [lng1, lng2]
    let R = 6378137
    let dLat = (lat[1] - lat[0]) * Math.PI / 180
    let dLng = (lng[1] - lng[0]) * Math.PI / 180
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat[0] * Math.PI / 180) * Math.cos(lat[1] * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    let d = R * c
    return Math.round(d)
  },
  userCollect (is_collect, collect_id, state) {
    let that = this
    return new Promise (function (resolve, reject) {
      that.wxrequest({
        url: is_collect >= 1 ? useUrl.userCollectCancel : useUrl.userCollectSub,
        data: {
          user_id: that.gs('userInfoAll').id,
          collect_id,
          state
        },
        success (res) {
          wx.hideLoading()
          if (res.data.status === 200) {
            resolve(res)
          } else {
            reject(res)
          }
        },
        fail (err) {
          reject(err)
        }
      })
    })
  },
  /**
   * 生命周期函数--监听小程序初始化
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch () {
    this.getNavTab({})
    this.su('userInfoAll', {id:1, nickname: 'Edward'})
    // this.su('userInfoAll', {id:2, nickname: 'Edward2'})
    // this.getFont()
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
