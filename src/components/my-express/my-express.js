// components/component-tag-name.js
const app = getApp()
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    propObj: {
      type: Object,
      value: {
        num: 123123,
        id: 1
      },
      observer (newValue, oldValue, changePath) {
        if (newValue) {
          this._showScroll(newValue)
        }
      }
    }
  },
  data: {

  },
  methods: {
    _showScroll () {
      this.setData({
        showS: !this.data.showS
      })
    }
  }
})
