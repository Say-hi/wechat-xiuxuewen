'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/*eslint-disable */
Component({
  properties: {
    painting: {
      type: Object,
      value: { view: [] },
      observer: function observer(newVal, oldVal) {
        console.log(newVal);
        if (!this.data.isPainting) {
          if (newVal.width && newVal.height) {
            this.setData({
              isPainting: true
            });
            this.readyPigment();
          }
        }
      }
    }
  },
  data: {
    width: 100,
    height: 100,

    index: 0,
    imageList: [],
    tempFileList: [],

    isPainting: false
  },
  ctx: null,
  cache: {},
  ready: function ready() {
    wx.removeStorageSync('canvasdrawer_pic_cache');
    this.cache = wx.getStorageSync('canvasdrawer_pic_cache') || {};
    this.ctx = wx.createCanvasContext('canvasdrawer', this);
  },

  methods: {
    readyPigment: function readyPigment() {
      var _this = this;

      var _data$painting = this.data.painting,
          width = _data$painting.width,
          height = _data$painting.height,
          views = _data$painting.views;

      this.setData({
        width: width,
        height: height
      });
      var inter = setInterval(function () {
        if (_this.ctx) {
          clearInterval(inter);
          _this.ctx.clearActions();
          _this.drawRect({
            background: 'white',
            top: 0,
            left: 0,
            width: width,
            height: height
          });
          _this.getImageList(views);
          _this.downLoadImages(0);
        }
      }, 100);
    },
    getImageList: function getImageList(views) {
      var imageList = [];
      for (var i = 0; i < views.length; i++) {
        if (views[i].type === 'image') {
          imageList.push(views[i].url);
        }
      }
      this.setData({
        imageList: imageList
      });
    },
    downLoadImages: function downLoadImages(index) {
      var _this2 = this;

      var _data = this.data,
          imageList = _data.imageList,
          tempFileList = _data.tempFileList;

      if (index < imageList.length) {
        // console.log(imageList[index])
        this.getImageInfo(imageList[index]).then(function (file) {
          tempFileList.push(file);
          _this2.setData({
            tempFileList: tempFileList
          });
          _this2.downLoadImages(index + 1);
        });
      } else {
        this.startPainting();
      }
    },
    startPainting: function startPainting() {
      var _this3 = this;

      var _data2 = this.data,
          tempFileList = _data2.tempFileList,
          views = _data2.painting.views;

      for (var i = 0, imageIndex = 0; i < views.length; i++) {
        if (views[i].type === 'image') {
          this.drawImage(_extends({}, views[i], {
            url: tempFileList[imageIndex]
          }));
          imageIndex++;
        } else if (views[i].type === 'text') {
          if (!this.ctx.measureText) {
            wx.showModal({
              title: '提示',
              content: '当前微信版本过低，无法使用 measureText 功能，请升级到最新微信版本后重试。'
            });
          } else {
            this.drawText(views[i]);
          }
        } else if (views[i].type === 'rect') {
          this.drawRect(views[i]);
        }
      }
      this.ctx.draw(true, function () {
        wx.setStorageSync('canvasdrawer_pic_cache', _this3.cache);
        _this3.saveImageToLocal();
      });
    },
    drawImage: function drawImage(params) {
      var url = params.url,
          _params$top = params.top,
          top = _params$top === undefined ? 0 : _params$top,
          _params$left = params.left,
          left = _params$left === undefined ? 0 : _params$left,
          _params$width = params.width,
          width = _params$width === undefined ? 0 : _params$width,
          _params$height = params.height,
          height = _params$height === undefined ? 0 : _params$height;

      this.ctx.drawImage(url, left, top, width, height);
    },
    drawText: function drawText(params) {
      var _params$MaxLineNumber = params.MaxLineNumber,
          MaxLineNumber = _params$MaxLineNumber === undefined ? 2 : _params$MaxLineNumber,
          _params$breakWord = params.breakWord,
          breakWord = _params$breakWord === undefined ? false : _params$breakWord,
          _params$color = params.color,
          color = _params$color === undefined ? 'white' : _params$color,
          _params$content = params.content,
          content = _params$content === undefined ? '' : _params$content,
          _params$fontSize = params.fontSize,
          fontSize = _params$fontSize === undefined ? 16 : _params$fontSize,
          _params$top2 = params.top,
          top = _params$top2 === undefined ? 0 : _params$top2,
          _params$left2 = params.left,
          left = _params$left2 === undefined ? 0 : _params$left2,
          _params$lineHeight = params.lineHeight,
          lineHeight = _params$lineHeight === undefined ? 20 : _params$lineHeight,
          _params$textAlign = params.textAlign,
          textAlign = _params$textAlign === undefined ? 'left' : _params$textAlign,
          width = params.width,
          _params$bolder = params.bolder,
          bolder = _params$bolder === undefined ? false : _params$bolder,
          _params$textDecoratio = params.textDecoration,
          textDecoration = _params$textDecoratio === undefined ? 'none' : _params$textDecoratio;


      this.ctx.setTextBaseline('top');
      this.ctx.setTextAlign(textAlign);
      this.ctx.setFillStyle(color);
      this.ctx.setFontSize(fontSize);

      if (!breakWord) {
        this.ctx.fillText(content, left, top);
        this.drawTextLine(left, top, textDecoration, color, fontSize, content);
      } else {
        var fillText = '';
        var fillTop = top;
        var lineNum = 1;
        for (var i = 0; i < content.length; i++) {
          fillText += [content[i]];
          if (this.ctx.measureText(fillText).width > width) {
            if (lineNum === MaxLineNumber) {
              if (i !== content.length) {
                fillText = fillText.substring(0, fillText.length - 1) + '...';
                this.ctx.fillText(fillText, left, fillTop);
                this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText);
                fillText = '';
                break;
              }
            }
            this.ctx.fillText(fillText, left, fillTop);
            this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText);
            fillText = '';
            fillTop += lineHeight;
            lineNum++;
          }
        }
        this.ctx.fillText(fillText, left, fillTop);
        this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText);
      }

      if (bolder) {
        this.drawText(_extends({}, params, {
          left: left + 0.3,
          top: top + 0.3,
          bolder: false,
          textDecoration: 'none'
        }));
      }
    },
    drawTextLine: function drawTextLine(left, top, textDecoration, color, fontSize, content) {
      if (textDecoration === 'underline') {
        this.drawRect({
          background: color,
          top: top + fontSize * 1.2,
          left: left - 1,
          width: this.ctx.measureText(content).width + 2,
          height: 1
        });
      } else if (textDecoration === 'line-through') {
        this.drawRect({
          background: color,
          top: top + fontSize * 0.6,
          left: left - 1,
          width: this.ctx.measureText(content).width + 2,
          height: 1
        });
      }
    },
    drawRect: function drawRect(params) {
      // console.log(params)
      var background = params.background,
          _params$top3 = params.top,
          top = _params$top3 === undefined ? 0 : _params$top3,
          _params$left3 = params.left,
          left = _params$left3 === undefined ? 0 : _params$left3,
          _params$width2 = params.width,
          width = _params$width2 === undefined ? 0 : _params$width2,
          _params$height2 = params.height,
          height = _params$height2 === undefined ? 0 : _params$height2;

      this.ctx.setFillStyle(background);
      this.ctx.fillRect(left, top, width, height);
    },
    getImageInfo: function getImageInfo(url) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        /* 获得要在画布上绘制的图片 */
        if (_this4.cache[url]) {
          resolve(_this4.cache[url]);
        } else {
          var objExp = new RegExp(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/);
          if (objExp.test(url)) {
            wx.getImageInfo({
              src: url,
              complete: function complete(res) {
                if (res.errMsg === 'getImageInfo:ok') {
                  _this4.cache[url] = res.path;
                  resolve(res.path);
                } else {
                  reject(new Error('getImageInfo fail'));
                }
              }
            });
          } else {
            _this4.cache[url] = url;
            resolve(url);
          }
        }
      });
    },
    saveImageToLocal: function saveImageToLocal() {
      var _this5 = this;

      var _data3 = this.data,
          width = _data3.width,
          height = _data3.height;

      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: width,
        height: height,
        canvasId: 'canvasdrawer',
        success: function success(res) {
          if (res.errMsg === 'canvasToTempFilePath:ok') {
            _this5.setData({
              isPainting: false,
              imageList: [],
              tempFileList: []
            });
            console.log(res.tempFilePath);
            _this5.triggerEvent('getImage', { tempFilePath: res.tempFilePath });
          }
        }
      }, this);
    }
  }
});