//获取应用实例
const app = getApp()

// pages/labDetail/labDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    labDetail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var id = options.id
    wx.request({
      url: app.globalData.base_url + '/api/getLabDetail',
      method:"POST",
      data:{
        id: id
      },
      success:function(res){
        // console.log(res.data.data[0])
        that.setData({
          labDetail: res.data.data[0]
        })
      }
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

  order:function(e){
    wx.navigateTo({
      url: '../../pages/scheduling/scheduling?labId=' + this.data.labDetail.id
    })
  }
})