/*eslint-disable */
Component({
  properties: {},
  options: {
    addGlobalClass: true
  },
  data: {},
  ready () {},
  methods: {},
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
