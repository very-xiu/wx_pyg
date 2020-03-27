// components/UpImg/UpImg.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      type: String,
      value: ""
    },
    dataIndex: {
      type: Number,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击事件
    handleRemoveUpImg() {
      // console.log(e)
      // 获取点击索引
      // const { index } = e.currentTarget.dataset;
      // 触发父组件中的事件，自定义
      this.triggerEvent('upImgChange');
    }
  }
})
