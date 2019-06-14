// 获取全局应用程序实例对象
const app = getApp()
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    lists: [
      {
        t: '你说什么这里是第一行啊',
        y: 0,
        s: 0
      },
      {
        t: 'asdf是第2行啊',
        y: 40,
        s: 1
      },
      {
        t: '123123是第3行啊',
        y: 80,
        s: 2
      },
      {
        t: 'zzzzzzzzz这里是第4行啊',
        y: 120,
        s: 3
      },
      {
        t: 'aaaaa这里是5啊',
        y: 160,
        s: 4
      }
    ],
    step: 40,
    move_index: -1,
    Y: -1
  },
  tap () {
    console.log('tap')
  },
  start (e) {
    this.setData({
      animation: true,
      move_index: this.data.lists[e.currentTarget.dataset.index].s * 1
    })
    this.data.Y = this.data.lists[e.currentTarget.dataset.index].s * 1
  },
  movechange (e) {
    if (e.detail.source === 'touch') {
      let change = Math.floor(e.detail.y / this.data.step)
      if (this.data.Y === change) return
      for (let [i, v] of this.data.lists.entries()) {
        if (v.s === change) {
          let temp2 = this.data.lists[this.data.move_index].y
          this.data.lists[this.data.move_index].y = this.data.lists[i].y
          this.setData({
            [`lists[${i}].y`]: temp2
          })
          let temp = this.data.lists[i].s
          this.data.lists[i].s = this.data.lists[this.data.move_index].s
          this.data.lists[this.data.move_index].s = temp
          this.data.Y = change
          return
        }
      }
    }
  },
  end () {
    this.setData({
      animation: false
    })
    let that = this
    this.data.Y = -1
    let s = that.data.lists.sort((a, b) => { return a.y - b.y })
    for (let [i, v] of s.entries()) {
      v.s = i
    }
    this.setData({
      lists: s,
      move_index: -1
    })
  },
  longpress (e) {
    this.setData({
      long_index: e.currentTarget.dataset.index,
      long_mask: true
    })
  },
  btnChoose (e) {
    if (!e.detail.value.tx) return app.setToast(this, {content: '请输入内容'})
    if (e.detail.target.dataset.type === 'confirm') {
      this.setData({
        [`lists[${this.data.long_index}].t`]: e.detail.value.tx
      })
    }
    this.setData({
      long_mask: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
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
  }
})
