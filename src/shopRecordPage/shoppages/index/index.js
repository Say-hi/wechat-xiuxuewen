// 获取全局应用程序实例对象
const app = getApp()
let needtime = false
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    tabIndex: 0,
    star_date: `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`,
    end_date: `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`,
    tabArr: [
      '全部收益',
      '今日收益',
      '已到账收益',
      '待到账收益'
    ],
    directArr: ['', '直属上级', '间接上级', '商店收入'],
    page: 0
  },
  pickerChoose (e) {
    this.setData({
      [e.currentTarget.dataset.type]: e.detail.value.replace(/-/g, '/')
    })
  },
  timeChoose (e) {
    if (e.currentTarget.dataset.type === 'confirm') {
      if (new Date(this.data.end_date).getTime() < new Date(this.data.star_date)) return app.setToast(this, {content: '开始时间不能大于结束时间'})
      needtime = true
      this.data.page = 0
      this.data.list = []
      this.profitDetail()
    } else {
      needtime = false
      return this.setData({
        star_date: `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`,
        end_date: `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
      })
    }
    this.showTimeChoose()
  },
  showTimeChoose () {
    this.setData({
      timeshow: !this.data.timeshow
    })
  },
  chooseTab (e) {
    this.data.page = 0
    this.data.list = []
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    }, this.profitDetail)
  },
  inputvalue (e) {
    this.data.page = 0
    this.data.list = []
    this.data.inputtext = e.detail.value
    this.profitDetail()
  },
  getList () {
    let that = this
    app.wxrequest({
      url: app.getUrl()[that.data.type === 'withdraw' ? 'shopUserRecord' : 'shopUserInDetail'],
      data: {
        uid: app.gs('userInfoAll').id,
        page: ++this.data.page
      },
      success (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        if (res.data.status === 200) {
          for (let v of res.data.data.lists) {
            v['create_time'] = app.momentFormat(v.create_time * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
          that.setData({
            list: that.data.list.concat(res.data.data.lists),
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  onShareAppMessage () {
    if (!app.gs('shopInfo').mid) {
      return {
        title: app.gs('shareText').t || '绣学问，真纹绣',
        path: `/pages/index/index`,
        imageUrl: app.gs('shareText').g
      }
    } else {
      return {
        title: `向您推荐店铺【${app.gs('shopInfoAll').name}】`,
        imageUrl: `${app.gs('shopInfoAll').avatar || ''}`,
        path: `/shopPage/shoppages/index/index?mid=${app.gs('shopInfoAll').id}&user=${app.gs('userInfoAll').id}`
      }
    }
  },
  profitDetail () {
    let that = this
     app.wxrequest({
       url: app.getUrl().profitDetail,
       data: {
         uid: app.gs('userInfoAll').id,
         where: that.data.tabIndex * 1 + 1,
         out_trade_no: that.data.inputtext || '',
         time_start: needtime ? new Date(that.data.star_date).getTime() / 1000 : '',
         time_end: needtime ? new Date(that.data.end_date).getTime() / 1000 : '',
         page: ++that.data.page
       },
       success (res) {
         wx.hideLoading()
         if (res.data.status === 200) {
           for (let v of res.data.data.lists) {
             v['create_time'] = app.momentFormat(v.create_time * 1000, 'YYYY-MM-DD HH:mm:ss')
           }
           that.setData({
             list: that.data.list.concat(res.data.data.lists),
             more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
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
      type: options.type,
      tabIndex: options.index
    }, this.profitDetail)
    app.setBar(options.type === 'withdraw' ? '提现记录' : '收益明细')
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
  onReachBottom () {
    if (this.data.more > 0) this.profitDetail()
    else app.setToast(this, {content: '没有更多内容啦'})
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    this.data.page = 0
    this.data.list = []
    this.profitDetail()
    // TODO: onPullDownRefresh
  }
})
