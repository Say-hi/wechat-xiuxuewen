// 获取全局应用程序实例对象
const app = getApp()
// const WxCharts = require('../../utils/wxcharts')
// let lineChart = null
// let chartData = {
//   main: {
//     title: '学习课程数',
//     data: [0.30, 0.37, 0.65, 0.78, 0.69, 0.94, 0.94],
//     categories: ['10.21', '10.21', '20.13', '20.14', '20.15', '20.16', '20.17']
//   }
// }
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testImg: app.data.testImg,
    operationArr: [
      {
        t: '我的预约',
        src: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/background/user_1.png',
        url: '/collectPage/pagesten/collect/collect?type=1'
      },
      {
        t: '收藏',
        src: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/background/user_2.png',
        url: '/collectPage/pagesten/collect/collect?type=2'
        // url: '../nearlearn/nearlearn?type=我的收藏'
      },
      {
        t: '意见反馈',
        src: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/background/user_3.png',
        // url: '../showXiu/showXiu'
        url: '/feedbackPage/pagesfour/feedback/feedback'
      },
      {
        t: '课程订单',
        src: 'https://teach-1258261086.cos.ap-guangzhou.myqcloud.com/image/admin/background/user_4.png',
        url: '/orderPage/pagesfive/order/order'
      }
      // {
      //   t: '收藏',
      //   src: app.data.testImg,
      //   url: '../nearlearn/nearlearn?type=我的收藏'
      // },
      // {
      //   t: '意见反馈',
      //   url: '/feedbackPage/pagesfour/feedback/feedback',
      //   src: app.data.testImg
      // },
      // {
      //   t: '教师入口',
      //   url: '/teacherPage/pageseight/teacherAnswer/teacherAnswer',
      //   src: app.data.testImg
      // }
    ]
  },
  // setCanvas () {
  //   this.getAllRects()
//   },
//   getAllRects () {
//     let that = this
//     wx.createSelectorQuery().select('#usercanva').boundingClientRect(function (rect) {
//       console.log(rect)
//       that.setChartData(that, rect.width, rect.height)
//     }).exec()
//   },
// // canvas上的触摸事件
//   touchHandler (e) {
//     // console.log(lineChart.getCurrentDataIndex(e))
//     lineChart.showToolTip(e, {
//       // background: '#7cb5ec',
//       format (item, category) {
//         return category + ' ' + item.name + ':' + item.data
//       }
//     })
//   },
//   setChartData (that, width, height) {
//     console.log(width, height)
//     let name = '日期'
//     let flag = '次'
//     let title = '学习课程数(次)'
//     lineChart = new WxCharts({
//       canvasId: 'lineCanvas',
//       width: width,
//       height: height,
//       animation: true, // 是否动画展示
//       legend: true, // 是否显示图标下方的各类标识
//       type: 'line', // 图表类型，可选值为pie, line, column, area, ring, radar
//       categories: chartData.main.categories,
//       enableScroll: true,
//       background: '#f6f6f6',
//       series: [{
//         name: name,
//         // data: chartData.main.data,
//         data: chartData.main.data,
//         format (val, name) {
//           return val + flag
//         }
//       }],
//       xAxis: {
//         gridColor: '#ffffff',
//         disableGrid: true
//       },
//       yAxis: {
//         title: title,
//         gridColor: '#ffffff',
//         format (val) {
//           return val + flag
//         },
//         min: 0
//       },
//       dataLabel: false,
//       dataPointShape: true,
//       extra: {
//         lineStyle: 'curve' // curve 曲线 straight 直线
//       }
//     })
//     // 柱状图
//     // columnChart = new WxCharts({
//     //   canvasId: 'columnCanvas',
//     //   type: 'column',
//     //   animation: true,
//     //   categories: chartData.main.categories,
//     //   series: [{
//     //     name: name,
//     //     data: chartData.main.data,
//     //     format (val, name) {
//     //       return val + flag
//     //     }
//     //   }],
//     //   yAxis: {
//     //     format (val) {
//     //       return val + flag
//     //     },
//     //     title: title,
//     //     min: 0
//     //   },
//     //   xAxis: {
//     //     disableGrid: true,
//     //     type: 'calibration'
//     //   },
//     //   extra: {
//     //     column: {
//     //       width: 20
//     //     }
//     //   },
//     //   width: windowWidth,
//     //   height: 320,
//     // })
//   },
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
    // this.getAllRects()
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
