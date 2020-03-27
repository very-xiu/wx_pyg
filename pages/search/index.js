/* 
  输入框绑定事件，值改变事件，input事件
    1.获取到输入框的值
    2.合法判断
    3.检验通过，把输入框的值发送到后台
    4.返回的数据打印到页面上
*/
/* 
  防抖（防止抖动）节流  用定时器解决
    1.定义全局的定时器ID
    2.防抖一般用在输入框中，防止重复输入重复发送请求
    3.节流一般是用在页面下拉和上拉
*/

// 引入发送请求的Promise函数
import { request } from '../../request/index.js'
// 引入支持async await文件
import regeneratorRuntime from '../../lib/runtime/runtime.js'

// pages/search/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    // 取消按钮是否显示
    isFocus:false,
    // 输入框的值
    inpValue:''
  },
  TiemId:-1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 输入框值改变事件
  handleInput(e){
    // 获取输入框的值
    const {value}=e.detail;
    // 检查合法性
    if(!value.trim()){
      this.setData({
        isFocus:false,
        goods:[]
      })
      // 值不合法
      return;
    }
    this.setData({
      isFocus:true
    })
    // 准备发送请求获取数据
    clearInterval(this.TiemId);
    this.TiemId=setTimeout(()=>{
      this.qsearch(value);
    },1000)
  },
  // 发送请求获取搜索建议的数据
  async qsearch(query){
    const res=await request({url:"/goods/qsearch",data:{query}});
    // console.log(res);
    this.setData({
      goods:res
    })
  },
  // 点击取消按钮事件
  handleCancel(){
    this.setData({
      inpValue:"",
      isFocus:false,
      goods:[]
    })
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