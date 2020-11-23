/*
 * @Author: KKDLK
 * @Date: 2020-11-23 02:15
 * @LastEditTime: 2020-11-16 02:15:23
 * @Description: 开始执行周报
 */


let huli = require("../context/huli.json")
let dianzixinxi = require("../context/dianzixinxi.json")
// 周报内容生成
function contentTxts (config){
    let college = config.LEABLETI;
    console.log("weeks:14行 专业是:"+college)
    if (college=="护理"){
        var result  = huli.data
        var txt = "";
        let reslength = result.length
        for (let index = 0; index < 4; index++) {
          let resultRandomLength = Math.round(Math.random()*reslength) // 从0~数据长度 角标
          txt += result[resultRandomLength].txt;
          txt += "   ";
        }
        return txt;
    }else if(college=="电子信息"){
        var result  = dianzixinxi.data
        var txt = "";
        let reslength = result.length
        for (let index = 0; index < 4; index++) {
          let resultRandomLength = Math.round(Math.random()*reslength) // 从0~数据长度 角标
          txt += result[resultRandomLength].txt;
          txt += "   ";
        }
        return txt;
    }
    return "";
  }
  
// 获取当前周的周一或者周天的时间
/**
 * 
 * @param {时间类型，当前时间} date 
 * @param {返回当前时间的周几} n 
 */
function getFirstDayOfWeek (date,n) {
    var day = date.getDay() || 7;
    let weeksDate =  new Date(date.getFullYear(), date.getMonth(), date.getDate() + n - day)
    var year = weeksDate.getFullYear();
    var month = weeksDate.getMonth()+1;
    var date1 = weeksDate.getDate();   
    if (n==1){
        return [year,month,date1].join('-')+" 00:00:00";
    }if (n==7){
        return [year,month,date1].join('-')+" 23:59:59";
    }
    return "";
};
// 当前周几
function getWeekDate() {
    var now = new Date();
    var day = now.getDay();
    var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    var week = weeks[day];
    return week;
  }     
/**
 * 
 * @param {起始时间} start 
 * 调用 
 * var td = TodayInfo("2020/07/20");      
 * console.log("今天是自2020/07/20日，开学以来的第 " + td.week + " 周，今天星期" + td.day);
 */
  function TodayInfo(start) {
    var WEEKLEN = 7, // 一周7天为常量
        WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"],
        weekInfo = {"week": null, "day": null}, // 初始化返回信息，默认第null周，星期null
        oneDay = 24 * 60 * 60 * 1000, // 一天的毫秒时长
        weekLeave, // 开学当天所在周剩余天数
        weekStart, // 开学当天start是星期几
        today, // 今天
        dateDiff, // 今天与开学当天日期差
        sDate; //开学之日，日期对象
    var rDateStr = /\d{4}[\/-]\d{1,2}[\/-]\d{1,2}/g; // 简单的日期格式校验：2013/12/19
    if (!rDateStr.test(start)) {
        console.log("请使用合法的开学日期！！！");
        return weekInfo;
    }
    sDate = new Date(start.replace("-", "/"));
    weekStart = sDate.getDay();
    weekStart = weekStart === 0 ? 7 : weekStart; // JS中周日的索引为0，这里转换为7，方便计算

    weekLeave = WEEKLEN - weekStart;
    today = new Date();
    weekInfo.day = WEEKDAYS[today.getDay()];
    today = new Date(today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate());
    dateDiff = today - sDate;
    if (dateDiff < 0) {
        console.log("别开玩笑了，你还没开学呢！！！");
        return weekInfo;
    }
    dateDiff = parseInt(dateDiff / oneDay);
    weekInfo.week = Math.ceil((dateDiff - weekLeave) / WEEKLEN) + 1;
    return weekInfo;
}

/**
 * 周报提交
 * @param {axios} axios 
 * @param {分类} planId 
 * @param {配置} config 
 */
async function weeks (axios, planId,config) {
    let thisTime = new Date();
    let contentTxt = contentTxts(config); //周报内容

    if (getWeekDate()=="星期日") { 
        if (thisTime.getHours()<=8){ //八点之前为签到成功
            let dataForm = {
                attachmentList: [],
                attachments: "",
                content: contentTxt, //周报内容
                planId: planId,
                reportType: "week",
                title: "第"+(TodayInfo(config.startTimeDate).week)+"周，周报", //周报标题  
                weeks: "第"+(TodayInfo(config.startTimeDate).week)+"周", // 第x周 从startTimeDate开始
                startTime: getFirstDayOfWeek(new Date(),1), // 当前周 开始时间
                endTime: getFirstDayOfWeek(new Date(),7) // 当前周 结束时间
              }
        
            // 发送日报签到请求
            let { data: res } = await axios.request({
                method: "post",
                url: "/practice/paper/v1/save",
                data: dataForm
            });
            if (res.code == 200) {
                return "weekSuccess";
            } 
        }else{
            console.log("当前时间不是月末的8点前，月报不会填写!")
        }
    }else{
        console.log("当前时间不是周末，不写周报哦")
    }
    return "weekError";
}


module.exports = weeks;



