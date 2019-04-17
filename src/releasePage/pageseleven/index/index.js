// 获取全局应用程序实例对象
const app = getApp()
const COS = require('../cos-js-sdk-v5.min')
const config = require('../config')
const cos = new COS({
  getAuthorization (params, callback) {
    let authorization = COS.getAuthorization({
      SecretId: config.SecretId,
      SecretKey: config.SecretKey,
      Method: params.Method,
      Key: params.Key
    })
    callback(authorization)
  }
})
const UpLoad = require('../upLoad')
// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: {
      freight: 0.00,
      is_up: -1,
      sku: [{
        value: '默认',
        price: 0.01,
        stock: 1,
        img: []
      }]
    },
    topIndex: 0,
    labelIndex: 0,
    sizeIndex: 0,
    addItemIndex: -3, // -1 增加规格子项，-2增加规格 -3隐藏 >=0 修改
    sizeArr: [
      {
        name: '颜色'
      },
      {
        name: '产地'
      },
      {
        name: '自定义'
      }
    ],
    price: 1,
    stock: 1,
    sale: 1,
    upImgArr2: [],
    upImgArrProgress2: [],
    upImgArr3: [],
    upImgArrProgress3: []
  },
  addItemImg (e) {
    new UpLoad({count: 3, this: this, imgArr: e.currentTarget.dataset.index}).chooseImage()
  },
  // 修改规格图片
  changeItemImg (e) {
    new UpLoad({count: 3, this: this, imgArr: e.currentTarget.dataset.oindex, index: e.currentTarget.dataset.index}).imgOp()
  },
  // 多图上传
  upImg2 (index) {
    let imgArr = 'upImgArr2'
    let progressArr = 'upImgArrProgress2'
    let that = this
    let length = that.data[imgArr].length || 0
    let id = app.gs('userInfoAll').id || 10000
    wx.chooseImage({
      count: index >= 0 ? 1 : 9 - length,
      success (res) {
        for (let [i, v] of res.tempFilePaths.entries()) {
          if (!that.data[imgArr][index >= 0 ? index : length + i]) {
            that.data[imgArr][index >= 0 ? index : length + i] = {
              temp: null,
              real: null
            }
          }
          that.data[imgArr][index >= 0 ? index : length + i]['real'] = ''
          that.data[imgArr][index >= 0 ? index : length + i]['temp'] = v
        }
        that.setData({
          upImgArr2: that.data[imgArr]
        })
        function noUse () {}
        (function upLoad (j) {
          let v = res.tempFilePaths[j]
          let Key = `image/${id}/${v.substr(v.lastIndexOf('/') + 1)}` // 这里指定上传的文件名
          cos.postObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: Key,
            FilePath: v,
            onProgress: function (info) {
              that.data[progressArr][index >= 0 ? index : length + j] = info.percent * 100
              that.setData({
                upImgArrProgress2: that.data[progressArr]
              })
            }
          }, (err, data) => {
            if (err) {
              that.data[imgArr][index >= 0 ? index : length + j]['upFail'] = true
              that.setData({
                upImgArr2: that.data[imgArr]
              })
            } else {
              that.data[imgArr][index >= 0 ? index : length + j]['real'] = `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/${Key}`
              that.data[imgArr][index >= 0 ? index : length + j]['Key'] = Key
              that.setData({
                upImgArr2: that.data[imgArr]
              })
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1)
          })
        })(0)
      }
    })
  },
  // 图片操作
  imgOperation2 (e) {
    if (!this.data.upImgArr2[e.currentTarget.dataset.index].real) return app.setToast(this, {content: '请稍后操作'})
    let that = this
    let itemList = ['查看图片', '替换图片', '删除图片']
    for (let v of this.data.upImgArr2) {
      if (!v.real) itemList = ['查看图片', '替换图片']
    }
    wx.showActionSheet({
      itemList,
      success (res) {
        if (res.tapIndex === 0) {
          app.showImg(that.data.upImgArr2[e.currentTarget.dataset.index].temp, [that.data.upImgArr2[e.currentTarget.dataset.index].temp])
        } else if (res.tapIndex === 2) {
          that.data.upImgArr2.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            upImgArr2: that.data.upImgArr2
          })
        } else if (res.tapIndex === 1) {
          that.upImg2(e.currentTarget.dataset.index)
        }
      }
    })
  },
  // 多图上传
  upImg3 (index) {
    let imgArr = 'upImgArr3'
    let progressArr = 'upImgArrProgress3'
    let that = this
    let length = that.data[imgArr].length || 0
    let id = app.gs('userInfoAll').id || 10000
    wx.chooseImage({
      count: index >= 0 ? 1 : 9 - length,
      success (res) {
        for (let [i, v] of res.tempFilePaths.entries()) {
          if (!that.data[imgArr][index >= 0 ? index : length + i]) {
            that.data[imgArr][index >= 0 ? index : length + i] = {
              temp: null,
              real: null
            }
          }
          that.data[imgArr][index >= 0 ? index : length + i]['real'] = ''
          that.data[imgArr][index >= 0 ? index : length + i]['temp'] = v
        }
        that.setData({
          upImgArr3: that.data[imgArr]
        })
        function noUse () {}
        (function upLoad (j) {
          let v = res.tempFilePaths[j]
          let Key = `image/${id}/${v.substr(v.lastIndexOf('/') + 1)}` // 这里指定上传的文件名
          cos.postObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: Key,
            FilePath: v,
            onProgress: function (info) {
              that.data[progressArr][index >= 0 ? index : length + j] = info.percent * 100
              that.setData({
                upImgArrProgress3: that.data[progressArr]
              })
            }
          }, (err, data) => {
            if (err) {
              that.data[imgArr][index >= 0 ? index : length + j]['upFail'] = true
              that.setData({
                upImgArr3: that.data[imgArr]
              })
            } else {
              console.log(data)
              that.data[imgArr][index >= 0 ? index : length + j]['real'] = `https://${config.Bucket}.cos.${config.Region}.myqcloud.com/${Key}`
              that.data[imgArr][index >= 0 ? index : length + j]['Key'] = Key
              that.setData({
                upImgArr3: that.data[imgArr]
              })
            }
            if (j + 1 < res.tempFilePaths.length) upLoad(j + 1)
          })
        })(0)
      }
    })
  },
  // 图片操作
  imgOperation3 (e) {
    if (!this.data.upImgArr3[e.currentTarget.dataset.index].real) return app.setToast(this, {content: '请稍后操作'})
    let that = this
    let itemList = ['查看图片', '替换图片', '删除图片']
    for (let v of this.data.upImgArr3) {
      if (!v.real) itemList = ['查看图片', '替换图片']
    }
    wx.showActionSheet({
      itemList,
      success (res) {
        if (res.tapIndex === 0) {
          app.showImg(that.data.upImgArr3[e.currentTarget.dataset.index].temp, [that.data.upImgArr3[e.currentTarget.dataset.index].temp])
        } else if (res.tapIndex === 2) {
          that.data.upImgArr3.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            upImgArr3: that.data.upImgArr3
          })
        } else if (res.tapIndex === 1) {
          that.upImg3(e.currentTarget.dataset.index)
        }
      }
    })
  },
  CTT () {
    this.setData({
      cttIndex: !this.data.cttIndex
    })
  },
  chooseSale () {
    this.setData({
      ['info.is_up']: this.data.info.is_up * 1 === 1 ? -1 : 1
    })
  },
  changeContent (e) {
    if (e.detail.target.dataset.type === 'cancel' && this.data.addItemIndex * 1 < 0) {
      return this.setData({
        addItemIndex: -3
      })
    }
    if (!e.detail.value.addItem.length) return app.setToast(this, {content: '请输入内容'})
    if (e.detail.target.dataset.type === 'cancel') {
      if (this.data.addItemIndex * 1 >= 0) {
        this.data.info.sku.splice(this.data.addItemIndex, 1)
        this.setData({
          ['info.sku']: this.data.info.sku.length <= 0 ? [{value: '默认', price: 0.01, stock: 1}] : this.data.info.sku,
          addItemIndex: -3
        })
      } else {
        this.setData({
          addItemIndex: -3
        })
      }
    } else {
      if (this.data.addItemIndex * 1 === -1) {
        this.setData({
          addItemIndex: -3,
          [`info.sku[${this.data.info.sku.length}]`]: {
            value: e.detail.value.addItem,
            stock: 1,
            price: 0.01}
        })
      } else if (this.data.addItemIndex * 1 === -2) {
        this.data.sizeArr.splice(this.data.sizeArr.length - 1, 0, {name: e.detail.value.addItem})
        this.setData({
          sizeArr: this.data.sizeArr,
          ['info.sku']: [],
          addItemIndex: -3
        })
      } else {
        this.setData({
          [`info.sku[${this.data.addItemIndex}].value`]: e.detail.value.addItem,
          addItemIndex: -3
        })
      }
    }
  },
  addItem (e) {
    this.setData({
      addItemIndex: e.currentTarget.dataset.index
    })
  },
  sizeMore () {
    this.setData({
      sizeMore: !this.data.sizeMore
    })
  },
  bindSizeChange (e) {
    this.setData({
      sizeIndex: e.detail.value
    })
    if (e.detail.value >= this.data.sizeArr.length - 1) {
      this.setData({
        addItemIndex: -2
      })
    }
  },
  bindLabelChange (e) {
    this.setData({
      labelIndex: e.detail.value
    })
  },
  tabChoose (e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
  },
  getCategory (options) {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopCategoryList,
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          that.setData({
            goodslabel: res.data.data
          }, () => {
            if (options.id) that.shopProduct(options.id)
          })
          app.su('shopLabel', res.data.data)
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  shopProduct (pid) {
    let that = this
    app.wxrequest({
      url: app.getUrl().shopProduct,
      data: {
        pid
      },
      success (res) {
        wx.hideLoading()
        if (res.data.status === 200) {
          res.data.data.imgs = res.data.data.imgs ? res.data.data.imgs.split(',') : []
          if (res.data.data.imgs.length > 0) {
            for (let v of res.data.data.imgs) {
              that.data.upImgArr2.push({
                real: v,
                temp: v,
                key: v
              })
              that.data.upImgArrProgress2.push(100)
            }
          }
          // that.data.upImgArr2.unshift({
          //   real: res.data.data.img,
          //   temp: res.data.data.img,
          //   key: res.data.data.img
          // })
          that.data.upImgArrProgress2.unshift(100)
          res.data.data.detail = res.data.data.detail ? res.data.data.detail.split(',') : []
          if (res.data.data.detail.length > 0) {
            for (let v of res.data.data.detail) {
              that.data.upImgArr3.push({
                real: v,
                temp: v,
                key: v
              })
              that.data.upImgArrProgress3.push(100)
            }
          }
          let sku = res.data.data.sku
          sku.map((v, i) => {
            if (!v.img) {
              sku[i].img = []
            } else {
              let temp = v.img.split(',')
              let tempArr = []
              temp.map((vv, ii) => {
                tempArr.push({
                  temp: vv,
                  key: vv,
                  real: vv,
                  progress: 100
                })
              })
              sku[i].img = tempArr
            }
          })
          for (let [i, v] of that.data.goodslabel.entries()) {
            if (v.id * 1 === res.data.data.cid * 1) {
              that.data.labelIndex = i
              break
            }
          }
          let scount = 0
          for (let [i, v] of that.data.sizeArr.entries()) {
            ++scount
            if (v.name === res.data.data.label) {
              that.data.sizeIndex = i
              break
            }
          }
          if (scount >= that.data.sizeArr.length) {
            that.data.sizeIndex = scount - 1
            that.data.sizeArr.splice(scount - 1, 0, {name: res.data.data.label})
          }
          app.setBar(res.data.data.title)
          that.setData({
            info: res.data.data,
            upImgArr3: that.data.upImgArr3,
            upImgArrProgress3: that.data.upImgArrProgress3,
            upImgArr2: that.data.upImgArr2,
            upImgArrProgress2: that.data.upImgArrProgress2,
            labelIndex: that.data.labelIndex,
            sizeIndex: that.data.sizeIndex,
            sizeArr: that.data.sizeArr,
            sizeMore: res.data.data.label * 1 !== -1
          })
        } else {
          app.setToast(that, {content: res.data.desc})
        }
      }
    })
  },
  inputValue (e) {
    if (e.currentTarget.dataset.type === 'title') {
      this.setData({
        ['info.title']: e.detail.value
      })
    } else if (e.currentTarget.dataset.type === 'express') {
      this.setData({
        ['info.freight']: (e.detail.value * 1).toFixed(2)
      })
    } else {
      if (e.currentTarget.dataset.type === 'stock') {
        this.setData({
          [`info.sku[${e.currentTarget.dataset.index}].stock`]: e.detail.value
        })
      } else {
        this.setData({
          [`info.sku[${e.currentTarget.dataset.index}].price`]: (e.detail.value * 1).toFixed(2)
        })
      }
    }
  },
  upGoods () {
    let that = this
    let imgs = []
    let detail = []
    const info = this.data.info
    if (!info.title || info.title.length <= 0) return app.setToast(this, {content: '请输入产品标题'})
    if (this.data.upImgArr2.length <= 0) return app.setToast(this, {content: '最少上传一张商品图'})
    for (let v of this.data.upImgArr2) {
      if (!v.real) return app.setToast(that, {content: '请等待所有图片上传完成'})
      imgs.push(v.real)
    }
    for (let v of this.data.upImgArr3) {
      if (!v.real) return app.setToast(that, {content: '请等待所有图片上传完成'})
      detail.push(v.real)
    }
    let SKUS = info.sku
    info.sku.map((v, index) => {
      let temp = []
      if (!v.img || !v.img.length) {
        temp.push(that.data.upImgArr2[0].real)
      } else {
        v.img.map((s, y) => {
          if (s.progress < 98) return app.setToast(that, {content: `请等待【${v.value}】分类的图片上传完成`})
          temp.push(s.real)
        })
      }
      SKUS[index].img = temp.join(',')
    })
    app.wxrequest({
      url: app.getUrl()[that.data.info.id ? 'shopEdit' : 'shopRelease'],
      data: Object.assign({
        mid: app.gs('shopInfoAll').id,
        cid: that.data.goodslabel[that.data.labelIndex].id,
        parent_id: 0,
        title: info.title,
        img: that.data.upImgArr2[0].real,
        imgs: imgs.join(','),
        old_price: info.sku[0].price,
        freight: info.freight,
        is_up: info.is_up,
        label: that.data.sizeMore ? that.data.sizeArr[that.data.sizeIndex].name : -1,
        sku: JSON.stringify(SKUS),
        detail: detail.join(','),
        detail_text: info.detail_text || ''
      }, that.data.info.id ? {pid: that.data.info.id} : {}),
      success (res2) {
        wx.hideLoading()
        if (res2.data.status === 200) {
          wx.showToast({
            title: '上传成功'
          })
          wx.navigateBack()
        } else {
          app.setToast(that, {content: res2.data.desc})
        }
      }
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
        path: `/shopPage/shoppages/index/index?mid=${app.gs('shopInfoAll').id}&user=${app.gs('userInfoAll').id}`
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.getCategory(options)
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
