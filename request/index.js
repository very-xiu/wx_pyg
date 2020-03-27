// 同时发送异步代码次数
let ajaxTimes=0;

export const request=(params)=>{
  // 判断url中是否带有"/my/"，请求的是私有路径，带上header token
  let header={...params.header};
  if(params.url.includes("/my/")){
    // 拼接header带上token
    header["Authorization"]=wx.getStorageSync('token');
  }

  ajaxTimes++;
  // 显示加载中效果
  wx.showLoading({
    title:'加载中',
    mask:true //用户无法操作，蒙版把操作手势挡住了
  })
  // 定义公共的url
  const baseUrl='https://api-hmugo-web.itheima.net/api/public/v1'
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      header,
      url:baseUrl+params.url,
      success:result=>{
        resolve(result.data.message);
      },
      fail:err=>{
        reject(err);
      },
      // 不管成功或者失败都会触发的函数
      complete:()=>{
        ajaxTimes--;
        if(ajaxTimes===0){
          // 关闭正在等待的图标
          wx.hideLoading();
        }
      }
    })
  })
}