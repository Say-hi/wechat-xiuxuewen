/*eslint-disable*/
const useUrl = require('./utils/service')
const wxParse = require('./wxParse/wxParse')
const statusBarHeight = wx.getSystemInfoSync().statusBarHeight
const MenuButtonBounding = wx.getMenuButtonBoundingClientRect()
const HEIGHT_TOP = MenuButtonBounding.bottom - statusBarHeight
const Moment = require('./utils/moment-min')
const cloud = require('./utils/cloud')
Moment.updateLocale('en', {
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
App({
  data: {
    all_screen: (wx.getSystemInfoSync().model).indexOf('X') >= 0,
    TOP_CENTER: (MenuButtonBounding.right - 66),
    searchText: null,
    bottomTabIndex: 0,
    statusBarHeight,
    HEIGHT_TOP,
    MenuButtonBounding,
    ALL_HEIGHT: statusBarHeight + HEIGHT_TOP,
    name: '绣学问小程序',
    label: [],
    testImg: 'https://c.jiangwenqiang.com/api/logo.jpg',
    reservation_bg: 'https://c.jiangwenqiang.com/workProject/payKnowledge/reservation_bg.png',
  },
  noUse () {},
  cloud () {
    return cloud
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
  wxpay2 (obj) {
    return new Promise((resolve, reject) => {
      wx.requestPayment({
        timeStamp: obj.timeStamp,
        nonceStr: obj.nonceStr,
        package: obj.package,
        signType: obj.signType || 'MD5',
        paySign: obj.paySign,
        success (payRes) {
          if (payRes.errMsg === 'requestPayment:ok') {
            resolve(payRes)
          } else {
            reject(payRes)
          }
        },
        fail (err) {
          reject(err)
        },
        complete: obj.complete || function () {}
      })
    })
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
    wx.showLoading({
      title: '请求数据中...',
      mask: true
    })
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
        console.log('url', obj.url)
        console.log('data', obj.data)
        console.log('complete', res)
        wx.stopPullDownRefresh()
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
  upFormId (e) {
    let that = this
    this.wxrequest({
      url: that.getUrl().formid,
      data: {
        openid: that.gs(),
        formid: e.detail.formId
      },
      success () {
        wx.hideLoading()
      }
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
              data: params ? {
                parent_id: params,
                code,
                nickname: data.userInfo.nickName,
                avatar_url: data.userInfo.avatarUrl,
                sex: data.userInfo.gender,
                city: data.userInfo.city,
                country: data.userInfo.country,
                province: data.userInfo.province
              } : {
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
                that.wxrequest({
                  url: that.getUrl().userInfo,
                  data: {
                    user_id: session.data.data.id
                  },
                  success (res) {
                    wx.hideLoading()
                    if (res.data.status === 200) {
                      that.su('userInfoAll', res.data.data)
                      if (params) {
                        getCurrentPages()[getCurrentPages().length - 1].setData({
                          is_teacher: res.data.data.is_teach
                        })
                        return
                      }
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
                })
              }
            }
            that.wxrequest(objs)
          },
          fail (err) {
            console.warn('getUserInfo', err)
            let objs = {
              url: useUrl.login,
              data: params ? {
                code,
                parent_id: params
              } : {
                code
              },
              success (session) {
                console.log('session', session)
                wx.hideLoading()
                wx.setStorageSync('key', session.data.data.openid)
                that.wxrequest({
                  url: that.getUrl().userInfo,
                  data: {
                    user_id: session.data.data.id
                  },
                  success (res) {
                    wx.hideLoading()
                    if (res.data.status === 200) {
                      that.su('userInfoAll', res.data.data)
                      if (params) {
                        getCurrentPages()[getCurrentPages().length - 1].setData({
                          is_teacher: res.data.data.is_teach
                        })
                      }
                    }
                  }
                })
                if (params) return
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
          console.warn('loginError' + err)
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
  videoCount (vid) {
    this.wxrequest({
      url: this.getUrl().shopVideoIncrease,
      data: {
        vid
      },
      complete () {
        wx.hideLoading()
      }
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
  userCollect (is_collect, collect_id, obj_user_id, state) {
    let that = this
    return new Promise (function (resolve, reject) {
      that.wxrequest({
        url: is_collect ? useUrl.userCollectCancel : useUrl.userCollectSub,
        data: {
          user_id: that.gs('userInfoAll').id,
          obj_user_id,
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
  getEnum () {
    let that = this
    this.wxrequest({
      url: that.getUrl().enum,
      data: {},
      success (res) {
        if (res.data.status === 200) {
          that.data.label = res.data.data.label
        }
      }
    })
  },
  getShareText () {
    let that = this
    cloud.getShareText()
      .then(res => {
        that.su('shareText', res.result)
      })
  },
  onLaunch () {
    this.getNavTab({})
    this.getEnum()
    setTimeout(() => {
      this.getShareText()
    }, 500)
  },
  onShow () {},
  onPageNotFound () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  onHide () {
    this.su('first', 1)
  }
})
