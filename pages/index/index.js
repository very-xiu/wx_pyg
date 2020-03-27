// 引入发送请求的Promise函数
import { request } from '../../request/index.js'
// 引入支持async await文件
import regeneratorRuntime from '../../lib/runtime/runtime.js'

Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    cateList:[],
    // 楼层数组
    floorList:[]
  },
  onLoad: function (options) {
    //Do some initialize when page load.
    // 1.发送异步请求获取轮播图数据、分类导航数据、楼层数据
    this.getSwiperList();
    this.getCateList();
    // 本地存储的楼层数据
    const FloorList = wx.getStorageSync('floorList');
    if (!FloorList) {
      // 不存在，发送请求获取数据
      this.getFloorList();
    } else {
      // 有旧的数据，定义过期的时间
      if (Date.now() - FloorList.time > 1000 * 300) {
        // 重新发送请求
        this.getFloorList();
      } else {
        // 可以使用旧数据
        this.setData({
          floorList:FloorList.data
        })
      }
    }
  },

  // 获取轮播图数据
  async getSwiperList() {
    let result=await request({ url: '/home/swiperdata' });
    result.forEach((v,i)=>{
      let urlNavigator0=result[0].navigator_url.replace(/main\?goods_id=129/gi,"index?goods_id=54668");
      let urlNavigator1=result[1].navigator_url.replace(/main\?goods_id=395/gi,"index?goods_id=17927");
      let urlNavigator2=result[2].navigator_url.replace(/main\?goods_id=38/gi,"index?goods_id=32956");
      result[0].navigator_url=urlNavigator0;
      result[1].navigator_url=urlNavigator1;
      result[2].navigator_url=urlNavigator2;
    });
    // console.log(result);
    this.setData({
      swiperList:result
    })
  },
  // 获取分类导航数据
  getCateList(){
    request({ url: '/home/catitems' }).then(result => {
      this.setData({
        cateList: result
      })
    })
  },
  // 点击分类导航跳转
  handleDispatch(e){
    // console.log(e);
    let {name}=e.currentTarget.dataset;
    if(name==="分类"){
      wx.switchTab({
        url: '/pages/category/index'
      })
    }else if(name==="秒杀拍"){
      wx.navigateTo({
        url: '/pages/goods_list/index?cid=188'
      })
    }else if(name==="超市购"){
      wx.navigateTo({
        url: '/pages/goods_list/index?cid=439'
      })
    }else{
      wx.navigateTo({
        url: '/pages/goods_list/index?cid=757'
      })
    }
  },
  // 获取楼层数据
  getFloorList(){
    request({ url: '/home/floordata' }).then(result => {
      // 对后台数据进行局部的字符串替换修改
      result.forEach((v,i)=>{
        v.product_list.forEach((value,index)=>{
          let oldValue=value.navigator_url;
          value.navigator_url=oldValue.replace(/\?/,"/index?");
          // console.log(newValue);
        })
      })
      // console.log(result);
      // 把接口获取的数据保存到本地存储中
      wx.setStorageSync('floorList', { time: Date.now(), data: result });
      this.setData({
        floorList: result
      })
    })
  },

  onReady: function () {
    //Do some when page ready.

  },
  onShow: function () {
    //Do some when page show.

  },
  onHide: function () {
    //Do some when page hide.

  },
  onUnload: function () {
    //Do some when page unload.

  },
  onPullDownRefresh: function () {
    //Do some when page pull down.

  }
})