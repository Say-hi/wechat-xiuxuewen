// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectAll: -1, // -2 全选中
    totalMoney: 0,
    totalCount: 0,
    img: app.data.testImg,
    list: [
      {
        num: 1,
        price: '22.00',
        image: app.data.testImg,
        title: '我是视频标题我是视频标题我是视频标题'
      },
      {
        num: 1,
        price: '222.00',
        image: app.data.testImg,
        title: '我是视频标题'
      },
      {
        num: 1,
        price: '22.00',
        image: app.data.testImg,
        title: '我是视频标题我是视频标题我是视频标题'
      },
      {
        num: 1,
        price: '222.00',
        image: app.data.testImg,
        title: '我是视频标题'
      },
      {
        num: 1,
        price: '22.00',
        image: app.data.testImg,
        title: '我是视频标题我是视频标题我是视频标题'
      },
      {
        num: 1,
        price: '222.00',
        image: app.data.testImg,
        title: '我是视频标题'
      }
    ]
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
    let str = `list[${e.currentTarget.dataset.index}].num`
    if (type === 'add') {
      ++that.data.list[e.currentTarget.dataset.index].num
    } else {
      if (that.data.list[e.currentTarget.dataset.index].num <= 1) return
      --that.data.list[e.currentTarget.dataset.index].num
    }
    this.setData({
      [str]: that.data.list[e.currentTarget.dataset.index].num
    }, that.calculate)
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
        totalMoney += v.price * v.num
        totalCount += v.num * 1
      }
    }
    this.setData({
      totalMoney,
      totalCount
    })
  },
  submit () {
    wx.navigateTo({
      url: '/shopListPage/shoplistpages/submit/submit'
    })
  },
  noUse () {
    app.noUse()
  },
  playVideo (e) {
    let that = this
    this.setData({
      play: !that.data.play,
      playIndex: e.currentTarget.dataset.index
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
        path: `/shopPage/shoppages/index/index?mid=${app.gs('shopInfoAll').id}`
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
