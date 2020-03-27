// 引入发送请求的Promise函数
import { request } from '../../request/index.js'
// 引入支持async await文件
import regeneratorRuntime from '../../lib/runtime/runtime.js'
// 引入utils函数
import { getSetting, chooseAddress, openSetting, showModal, showToast,requestPayment } from '../../utils/asyncWx.js'

/* 
  页面加载的时候
    1.从缓存中获取购物车数据，渲染到页面中
  微信支付
    1.哪些人哪些账号可以实现微信支付
      企业账号，企业账号小程序后台中必须给开发者添加白名单
      1个APPID可以同时绑定多个开发者
      此时这些开发者就可以共用这个appid和它的开发权限了
    支付按钮
    1.先判断缓存中有没有token
    没有：跳转到授权页面，进行获取token
    有token创建订单
    已经完成微信支付
    手动删除缓存中已经被选中了的商品
    重新把删除后的购物车数据填充回缓存
    再跳转页面
*/

// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 定义一个对象变量接收本地缓存的对象
    address: {},
    // 购物车数组
    cart: [],
    totalNum: 0,
    totalPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    const address = wx.getStorageSync('address');
    // 获取缓存中购物车数据
    let cart = wx.getStorageSync('cart') || [];
    cart = cart.filter(v => v.checked)
    // 总价格、总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.goods_price * v.num;
      totalNum += v.num;
    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  },
  // 点击支付功能
  async handleOrderPay() {
    try {
      // 判断缓存中有没有token
      const token = wx.getStorageSync('token');
      // 判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        })
        return;
      }
      console.log('已经存在token');
      // 创建订单
      // 准备请求头参数
      // const header = { Authorization: token };
      // 请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.goods_num,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods };
      // 准备发送请求，创建订单，获取订单编号
      const {order_number} = await request({ url: "/my/orders/create", method: "POST", data: orderParams });
      // console.log(res);
      // 发起预支付接口
      const {pay}=await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}});
      // 发起微信支付
      await requestPayment(pay);
      // console.log(res);
      // 查询后台订单状态
      const res=await request({url:"/my/orders/chkOrder",method: "POST",data:{order_number}});
      // console.log(res);
      await showToast({title:"支付成功"});
    } catch (e) {
      // 删除缓存中已经支付了的商品
      let newCart=wx.getStorageSync('cart');
      newCart=newCart.filter(v=>!v.checked);
      wx.setStorageSync('cart', newCart);
      // console.log(e);
      wx.showToast({
        title: '假的支付页面',
        image: '../../icons/qrcode.jpg',
        mask:true,
        duration:5000,
        success:(res)=>{
          // 支付成功了，跳转到订单页面
          wx.navigateTo({
            url: '/pages/order/index?type=1',
            success: function(res){
              // success
            }
          })
        }
      })
    }
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