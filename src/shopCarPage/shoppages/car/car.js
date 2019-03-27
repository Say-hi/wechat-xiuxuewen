// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    systemVersion: app.data.systemVersion,
    selectAll: -1, // -2 全选中
    totalMoney: 0,
    totalCount: 0,
    all_screen: app.data.all_screen,
    discount_name: app.gs('shopInfoAll').discount_name,
    discount_value: app.gs('shopInfoAll').discount_value
  },
  getCar () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopCartList,
      data: {
        uid: app.gs('userInfoAll').id
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          let noMean = []
          let list = []
          for (let v of res.data.data) {
            if (v.count * 1 > v.stock) v.count = v.stock
            if (v.is_unchange * 1 !== 1) {
              noMean.push(v)
            } else {
              v.price = (1 * v.price).toFixed(2)
              list.push(v)
            }
          }
          that.setData({
            list,
            noMean
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  del () {
    let newList = []
    this.data.del = []
    for (let v of this.data.list) {
      if (!v['choose']) newList.push(v)
      else this.data.del.push({id: v.id})
    }
    this.setData({
      list: newList
    }, this.delCar)
  },
  delCar () {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopCartDelete,
      data: {
        uid: app.gs('userInfoAll').id,
        cart_id: JSON.stringify(that.data.del)
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.data.del = []
        } else {
          app.setToast(that, {content: res.data.desc})
          that.getCar()
        }
      }
    })
  },
  delOne (e) {
    this.data.del = [{id: this.data.noMean[e.currentTarget.dataset.index].id}]
    this.data.noMean.splice(e.currentTarget.dataset.index, 1)
    this.delCar()
    this.setData({
      noMean: this.data.noMean
    })
  },
  edit () {
    for (let v of this.data.list) {
      v['choose'] = false
    }
    this.setData({
      list: this.data.list,
      selectAll: -1,
      del: !this.data.del,
      totalMoney: 0,
      totalCount: 0
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
  numOperation (e) {
    let that = this
    let type = e.currentTarget.dataset.type
    let before = that.data.list[e.currentTarget.dataset.index].count
    if (type === 'add') {
      if (that.data.list[e.currentTarget.dataset.index].count * 1 >= that.data.list[e.currentTarget.dataset.index].stock) return app.setToast(that, {content: '没有更多的库存啦'})
      ++that.data.list[e.currentTarget.dataset.index].count
    } else {
      if (that.data.list[e.currentTarget.dataset.index].count <= 1) return
      --that.data.list[e.currentTarget.dataset.index].count
      if (that.data.list[e.currentTarget.dataset.index].count > that.data.list[e.currentTarget.dataset.index].stock) that.data.list[e.currentTarget.dataset.index].count = that.data.list[e.currentTarget.dataset.index].stock
    }
    this.changeCount(e, before)
    // this.setData({
    //   [str]: that.data.list[e.currentTarget.dataset.index].count
    // }, that.calculate)
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
    }, that.calculate)
  },
  calculate () {
    let totalMoney = 0
    let totalCount = 0
    for (let v of this.data.list) {
      if (v['choose']) {
        totalMoney += v.price * v.count
        totalCount += v.count * 1
      }
    }
    this.setData({
      totalMoney: (totalMoney).toFixed(2),
      totalCount
    })
  },
  submit () {
    let temp = []
    for (let v of this.data.list) {
      if (v['choose']) temp.push(v)
    }
    app.su('buyInfo', temp)
    wx.navigateTo({
      url: '/shopListPage/shoplistpages/submit/submit?type=car'
    })
  },
  changeCount (e, before) {
    let that = this
    let str = `list[${e.currentTarget.dataset.index}].count`
    app.wxrequest({
      url: app.getUrl().shopCartChange,
      data: {
        cid: that.data.list[e.currentTarget.dataset.index].id,
        uid: app.gs('userInfoAll').id,
        count: that.data.list[e.currentTarget.dataset.index].count
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.setData({
            [str]: that.data.list[e.currentTarget.dataset.index].count
          }, that.calculate)
        } else {
          that.data.list[e.currentTarget.dataset.index].count = before
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {

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
    this.setData({
      selectAll: -1,
      totalMoney: 0,
      totalCount: 0
    })
    this.getCar()
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
