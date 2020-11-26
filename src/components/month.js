
/*
 * @Author: KKDLK
 * @Date: 2020-11-23 02:15
 * @LastEditTime: 2020-11-16 02:15:23
 * @Description: 开始执行月报
 */


let contextTexts = require("../components/contextText")



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
    let contentTxt = contextTexts(config,4) //月报内容
   // let monthNum = mGetDate(); //当月最大天数
    if (thisTime.getDate()==1&&(thisTime.getHours()<=8&&thisTime.getHours()>=6)) { // 月末的6点-8点之间
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
                return "月报填写成功";
            }
    }else{
        console.log("当前时间不是月初，不写月报哦")
        return "ErrorTimeOut"
    }
    return false;
}



module.exports = months;
