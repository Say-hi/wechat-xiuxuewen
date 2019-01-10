/*eslint-disable */
const app = getApp()
Component({
  data: {},
  ready () {},
  lifetimes: {
    attached() {
      if (app.gs('first') >= 1) {
        return this.setData({
          noshow: true
        })
      }
      setTimeout(() => {
        this.setData({
          show: true
        })
      }, 200)
      // 在组件实例进入页面节点树时执行
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
