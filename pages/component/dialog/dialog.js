// pages/component/dialog/dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '弹窗标题'
    },
    content: {
      type: Array,
      value: '弹窗内容'
    },
    numberOfUser:{
      type:String,
      value:'0'
    },
    reson:{
      type:String,
      value:"申请理由"
    },
    cancelText: {
      type: String,
      value: '取消'
    },
    okText: {
      type: String,
      value: '确定'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show:function(){
      this.setData({
        isShow:true
      })
    },
    close:function(){
      this.setData({
        isShow:false
      })
    },
    _cancelEvent:function(){
      this.triggerEvent("cancelEvent")
    },
    _okEvent:function(){
      this.triggerEvent("okEvent")
    },
    checkboxChange:function(e){
      const checked = e.detail.value
      console.log(checked)
      const changed = {}
      for (let i = 0; i < this.data.content.length; i++) {
        if (checked.indexOf(this.data.content[i].name) !== -1) {
          changed['content[' + i + '].checked'] = true
        } else {
          changed['content[' + i + '].checked'] = false
        }
      }
      this.setData(changed)
    },
    bindKeyInput:function(e){
      this.setData({
        numberOfUser: e.detail.value
      })
    },
    bindTextAreaInput:function(e){
      this.setData({
        reson:e.detail.value
      })
    }
  }
})
