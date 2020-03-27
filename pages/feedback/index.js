/* 
  点击"+"号按钮触发tap点击事件
    1.调用小程序内置的选择图片API
    2.获取到图片的路径，保存到数组
    3.把图片路径存到data的变量中
    4.页面就可以根据图片数组进行循环显示，自定义组件
*/
/* 
  点击删除图标
    1.获取被点击的元素索引
    2.获取data中图片数组
    3.根据索引，删除数组中对应的元素
    4.把数组重新设置回data中
*/
/* 
  用户点击提交
    1.获取文本域的内容
      1.data中定义变量，表示输入框的内容
      2.文本域绑定输入事件，事件触发的时候，把输入框的值存入到变量中
    2.对这些内容合法性进行验证
    3.验证通过，用户选择的图片上传到专门的图片服务器，返回图片外网的链接
      1.遍历图片数组
      2.挨个上传
      3.自己再维护图片数组，存放图片上传后的外网链接
    4.文本域和外网的图片路径一起提交到服务器，前端模拟，没有后台接口
    5.清空当前页面
    6.返回上一页
*/

// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品、商家投诉',
        isActive: false
      }
    ],
    // 被选中的图片路径数组
    chooseImgs: [],
    // 文本域的内容
    textVal: ""
  },
  // 外网的图片路径数组
  UpLoadImgs: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  // 点击"+"选择图片事件
  handleChooseImg() {
    // 调用小程序内置的选择图片API
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: (res) => {
        this.setData({
          // 图片数组进行拼接
          chooseImgs: [...this.data.chooseImgs, ...res.tempFilePaths]
        })
      }
    })
  },
  // 点击删除图标来删除图片
  handleRemoveImg(e) {
    // 获取被点击的组件索引
    const { index } = e.currentTarget.dataset;
    // 获取data中的图片数组
    let { chooseImgs } = this.data;
    // 删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },
  // 文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 提交按钮的点击事件
  handleFormSubmit() {
    // 获取文本域的内容
    const { textVal, chooseImgs } = this.data;
    // 合法性验证
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: "输入不合法！",
        icon: 'none',
        mask: true
      })
      return;
    }
    wx.showLoading({
      title:"正在上传中",
      mask:true
    })
    // 判断有没有需要上传的图片数组
    if(chooseImgs.length !=0){
      // 准备上传图片到专门的图片服务器
      // 上传文件的api不支持多个文件同时上传，遍历数组，挨个上传
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          //图片要上传到哪里
          url: 'https://images.ac.cn/Home/Index/UploadAction',
          //被上传的文件路径
          filePath: v, 
          // 上传的文件名称，后台用来获取文件
          name: 'file',
          // 设置请求的 header
          // header: {}, 
          // HTTP 请求中其他额外的 form data
          formData: {}, 
          success: (res)=>{
            // console.log(res);
            // let url=JSON.parse(res.data).url;
            // this.UpLoadImgs.push(url);
            // 所有图片都上传完毕了才触发
            if(i===chooseImgs.length-1){
              // 这里有意见反馈后台接口就用后台接口
              console.log("把文本的内容和外网的图片数组提交到后台中");
              // 提交都成功了，重置页面
              this.setData({
                textVal:"",
                chooseImgs:[]
              })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1 // 回退前 delta(默认为1) 页面
              })
            }
          },
          fail:err=>{
            wx.hideLoading();
             // 返回上一个页面
             wx.navigateBack({
              delta: 1 // 回退前 delta(默认为1) 页面
            })
          }
        })
      })
    }else{
      // 这里有意见反馈后台接口就用后台接口
      console.log('只是提交了文本');
      wx.hideLoading();
      // 返回上一个页面
      wx.navigateBack({
        delta: 1 // 回退前 delta(默认为1) 页面
      })
    }
  }
})