
/*
 * @Author: KKDLK
 * @Date: 2020-11-23 02:15
 * @LastEditTime: 2020-11-16 02:15:23
 * @Description: 开始执行月报
 */


let huli = require("../context/huli.json")
let dianzixinxi = require("../context/dianzixinxi.json")




// 日报内容生成
function contentTxts (config){
    let college = config.LEABLETI;
    console.log("month:19行 专业是:"+college)
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
// 当前月份最大天数
function mGetDate(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var d = new Date(year, month, 0);
    return d.getDate();
} 
/**
 * 月报提交
 * @param {axios} axios 
 * @param {分类} planId 
 * @param {配置} config 
 */
async function months (axios, planId,config) {

    let thisTime = new Date();
    let monthTitle = (thisTime.getFullYear())+"年"+(thisTime.getMonth()+1)+"月"+",月报。" //拼接月报标题 格式：2020年11月,月报。
    let contentTxt = contentTxts(config) //月报内容
    let monthNum = mGetDate(); //当月最大天数
    if (monthNum==thisTime.getDate()) { //当前月份最大天数等于现在天数 代表是月末
        if (thisTime.getHours()<=8){  //月末的8点和8点前 月报
            let dataForm = {
                attachmentList: [],
                attachments: "",
                content: contentTxt, //月报内容
                planId: planId,
                reportType: "month",
                title: monthTitle //月报标题  上班或休假 每周有2天休假的时间
              }
            // 发送日报签到请求
            let { data: res } = await axios.request({
                method: "post",
                url: "/practice/paper/v1/save",
                data: dataForm,
            });
            if (res.code == 200) {
                return "monthSuccess";
            } 
        }else{
            console.log("当前时间不是月末的8点前，月报不会填写!")
        }
    }else{
        console.log("当前时间不是月末，不写月报哦")
    }
    return "monthError"
}



module.exports = months;
