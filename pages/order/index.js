/*
  页面被打开的时候onShow
    1.获取url上的参数type
    onShow不同于onLoad，无法在形参上接收options参数
    判断缓存中有没有token
    1.没有就直接跳转到授权页面
    2.有，直接往下进行
    2.根据type去发送请求获取订单数据
    3.渲染页面
  点击不同标题，重新发送请求来获取和渲染数据
*/


// 引入发送请求的Promise函数
import { request } from '../../request/index.js'
// 引入支持async await文件
import regeneratorRuntime from '../../lib/runtime/runtime.js'
// 引入假数据
import orderData from '../../falseData/orderData.js'

// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '全部',
        isActive: true,
        type:1
      },
      {
        id: 1,
        value: '待付款',
        isActive: false,
        type:2
      },
      {
        id: 2,
        value: '待发货',
        isActive: false,
        type:3
      },
      {
        id: 3,
        value: '退款/退货',
        isActive: false,
        type:4
      }
    ],
    orderArr:[]//有真正的支付后历史账单查询接口，可以删除
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderData
    })
    
  },
  // 封装点击切换标题功能
  changeTitleByIndex(index){
    // 修改原数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },
  // 标题点击事件，从子组件传递过来的
  handleTabsItemChange(e) {
    // console.log(e);
    // 获取被点击的标题索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    // 重新发送请求type=1,index=0
    this.getOrders(index+1);
  },

  // 获取订单列表的方法,有企业支付账户才能用
  async getOrders(type) {
    try {
      const res = await request({ url: "/my/orders/all", data: { type } })
      // console.log(res);
    } catch (e) {
      if(type==1){
        this.setData({
          orderArr:orderData.orders
        })
        console.log(this.data.orderArr);
      }else if(type==2){
        let orderArr=orderData.orders.filter(v=>!v.pay_status);
        this.setData({
          orderArr
        })
        console.log(this.data.orderArr);
      }else if(type==3){
        let orderArr=orderData.orders.filter(v=>v.pay_status);
        this.setData({
          orderArr
        })
        console.log(this.data.orderArr);
      }else{
        let orderArr=orderData.orders.filter(v=>v.refund);
        this.setData({
          orderArr
        })
        // console.log(this.data.orderArr);
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return;
    }
    // 获取当前小程序的页面栈-数组，长度最大是10页面
    let pages = getCurrentPages();
    // 数组中索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 获取url上type参数
    const { type } = currentPage.options;
    this.changeTitleByIndex(type-1);
    // console.log(type);
    this.getOrders(type);
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