// 引入发送请求的Promise函数
import { request } from '../../request/index.js'
// 引入支持async await文件
import regeneratorRuntime from '../../lib/runtime/runtime.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightContent: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    // 设置右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.先判断一下本地存储中有没有旧数据，没有旧数据就发送异步请求获取分类数据，有旧数据同时旧数据没有过期，就使用本地的存储旧数据
    // {time:Date.now(),data:[...]}
    const Cates = wx.getStorageSync('cates');
    if (!Cates) {
      // 不存在，发送请求获取数据
      this.getCates();
    } else {
      // 有旧的数据，定义过期的时间
      if (Date.now() - Cates.time > 1000 * 300) {
        // 重新发送请求
        this.getCates();
      } else {
        // 可以使用旧数据
        this.Cates = Cates.data;
        // 构造左侧大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  // 获取分类数据
  async getCates() {
    /* request({ url: '/categories' }).then(result => {
      this.Cates = result.data.message;
      // 把接口数据保存到本地存储中
      wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });

      // 构造左侧大菜单数据
      let leftMenuList = this.Cates.map(v => v.cat_name);
      let rightContent = this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })
    }) */
    const result = await request({ url: '/categories' });
    this.Cates = result;
    // 把接口数据保存到本地存储中
    wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });
    // 构造左侧大菜单数据
    // console.log(this.Cates);
    let leftMenuList = this.Cates.map(v => v.cat_name);
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 左侧菜单点击事件
  handleItemTap(e) {
    // console.log(e)
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置右侧内容的scroll-view标签距离顶部的距离
      scrollTop: 0
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