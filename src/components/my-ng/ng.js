/*eslint-disable */
Component({
  properties: {
    propShow: {
      type: Number,
      observer (newValue, oldValue, changePath) {
        if (newValue > 1) {
          console.log('newValue',newValue)
          this._show()
        }
      }
    }
  },
  options: {
    addGlobalClass: true
  },
  data: {
    show: 2
  },
  ready () {},
  methods: {
    _back () {
      if(getCurrentPages().length >= 2) {
        wx.navigateBack()
      } else {
        wx.reLaunch({
          url: '/pingPage/pingpages/index/index'
        })
      }
    },
    _close () {
      this.setData({
        show: 2
      })
    },
    _show () {
      this.setData({
        show: 1
      })
    }
  },
  pageLifetimes: {
    show () {
      this.setData({
        move: !this.data.move
      })
    },
    hide () {
      this.setData({
        move: !this.data.move
      })
    }
  }
})
