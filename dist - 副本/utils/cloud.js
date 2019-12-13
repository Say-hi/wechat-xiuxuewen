'use strict';

/**
 * Created by JWQ on 2019/2/20.
 */
wx.cloud.init({
  traceUser: true
});

module.exports = {
  getShareText: function getShareText() {
    return new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'getShareText',
        data: {},
        success: function success(res) {
          resolve(res);
        },
        fail: function fail(err) {
          reject(err);
        }
      });
    });
  },
  getUserOperation: function getUserOperation() {
    return new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'getUserOperation',
        data: {},
        success: function success(res) {
          resolve(res.result);
        },
        fail: function fail(err) {
          reject(err);
        }
      });
    });
  },
  getMoney: function getMoney() {
    return new Promise(function (resolve, reject) {
      wx.cloud.callFunction({
        name: 'getMoney',
        data: {},
        success: function success(res) {
          resolve(res.result);
        },
        fail: function fail(err) {
          reject(err);
        }
      });
    });
  }
};