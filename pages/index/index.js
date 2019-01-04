//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    categories: [], //教学楼类别
    activeCategoryId: 0,  //正在点击的教学楼id
    labs:[],  //实验室数据
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    loadingMoreHidden:true, //是否能加载更多
    curPage: 1,  //当前页数
    pageSize: 20 //一页的数据量
  },
  onLoad: function () {
    var that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {

      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //获取教学楼类型
    wx.request({ 
      url: app.globalData.base_url + "/api/getBuildingList",
      method:'GET',
      header: {
        "Content-Type":"application/json"
      },
      success:function(res){
        if (res.data.retcode == 0){
          let categories = []
          for (let category of res.data.data){
            categories.push(category)
          }
          that.setData({
            categories: categories,
            activeCategoryId: 0,
            curPage: 1
          })
        }
        that.getLabsList(that.data.activeCategoryId);        
      }
    })
  },
  //获取用户信息
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onGotUserInfo(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
  },
  //点击制定教学楼
  tabClick:function(e){
    this.setData({
      activeCategoryId: e.currentTarget.id
    });
    this.getLabsList(this.data.activeCategoryId);
  },

  //获取教学楼对应的所有实验室
  getLabsList: function (categoryId,append){
    var that = this
    wx.showLoading({
      title: 'Loading',
      mask:true
    })
    wx.request({
      url: app.globalData.base_url + '/api/getLabsList',
      method:'POST',
      data:{
        id: categoryId,
        // page:this.data.curPage,
        // pagsSize:this.data.pageSize
      },
      success:function(res){
        wx.hideLoading()
        if(res.data.retcode == 0){
          let labs = []
          if(append){
            labs = that.data.labs
          }
          for(let lab of res.data.data){
            labs.push(lab)
          }
          that.setData({
            labs:labs
          })
        }else{
          that.setData({
            loadingMoreHidden:false
          })
          return
        }
      },
      error:function(error){

      }
    })
  },

  getLabDetail:function(e){
    wx.navigateTo({
      url: '../../pages/labDetail/labDetail?id=' + e.currentTarget.id,
    })
  },
  //立即预约
  order: function () {
    wx.navigateTo({
      url: '../../pages/scheduling/scheduling',
    })
  },

  //到最底端
  onReachBottom:function(){
    this.setData({
      curPage:this.data.curPage + 1
    })
    this.getLabsList(this.data.activeCategoryId, true)
  }
})
