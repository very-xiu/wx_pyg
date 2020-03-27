# 微信小程序——优购商城项目

### 后台接口
```
`https://www.showdoc.cc/128719739414963?page_id=2513235043485226`


<!-- 没有图片时懒加载图片 -->
'https://ww1.sinaimg.cn/large/007rAy9hgy1g24by9t530j30i20i2glm.jpg'

新浪图床接口
https://images.ac.cn/Home/Index/UploadAction/
```

### 全局的组件和全局中加载刷新
```
1.全局的navigator跳转链接顶部搜索栏制作、全局返回顶部的按钮制作、全局导航栏制作。
2.全局加载中刷新制作，功能放在发送请求前后发送请求接收获取到数据就关闭；并作了一个判断的代码功能，多次发送请求时只执行一次加载刷新和关闭。
```

### 全局封装解决微信小程序兼容ES7的async await语法
    需要引入Facebook的lib/runtime/runtime.js插件来解决。

### 全局封装简易的Promise形式的请求发送获取数据的代码
  ```
request/index.js
  ```

### 全局封装Promise形式的wx.getSetting函数、wx.chooseAddress函数、wx.openSetting函数 
```
1.小程序获取收货地址API：wx.chooseAddress({})
2.小程序获取是否授予权限状态查看的API：wx.getSetting({})，authSetting["scope.address"]值是true或者undefined都可以进行下一步操作，值是false就不能进行下一步操作；判断值是false就诱导用户打开授权页面。
3.小程序诱导用户打开授权页面API：wx.openSetting({})
```

### 注意事项 
```
1.iphone部分手机不识别webp图片格式，通过[].replace(/\.webp/g,'.jpg')方法解决。
```

## 版块制作
  ### 首页版块
    1.顶部搜索栏组件导入
    2.从后台获取轮播图数据，并渲染到页面，可以跳转链接：<swiper></swiper>
    3.从后台获取导航数据，中间分类跳转导航制作。
    4.从后台获取楼层数据，渲染到页面。

  ### 底部TabBar
    1.准备选中图片和未选中图片。
    2.相关代码在app.json查看。

  ### 商品分类版块
    1.顶部搜索栏组件导入。
    2.分左侧菜单内容和右侧商品内容，获取到所有后台返回的数据，都可以跳转链接，再通过let leftMenuList = this.Cates.map(v => v.cat_name);把左侧数据提取出来，右侧商品内容默认为第一个内容，当点击左侧菜单显示其他个内容。<scroll-view></scroll-view>
    3.左侧菜单点击事件，重新设置右侧内容的scroll-view标签距离顶部的距离：scrollTop: 0
    4.把接口数据保存到手机本地存储的方法，减少每次向后台发送请求，提供用户体验：
    判断本地存储中有没有旧数据，没有旧数据就发送异步请求获取分类数据，有旧数据要判断旧数据有没有过期，没有就使用本地的存储旧数据的代码逻辑：
    onLoad: function (options) {
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
    // 获取分类数据
    async getCates() {
      const result = await request({ url: '/categories' });
      this.Cates = result;
      // 把接口数据保存到本地存储中
      wx.setStorageSync('cates', { time: Date.now(), data:  this.Cates });
      // 构造左侧大菜单数据
      // console.log(this.Cates);
      let leftMenuList = this.Cates.map(v => v.cat_name);
      let rightContent = this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })
    }

  ### 商品列表模块
```
1.顶部搜索栏组件导入。
2.全局返回顶部的按钮组件导入、全局导航栏组件导入。
3.全局导航栏组件监听自定义事件代码功能：bindtabsItemChange="handleTabsItemChange"
// 触发父组件中的事件，自定义并传递索引
this.triggerEvent('tabsItemChange',{index});
4.返回顶部按钮代码逻辑制作。
5.页面上拉触底事件的处理函数：判断当前页数是否大于总页数的代码：
// 拼接数据的数组
goodsList: [...this.data.goodsList, ...res.goods]
onReachBottom: function () {
// console.log(this.totalPages);
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

}
    6.页面相关事件处理函数--监听用户下拉动作
      onPullDownRefresh: function () {
    // 重置数组
    this.setData({
      goodsList: []
    })
    // 重置页码
    this.QueryParams.pagenum = 1;
    // 发送请求
    this.getGoodsList();
  }
    7.商品列表跳转链接：<navigator></navigator>
    8.商品列表通过组件插槽渲染：全局导航栏组件里使用<slot></slot>
    9.数据返回回来了，立即关闭下拉刷新的窗口：
    wx.stopPullDownRefresh();
    10.前后端获取商品数据进行排序还不会做，主要涉及还要前后端每一页共10条数据，下拉刷新再获取10条。
```

  ### 商品详情模块
```
1.根据goods_id获取后台对应商品详情数据，根据条件获得数据的对象：
this.setData({
  goodsObj:{
    goods_name:goodsObj.goods_name,
    goods_price:goodsObj.goods_price,
    // iphone部分手机不识别webp图片格式
    goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
    pics:goodsObj.pics
  }
})
2.点击轮播图放大预览
handlePreviewImage(e){
// 先构造要预览的图片数组
const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
// 接收传递过来的图片url
const current=e.currentTarget.dataset.url;
wx.previewImage({
  current,
  urls
})

  }
    3.点击加入购物车，本地缓存数组
    handleCartAdd(){
    // 1.获取缓存中的购物车数组
    let cart=wx.getStorageSync('cart')||[];
    // 2.判断当前的商品是否已经存在于购物车
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      // 3.不存在，第一次添加
      this.GoodsInfo.num=1;
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
    4.联系客服API:<button open-type="contact"></button>
    5.分享API：<button open-type="share"></button>
    6.点击购物车跳转链接：
      <navigator open-type="switchTab" url="/pages/cart/index" class="tool_item">
    <view class="iconfont icongouwuche"></view>
    <view>购物车</view>
  </navigator>
    7.渲染文字和渲染富文本
```



  ### 购物车模块
    1.点击收货地址调用，调用全局封装Promise形式的wx.getSetting函数、wx.chooseAddress函数、wx.openSetting函数：
    import { getSetting, chooseAddress, openSetting } from '../../utils/asyncWx.js'
    async handleChooseAddress() {
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
      const address = await chooseAddress();
      // 存入到本地存储中
      wx.setStorageSync('address', address)
      } catch (e) {
      console.log(e);
      }
    }
    2.未完待续