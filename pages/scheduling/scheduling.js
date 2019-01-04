// pages/scheduling/scheduling.js
var util = require('../../utils/util.js');
Date.prototype.AddDays = function(days) {
  var ret = new Date();
  ret.setTime(this.getTime() + days * 24 * 60 * 60 * 1000);
  return ret;
};
var weeksArray = []; //表格排班数据
var weekMonday; //每周的星期一
Page({
  data: {
    weekInfo: [],
    weekIndex: 0,
    dateArray: [],
    sch_list: {
      time_arr: ["第一节", "第二节", "第三节", "第四节", "第五节", "第六节", "第七节", "第八节", "第九节", "第十节"],
      arr_1: [0, 0, 1, 1, 0, 0, 0],
      arr_2: [0, 1, 0, 1, 0, 0, 1],
      arr_3: [1, 0, 1, 0, 0, 0, 1],
      arr_4: [0, 1, 1, 1, 0, 0, 1],
      arr_5: [0, 1, 0, 1, 0, 0, 1],
      arr_6: [1, 1, 0, 1, 0, 0, 1],
      arr_7: [0, 0, 1, 1, 0, 0, 1],
      arr_8: [0, 1, 1, 1, 0, 0, 1],
      arr_9: [1, 1, 1, 1, 0, 0, 1],
      arr_10: [0, 1, 1, 1, 0, 0, 1],
    }
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      weekIndex: e.detail.value,
    })
    let year = new Date().getFullYear()
    let firstDayOfYear = new Date(year, 0, 1)
    let monday = firstDayOfYear.getDay() == 1 ? firstDayOfYear : firstDayOfYear.AddDays(8 - (firstDayOfYear.getDay() == 0 ? 7 : firstDayOfYear.getDay()))
    weekMonday = this.data.weekIndex == 0 ? monday : monday.AddDays(7 * this.data.weekIndex) //获取对应周的星期一
    let daysArray = getSevenDays(weekMonday)
    this.setData({
      dateArray: daysArray
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let weekInfo = getSelectDate();
    let currentDate = new Date();
    weekMonday = currentDate.getDay() == 1 ? currentDate : currentDate.AddDays(1 - (currentDate.getDay() == 0 ? 7 : currentDate.getDay()))
    let daysArray = getSevenDays(weekMonday);
    let numOfWeek = getWeekOfYear();
    this.setData({
      weekInfo: weekInfo,
      dateArray: daysArray,
      weekIndex: numOfWeek - 1
    })
  },
  nextToWeek: function() {
    weekMonday = weekMonday.AddDays(7)
    weekMonday = weekMonday.getDay() == 1 ? weekMonday : weekMonday.AddDays(8 - (weekMonday.getDay() == 0 ? 7 : weekMonday.getDay()))
    let daysArray = getSevenDays(weekMonday);
    this.setData({
      dateArray: daysArray,
      weekIndex: this.data.weekIndex + 1
    })
  },
  lastToWeek: function() {
    weekMonday = weekMonday.AddDays(-7)
    weekMonday = weekMonday.getDay() == 1 ? weekMonday : weekMonday.AddDays(8 - (weekMonday.getDay() == 0 ? 7 : weekMonday.getDay()))
    let daysArray = getSevenDays(weekMonday);
    this.setData({
      dateArray: daysArray,
      weekIndex: this.data.weekIndex - 1
    })
  },
  thisToWeek: function() {
    let currentDate = new Date();
    weekMonday = currentDate.getDay() == 1 ? currentDate : currentDate.AddDays(1 - (currentDate.getDay() == 0 ? 7 : currentDate.getDay()))
    let daysArray = getSevenDays(weekMonday)
    let numOfWeek = getWeekOfYear();
    this.setData({
      dateArray: daysArray,
      weekIndex: numOfWeek - 1
    })
  }
})
//获取select的内容
var getSelectDate = function() {
  let year = new Date().getFullYear()
  let firstDayOfYear = new Date(year, 0, 1);
  let monday = firstDayOfYear.getDay() == 1 ? firstDayOfYear : firstDayOfYear.AddDays(8 - (firstDayOfYear.getDay() == 0 ? 7 : firstDayOfYear.getDay())); //获取一年的第一个星期一
  let i = 1;
  var weekInfo = []
  while (monday.getFullYear() == year) {
    let span = (new Date().getTime()) - monday.getTime();
    var data = {
      weekItem: year + '年第' + (i) + '周（' + util.formatMd(monday) + '—' + util.formatMd(monday.AddDays(6)) + '）',
    }
    i++;
    weekInfo.push(data)
    monday = monday.AddDays(7);
  }
  return weekInfo;
}

//获取weekMonday开始的周一到周日
var getSevenDays = function(Monday) {
  let daysArray = [];
  let dayDict = {};
  let weekStr = '';
  let weekNum = '';
  let seconds = weekMonday.getTime()
  let date = new Date(seconds); //每周的第一天
  let newDate = date;

  for (let i = 0; i < 7; i++) {
    newDate.setDate(date.getDate());
    let m = (newDate.getMonth() + 1) < 10 ? "0" + (newDate.getMonth() + 1) : (newDate.getMonth() + 1);
    let d = newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();

    let time = newDate.getFullYear() + "-" + m + "-" + d;
    let dayStr = m + "-" + d;

    if (getWeekByDay(time) == '周一') {
      weekNum = 0;
    } else if (getWeekByDay(time) == '周二') {
      weekNum = 1;
    } else if (getWeekByDay(time) == '周三') {
      weekNum = 2;
    } else if (getWeekByDay(time) == '周四') {
      weekNum = 3;
    } else if (getWeekByDay(time) == '周五') {
      weekNum = 4;
    } else if (getWeekByDay(time) == '周六') {
      weekNum = 5;
    } else if (getWeekByDay(time) == '周日') {
      weekNum = 6;
    }
    dayDict = {
      "date_text": dayStr,
      "weekName": getWeekByDay(time),
      "weekNum": weekNum
    };
    date.setDate(date.getDate() + 1);
    daysArray.push(dayDict);
  }
  weeksArray = daysArray;
  return daysArray;
}

//获取星期几
var getWeekByDay = function(dayValue) {
  var day = new Date(Date.parse(dayValue.replace(/-/g, '/'))); //将日期值格式化  
  var today = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六"); //创建星期数组  
  return today[day.getDay()]; //返一个星期中的某一天，其中0为星期日  
}

//获取当前日期是今年的第几周
var getWeekOfYear = function() {
  let today = new Date()
  let firstDay = new Date(today.getFullYear(), 0, 1)
  let dayOfWeek = firstDay.getDay();
  let spendDay = 1;
  if (dayOfWeek != 0) {
    spendDay = 7 - dayOfWeek + 1;
  }
  firstDay = new Date(today.getFullYear(), 0, 1 + spendDay);
  var d = Math.ceil((today.valueOf() - firstDay.valueOf()) / 86400000);
  var result = Math.ceil(d / 7);
  return result + 1;
}