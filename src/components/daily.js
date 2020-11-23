
/*
 * @Author: KKDLK
 * @Date: 2020-11-16 02:15
 * @LastEditTime: 2020-11-16 02:15:23
 * @Description: 开始执行日报
 */


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
function contentTxts (config,axios){
  let college = config.LEABLETI;

  if (college=="护理"){
    axios.get("../context/huli.json").then(response =>{
      var result = response.data.data;
      var txt = "";
      let reslength = result.length
      for (let index = 0; index < 2; index++) {
        let resultRandomLength = Math.round(Math.random()*reslength) // 从0~数据长度 角标
        txt += result[resultRandomLength]
      }
      return txt;
    })
  }else if(college=="电子信息"){
    axios.get("../context/dianzixinxi.json").then(response =>{
      var result = response.data.data;
      var txt = "";
      let reslength = result.length
      for (let index = 0; index < 2; index++) {
        let resultRandomLength = Math.round(Math.random()*reslength) // 从0~数据长度 角标
        txt += result[resultRandomLength]
      }
      return txt;
    })
  }
  return "";
}

// 日报方法
async function daily (axios, planId,config) {

  let contentTxt = contentTxts(config,axios);

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
   // 发送日报签到请求
    let { data: res } = await axios.request({
      method: "post",
      url: "/practice/paper/v1/save",
      data: dataForm,
    });

    let msg = false;
    if (res.code == 200) {
       // 日报成功
      msg = '日报打卡成功'
    }
    return msg;
}

module.exports = daily;