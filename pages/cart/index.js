// 引入发送请求的Promise函数
import { request } from '../../request/index.js'
// 引入支持async await文件
import regeneratorRuntime from '../../lib/runtime/runtime.js'
// 引入utils函数
import { getSetting, chooseAddress, openSetting, showModal,showToast } from '../../utils/asyncWx.js'

/* 
  获取用户的收货地址
    1.绑定点击事件
    2.调用小程序内置API 获取用户收货地址
    获取用户对小程序所授予获取地址的权限状态：scope
      1.假设用户点击获取收货地址的提示框：确定
      scope值是true   authSetting scope.address
      2.假设用户点击获取收货地址的提示框：取消
      scope值是false(这个再点击就没有反应了)
      所以要诱导用户自己打开授权设置页面，当用户重新授权收货地址权限的时候，才能跳转到收货地址编写
      3.假设用户从来没有调用过收货地址API
      scope值是undefined
      4.把获取到的收货地址存入到本地存储中
*/
/* 
  页面加载完毕
    1.获取本地存储中的地址数据
    2.把数据设置给data中的一个变量
*/
/* 
  全选和反选
    1.全选复选框绑定事件：change
    2.获取data中的全选变量：allChecked
    3.直接取反allChecked=！allChecked
    4.遍历购物车数组让里面商品选中状态跟随allChecked改变而改变
    5.把购物车数组和allChecked重新设置回data，把购物车重新设置回缓存中
*/
/* 
  商品数量的编辑
    1."+" "-"按钮绑定同一个点击事件，区分的关键自定义属性
      "+":"+1"
      "-":"-1"
    2.传递被点击的商品id：goods_id
    3.获取data中的购物车数组，来获取需要被修改的商品对象
      当购物车的数量=1，同时用户点击"-"
      弹窗提示询问用户是否要删除
      点确定删除，点取消什么都不做
    4.直接修改商品对象的数量：num
    5.把cart数组重新设置回缓存中和data中：this.setCart
*/
/* 
  点击结算
    1.判断有没有收货地址信息
    2.判断用户有没有选购商品
    3.经过以上的验证跳转到支付页面！
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
    allChecked: false,
    totalNum: 0,
    totalPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 点击收货地址
  async handleChooseAddress() {
    // 获取权限状态
    /* wx.getSetting({
      success: result => {
        const scopeAddress = result.authSetting["scope.address"];
        if (scopeAddress === true || scopeAddress === undefined) {
          // 获取收货地址
          wx.chooseAddress({
            success: result1 => {
              // console.log(result1);
            }
          })
        } else {
          // 用户以前拒绝授予权限，先诱导用户打开授权页面
          wx.openSetting({
            success: result2 => {
              // 获取收货地址
              wx.chooseAddress({
                success: result3 => {
                  // console.log(result3);
                }
              })
            }
          })
        }
      }
    }) */
    try {
      // 获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 判断权限状态
      if (scopeAddress === false) {
        // 诱导用户打开授权页面
        await openSetting();
      }
      // 获取收货地址
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      // 存入到本地存储中
      wx.setStorageSync('address', address)
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
    const address = wx.getStorageSync('address');
    // 获取缓存中购物车数据
    const cart = wx.getStorageSync('cart') || [];
    // 计算全选,every()是对数组中每一项运行给定函数，如果该函数对每一项返回true,则返回true,因为做了两次循环浪费性能
    // const allChecked=cart.length?cart.every(v=>v.checked):false;
    this.setData({ address });
    this.setCart(cart);
  },
  // 商品的选中
  handleItemChange(e) {
    // 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 选中状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  // 封装购物车状态函数，同时重新计算底部工具栏的数据
  setCart(cart) {
    // 重新计算
    let allChecked = true;
    // 总价格、总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.goods_price * v.num;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    })
    wx.setStorageSync('cart', cart);
  },
  // 商品全选功能
  handleItemAllCheck() {
    // 获取data中的数据
    let { cart, allChecked } = this.data;
    // 修改值
    allChecked = !allChecked;
    // 循环修改cart数组中的商品状态
    cart.forEach(v => v.checked = allChecked);
    // 把修改后的值填充回data和缓存中
    this.setCart(cart);
  },
  // 商品数量编辑功能
  async handleItemNumEdit(e) {
    // 获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    // 获取购物车数组
    let { cart } = this.data;
    // 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 封装好的弹窗提示
      const res = await showModal({ content: "您是否要删除？" });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 进行修改数量
      cart[index].num += operation;
      // 设置回缓存和data中
      this.setCart(cart);
    }
  },
  // 点击结算跳转事件
  async handlePay(){
    // 判断收货地址
    const {address,totalNum}=this.data;
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址！"});
      return;
    }
    // 判断用户有没有选购商品
    if(totalNum===0){
      await showToast({title:"您还没有选购商品！"});
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    })
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