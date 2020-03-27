// 引入发送请求的Promise函数
import { request } from '../../request/index.js'
// 引入支持async await文件
import regeneratorRuntime from '../../lib/runtime/runtime.js'
// 引入utils函数
import { login } from '../../utils/asyncWx.js'

// pages/auth/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 获取用户信息
  async handleGetUserInfo(e) {
    try {
      // encryptedData,rawData,iv,signature
      const { encryptedData, rawData, iv, signature } = e.detail;
      // 获取小程序登录成功后的code
      const { code } = await login();
      const loginParams = { encryptedData, rawData, iv, signature, code };
      // 发送请求获取用户token
      const res = await request({ url: "/users/wxlogin", data: loginParams, method: "POST" });
      // 不是企业账号无法获取到token
      if (typeof res === "object") {
        // console.log(typeof res);
        // 把token存入缓存中，同时跳转回上一个页面
        wx.setStorageSync('token', '不是企业账号无法获取到token');
        // 返回上一层
        wx.navigateBack({
          delta: 1 // 回退前 delta(默认为1) 页面
        })
      }
    } catch (e) {
      console.log(e);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})