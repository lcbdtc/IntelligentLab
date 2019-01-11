// pages/choiceReserve/choiceReserve.js
const app = getApp()
var year = new Date().getFullYear()
var curDate = ""
var weeksArray = []; //表格排班数据
Page({

  /**
   * 页面的初始数据
   */
  data: {
    labId: 0,
    content: [], //页面加载之后的预约情况
    curDate: "",
    reservedCount: 0,
    changedItem: [], //预约之后的情况
    reservedItem: [], //本身已经预约的情况
    // curContent:[],//用户选择预约，即变动之后的情况
    numberOfUser: 0,
    reson: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let count = 0
    let reservedItem = []
    for (var contentItem of JSON.parse(options.content)) {
      if (contentItem.checked == true) {
        reservedItem.push(contentItem.name)
        count++;
      }
    }
    this.setData({
      labId: parseInt(options.labId),
      content: JSON.parse(options.content),
      reservedCount: count,
      reservedItem: reservedItem,
      curDate: options.curDate
      // curContent: JSON.parse(options.content)
    })
  },
  bindKeyInput: function(e) {
    this.setData({
      numberOfUser: e.detail.value != "" ? parseInt(e.detail.value) : 0
    })
  },
  bindTextAreaInput: function(e) {
    this.setData({
      reson: parseInt(e.detail.value)
    })
  },
  checkboxChange: function(e) {
    const checked = e.detail.value
    this.setData({
      changedItem: checked
    })
    // var changed = this.data.changedItem
    // if(checked.length > this.data.reservedCount){//如果激活一个checkbox
    //   changed.push(checked[checked.length - 1])
    // }else{
    //   changed.pop()
    // }
    // this.setData({
    //   reservedItem: changed
    // })
    // console.log(this.data.changedItem)

    // for (let i = 0; i < this.data.content.length; i++) {
    //   if (checked.indexOf(this.data.content[i].name) !== -1) {
    //     changed[i] = true
    //   } else {
    //     changed[i] = false
    //   }
    // }
    // console.log(changed)
    // this.setData({
    //   curContent: changed
    // })

  },
  tapOk: function() {
    var that = this
    if (that.data.numberOfUser == 0 || that.data.reson == "") {
      wx.showToast({
        title: '您没有填写预约人数或者申请理由',
        icon: 'none',
        duration: 2000
      })
    } else {
      let time_obj = {
        "第一节": "01",
        "第二节": "02",
        "第三节": "03",
        "第四节": "04",
        "第五节": "05",
        "第六节": "06",
        "第七节": "07",
        "第八节": "08",
        "第九节": "09",
        "第十节": "10"
      }
      let changedItemLength = that.data.changedItem.length
      let reservedItemLength = that.data.reservedItem.length
      let derta = changedItemLength - reservedItemLength
      let reserveNew = []
      let retReserve = []
      if (derta > 0) {
        for (let i = 1; i <= derta; i++) {
          // console.log(that.data.changedItem[reservedItemLength - 1 + i])
          reserveNew.push(that.data.changedItem[reservedItemLength - 1 + i])
        }
        for (var item of reserveNew) {
          // console.log(time_obj[item])
          retReserve.push(time_obj[item])
        }
        // console.log(retReserve)
      } else {
        wx.showToast({
          title: '您并没有进行预约',
          icon: 'none',
          duration: 2000
        })
      }

      wx.request({
        url: app.globalData.base_url + '/api/changeReserve',
        method: "POST",
        data: {
          username: app.globalData.userInfo.nickName,
          labId: that.data.labId,
          date: year + "-" + that.data.curDate,
          retReserve: retReserve,
          numberOfUser: that.data.numberOfUser,
          reson: that.data.reson
        },
        success: function(res) {
          if (res.data.retcode == 0) {
            wx.showToast({
              title: '预约成功',
              // duration: 2,
              // mask: true,
              success: function(res) {
                console.log("success")
                wx.navigateBack({})
              },
              fail: function(res) {},
              complete: function(res) {},
            })
          }
        }
      })
    }
  },
  tapCancel: function() {
    wx.navigateBack({})
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})