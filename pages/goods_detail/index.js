// 引入发送请求的Promise函数
import { request } from '../../request/index.js'
// 引入支持async await文件
import regeneratorRuntime from '../../lib/runtime/runtime.js'

/* 
  点击轮播图预览大图功能
    1.给轮播图绑定点击事件
    2.调用小程序API previewImage
*/
/* 
  点击加入购物车
    1.先绑定点击事件
    2.获取缓存中的购物车数据：数组格式
    3.先判断当前的商品是否已经存在于购物车
    4.已经存在，修改商品数据，执行购物车数量++，重新把购物车数组填充回缓存中
    5.不存在于购物车的数组中，直接给购物车数组添加一个新元素，新元素带上购买的数量属性num，重新把购物车数组填充回缓存中
    6.弹出提示
*/
/* 
  商品收藏功能
    1.页面onShow的时候加载缓存中的商品收藏数据
    2.判断当前商品是不是被收藏
      1.是，改变收藏图标
      2.不是，什么都不做
    3.点击商品收藏按钮
      1.判断该商品是否存在于缓存数组中
      2.已经存在，把该商品删除
      3.没有存在，把商品添加到收藏数组中，存入到缓存中即可
*/

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    // 返回顶部组件是否显示
    backTopValue:false,
    // 商品是否收藏
    isCollect:false
  },

  // 商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let pages=getCurrentPages();
    let currentPage=pages[pages.length-1];
    let options=currentPage.options;
    const {goods_id}=options;
    this.getGoodsDetail(goods_id);
  },
  // 获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj=await request({url:"/goods/detail",data:{goods_id}})
    this.GoodsInfo=goodsObj;
    // 获取缓存中商品收藏的数组
    let collect=wx.getStorageSync('collect')||[];
    // 判断当前商品是否被收藏
    let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id)
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        // iphone部分手机不识别webp图片格式
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      },
      isCollect
    })
  },
  // 点击收藏按钮
  handleCollect(){
    let isCollect=false;
    // 获取缓存中商品收藏的数组
    let collect=wx.getStorageSync('collect')||[];
    // 判断该商品是否被收藏过
    let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    // 当index !=-1表示已经收藏过了
    if(index !==-1){
      // 能找到，已经收藏过了，在数组中删除该商品
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title:'取消成功',
        icon:'success',
        mask:true
      })
    }else{
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title:'收藏成功',
        icon:'success',
        mask:true
      })
    }
    wx.setStorageSync('collect', collect);
    // 修改data中isCollect属性值
    this.setData({
      isCollect
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
  handleBackTop(){
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

  },
  // 点击轮播图放大预览
  handlePreviewImage(e){
    // 先构造要预览的图片数组
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
    // 接收传递过来的图片url
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },
  // 点击加入购物车
  handleCartAdd(){
    // 1.获取缓存中的购物车数组
    let cart=wx.getStorageSync('cart')||[];
    // 2.判断当前的商品是否已经存在于购物车
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      // 3.不存在，第一次添加
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo)
    }else{
      // 4.已经存在，修改商品数据，执行购物车数量++
      cart[index].num++;
    }
    // 5.重新把购物车数组填充回缓存中
    wx.setStorageSync('cart', cart);
    // 6.弹出提示
    wx.showToast({
      title:"加入成功",
      icon:"success",
      // true防止用户手抖，疯狂点击按钮
      mask:true
    })
  }
})