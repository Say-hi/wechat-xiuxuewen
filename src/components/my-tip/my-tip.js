// components/component-tag-name.js
const app = getApp()
const dsType = {
  'video': 2,
  'answer': 0,
  'article': 1,
  'dynamic': 3,
  'qun': 4,
  'comment': 5
}
Component({
  externalClasses: ['mask', 'mask-in'],
  properties: {
    propUser: {
      type: Object,
      value: {
        user_id: '默认用户',
        obj_id: -1,
        type: 'video',
        index: -1
      },
      observer (newValue, oldValue, changePath) {
        this._showMask(newValue, oldValue, changePath)
      }
    }
  },
  data: {
    imgDomain: app.data.imgDomain,
    naozai: 'https://c.jiangwenqiang.com/workProject/payKnowledge/naozai.png',
    currentIndex: -1,
    numArr: ['2', '5', '10', '20', '50', '100']
  },
  methods: {
    _choosePay (e) {
      this.setData({
        currentIndex: e.currentTarget.dataset.index,
        userInputValue: this.data.numArr[e.currentTarget.dataset.index]
      })
    },
    _formSubmit (e) {
      // 0：答案；1：文章；2：视频；3：动态
      let { money } = e.detail.value
      let that = this
      app.wxrequest({
        url: app.getUrl().reward,
        data: {
          key: app.gs(),
          integral: money,
          type: dsType[that.data.propUser.type],
          obj_id: that.data.propUser.obj_id
        },
        success (res) {
          wx.hideLoading()
          if (res.data.code === 1) {
            wx.showToast({
              title: '感谢打赏'
            })
            that._close(money || 0)
          } else {
            wx.showToast({
              title: '积分不足'
            })
          }
        }
      })
    },
    _closeT () {
      this._close(0)
    },
    _close (integral) {
      this.setData({
        show: false,
        userInputValue: null,
        currentIndex: -1
      }, this.triggerEvent('ds', {index: this.data.propUser.index, integral: integral}))
    },
    _getUserInfo (newValue) {
      let that = this
      app.wxrequest({
        url: app.getUrl().info,
        data: {
          key: app.gs(),
          user_id: newValue.user_id
        },
        success (res) {
          wx.hideLoading()
          if (res.data.code === 1) {
            that.setData({
              show: true,
              userInfo: res.data.data
            })
          } else {
            wx.showToast({
              title: res.data.msg
            })
            console.warn('错误信息:', res.data.msg)
          }
        }
      })
    },
    _showMask (newValue, oldValue, changePath) {
      // console.log(newValue)
      // let that = this
      if (!newValue) {
        this.setData({
          show: false
        })
      } else {
        this._getUserInfo(newValue)
      }
    }
  }
})
