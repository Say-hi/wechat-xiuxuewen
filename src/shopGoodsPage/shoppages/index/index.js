// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectAll: -1, // -2 全选中
    page: 0,
    list: [],
    all_Screen: app.data.all_screen,
    tabIndex: 0
  },
  goEdit (e) {
    wx.navigateTo({
      url: this.data.list[e.currentTarget.dataset.index].parent_id * 1 === 0 ? `/releasePage/pageseleven/index/index?id=${this.data.list[e.currentTarget.dataset.index].id}` : `/shopEditPage/shoppages/index/index?id=${this.data.list[e.currentTarget.dataset.index].id}&type=edit`
    })
  },
  tabChoose (e) {
    this.data.list = []
    this.data.page = 0
    this.setData({
      tabIndex: e.currentTarget.dataset.index * 1
    }, this.setBar)
  },
  del () {
    let newList = []
    for (let v of this.data.list) {
      if (!v['choose']) newList.push(v)
    }
    this.setData({
      list: newList
    })
  },
  choose (e) {
    if (e.currentTarget.dataset.index < 0) this.checkAll()
    let that = this
    let str = `list[${e.currentTarget.dataset.index}].choose`
    this.setData({
      [str]: !that.data.list[e.currentTarget.dataset.index].choose
    }, that.checkAll)
  },
  checkAll (e) {
    let that = this
    if (e) {
      for (let v of this.data.list) {
        v['choose'] = this.data.selectAll === -1
      }
      this.data.selectAll = this.data.selectAll === -1 ? -2 : -1
    } else {
      this.data.selectAll = -2
      for (let v of this.data.list) {
        if (!v['choose']) this.data.selectAll = -1
      }
    }
    this.setData({
      list: that.data.list,
      selectAll: that.data.selectAll
    })
  },
  shopO (e) {
    let that = this
    let products = []
    let temp = []
    if (e.currentTarget.dataset.index >= 0) {
      products.push({pid: that.data.list[e.currentTarget.dataset.index].id})
      that.data.list.splice(e.currentTarget.dataset.index, 1)
      temp = that.data.list
    } else {
      for (let v of that.data.list) {
        if (v['choose']) products.push({pid: v.id})
        else temp.push(v)
      }
    }
    app.wxrequest({
      url: app.getUrl().shopDeal,
      data: {
        mid: app.gs('shopInfoAll').id,
        products: JSON.stringify(products),
        state: e.currentTarget.dataset.type === 'del' ? 3 : e.currentTarget.dataset.type === 'down' ? 2 : 1
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          wx.showToast({
            title: '操作成功'
          })
          that.setData({
            list: temp
          }, that.checkAll)
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
  upFormId (e) {
    app.upFormId(e)
  },
  getGoods () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopSale,
      data: {
        mid: app.gs('shopInfoAll').id,
        state: this.data.tabIndex * 1 + 1,
        page: ++that.data.page
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          for (let v of res.data.data.lists) {
            v.create_time = app.momentFormat(v.create_time * 1000, 'MM月DD日 HH:mm')
            v.update_time = app.momentFormat(v.update_time * 1000, 'YYYY.MM.DD HH:mm:ss')
            v['stock'] = 0
            for (let s of v.sku) {
              v['stock'] += s.stock * 1
            }
          }
          that.setData({
            list: that.data.list.concat(res.data.data.lists) || [],
            more: res.data.data.pre_page > res.data.data.lists.length ? 0 : 1
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  setBar () {
    if (this.data.tabIndex === 0) app.setBar('出售中的商品')
    else if (this.data.tabIndex === 1) app.setBar('仓库中的商品')
    else if (this.data.tabIndex === 2) app.setBar('库存紧张的商品')
    this.getGoods()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      tabIndex: options.type * 1
    }, this.setBar)

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
    if (this.data.more > 0) this.getGoods()
    else app.setToast(this, {content: '没有更多内容啦'})
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    this.data.page = 0
    this.data.list = []
    this.getGoods()
    // TODO: onPullDownRefresh
  }
})
