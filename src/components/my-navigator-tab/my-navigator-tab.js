// components/component-tag-name.js
const app = getApp()
Component({
  externalClasses: ['mask', 'mask-in'],
  properties: {
    propNav: {
      type: Array,
      value: [
        {
          picture: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom1.png',
          title: '发现',
          path: '/pages/index/index'
        },
        {
          picture: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom2.png',
          title: '线下教室',
          // path: '/pages/articleCategories/articleCategories'
          path: '/offlinePage/pagesnine/courseOffline/courseOffline'
        },
        // {
        //   picture: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom3.png',
        //   title: '作品秀',
        //   path: '/pages/show/show'
        // },
        {
          picture: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom4.png',
          title: '我的',
          path: '/pages/user/user'
        }
      ],
      observer (newVal, oldVal, changedPath) {
        if (newVal.length < 1) {
          this.setData({
            propNav: [
              {
                picture: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom1.png',
                title: '首页',
                path: '/pages/index/index'
              },
              {
                picture: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom2.png',
                title: '线下教室',
                path: '/offlinePage/pagesnine/courseOffline/courseOffline'
              },
              // {
              //   picture: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom3.png',
              //   title: '作品秀',
              //   path: '/pages/show/show'
              // },
              {
                picture: 'https://c.jiangwenqiang.com/workProject/payKnowledge/bottom4.png',
                title: '我的',
                path: '/pages/user/user'
              }
            ]
          })
        }
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
        currentIndex: e.currentTarget.dataset.index
      })
    },
    _formSubmit () {

    },
    _close () {
      this.setData({
        show: false,
        currentIndex: -1
      })
    },
    _showMask (newValue, oldValue, changePath) {
      if (!newValue) {
        this.setData({
          show: false
        })
      } else {
        this.setData({
          show: true
        })
      }
    }
  }
})
