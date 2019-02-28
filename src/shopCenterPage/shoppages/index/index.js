// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: app.data.testImg,
    goodslabel: ['色乳类', '色乳类', '色乳类', '色乳类', '色乳类', '色乳类', '色乳类色乳类色乳类色乳类']
  },
  upGoods (e) {
    if (e.currentTarget.dataset.type === 'now') {
      wx.showModal({
        title: '上传确认',
        content: '是否确认上传此商品',
        success (res) {
          if (res.confirm) {
            wx.showModal({
              title: '上传方式',
              content: '请选择您的上传方式',
              confirmText: '编辑上传',
              cancelText: '直接上传',
              success (res2) {
                if (res2.confirm) {

                } else if (res.cancel) {

                }
              }
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '放入仓库',
        content: '是否确认将此商品放入仓库',
        success (res) {
          if (res.confirm) {

          }
        }
      })
    }
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
