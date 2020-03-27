/* 
  用户上滑页面，滚动条触底开始加载下一页数据
    1.找到滚动条触底事件
    2.判断还有没有下一页数据
      1.获取到总页数，只有总条数
        总页数=Math.ceil(总条数/页容量)
      2.获取到当前页码
      3.判断当前页码是否大于等于总页数，大于表示没有下一页数据了
    3.假如没有下一页数据弹出一个提示
    4.假如还有下一页数据加载下一页数据
      1.当前页码++
      2.重新发送请求
      3.数据请求回来，对data中数组goodsList进行拼接
*/
/* 
  下拉刷新页面
    1.触发下拉刷新事件，需要在页面的json文件中开启一个配置项
    2.重置数据，数组
    3.重置页码，设置为1
    4.重新发送请求
    5.数据请求回来了，需要手动关闭加载效果
*/

// 引入发送请求的Promise函数
import { request } from '../../request/index.js'
// 引入支持async await文件
import regeneratorRuntime from '../../lib/runtime/runtime.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: [],
    // 返回顶部组件是否显示
    backTopValue: false,
    // 距离底部高度
    bottom: 20
  },
  // 接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid||"";
    this.QueryParams.query = options.query||"";
    this.getGoodsList();
  },
  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    // 总条数
    const { total } = res;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    this.setData({
      // 拼接数组
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    // 关闭下拉刷新的窗口
    wx.stopPullDownRefresh();
  },
  // 标题点击事件，从子组件传递过来的
  handleTabsItemChange(e) {
    // console.log(e);
    // 获取被点击的标题索引
    const { index } = e.detail;
    // 修改原数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    })
  },

  // 监听滚动条坐标
  onPageScroll(e) {
    const that = this;
    let scrollTop = e.scrollTop;
    let backTopValue = scrollTop > 500 ? true : false
    that.setData({
      backTopValue
    })
  },
  //返回顶部
  handleBackTop() {
    wx.pageScrollTo({
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
    // 重置数组
    this.setData({
      goodsList: []
    })
    // 重置页码
    this.QueryParams.pagenum = 1;
    // 发送请求
    this.getGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 判断还有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据了
      wx.showToast({
        title: '没有下一页数据了！',
        icon: 'none'
      });

    } else {
      // 还有下一页数据
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})