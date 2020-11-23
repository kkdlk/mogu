
/*
 * @Author: KKDLK
 * @Date: 2020-11-16 02:15
 * @LastEditTime: 2020-11-16 02:15:23
 * @Description: 开始执行日报
 */

let huli = require("../context/huli.json")
let dianzixinxi = require("../context/dianzixinxi.json")

// 查看当前月份的总天数 （最大天数）
function mGetDate(){
  var date = new Date();
  var year = date.getFullYear(); //年
  var month = date.getMonth()+1;
  var d = new Date(year, month, 0);
  return d.getDate();
}     
// 周几当前
function getWeekDate() {
  var now = new Date();
  var day = now.getDay();
  var weeks = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
  var week = weeks[day];
  return week;
}     
//随机两天的休假
function randomDayVacation(){
   let thisDate = new Date(); // 当前时间

   let thisWeekDate = getWeekDate();
   if (thisWeekDate=='星期日'||thisWeekDate=='星期六'){
       return "休假";
   }
   return "上班";
}
// 日报内容生成
function contentTxts (config){
  let college = config.LEABLETI;
  console.log("专业:"+college)
  if (college=="护理"){
      var result  = huli.data
      var txt = "";
      let reslength = result.length
      for (let index = 0; index < 2; index++) {
        let resultRandomLength = Math.round(Math.random()*reslength) // 从0~数据长度 角标
        txt += result[resultRandomLength].txt
      }
      return txt;
  }else if(college=="电子信息"){
      var result  = dianzixinxi.data
      var txt = "";
      let reslength = result.length
      for (let index = 0; index < 2; index++) {
        let resultRandomLength = Math.round(Math.random()*reslength) // 从0~数据长度 角标
        txt += result[resultRandomLength].txt
      }
      return txt;
  }
  return "";
}

// 日报方法
async function daily (axios, planId,config) {
  let thisTime = new Date();

  if (thisTime.getHours() <= 8) {
    let contentTxt = contentTxts(config);

    let title1 = randomDayVacation();
    let dataForm = {
      attachmentList: [],
      attachments: "",
      content: contentTxt, //日报内容
      planId: planId,
      reportType: "day",
      title: title1 //日报标题  上班或休假 每周有2天休假的时间
    }
    console.log("planId:"+planId)

    axios.defaults.baseURL = "https://api.moguding.net:9000";
    // 发送日报签到请求
    let { data: res } = await axios.request({
      method: "post",
      url: "/practice/paper/v1/save",
      data: dataForm,
    });
        if (res.code == 200) {
     return true;
    } else{
      return false;
    }
  } else {
    return false;
  }
}

module.exports = daily;