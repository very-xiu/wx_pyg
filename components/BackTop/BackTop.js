// components/BackTop/BackTop.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    backTopValue: {
      type: Boolean,
      value: false
    },
    backTopPosition:{
      type:String,
      value:20
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
    handleBackTop(){
      this.triggerEvent('handleBackTop');
    }
  }
})
