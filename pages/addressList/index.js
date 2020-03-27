// 引入utils函数
import { showModal } from '../../utils/asyncWx.js'
// 引入发送请求的Promise函数
import { request } from '../../request/index.js'
// 引入支持async await文件
import regeneratorRuntime from '../../lib/runtime/runtime.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let arr = wx.getStorageSync('addressList') || [];
    let userAddress = wx.getStorageSync('address');
    let userArr = new Array(userAddress);
    let userArr1 = userArr.map(v => {
      return{
        consignee:v.userName,
        mobile : v.telNumber,
        address : v.all,
        transportDay : "周一至周五收货"
      }
    })
    // console.log(userArr1);
    let c=userArr1.concat(arr);
    // 更新数据  
    this.setData({
      addressList: c
    });
  },
  addAddress: function () {
    wx.navigateTo({ url: '/pages/address/index' });
  },
  /* 删除地址 */
  async delAddress(e) {
    let { addressList } = this.data;
    let { id } = e.currentTarget.dataset;
    const res = await showModal({ content: "您确定删除地址吗？" });
    if (res.confirm) {
      addressList.splice(id, 1);
      wx.setStorageSync('addressList', addressList);
      this.setData({
        addressList
      })
    }
  }
})