
/*
 * @Author: KKDLK
 * @Date: 2020-11-16 02:15
 * @LastEditTime: 2020-11-16 02:15:23
 * @Description: 生成主体内容
 */

let huli = require("../context/huli.json")
let dianzixinxi = require("../context/dianzixinxi.json")



// 日报内容生成
/**
 * 
 * @param {从配置中获取专业} config 
 * @param {迭代次数} iterNum 
 */
function contentTxts (config,iterNum){
    try {
      if(iterNum==2){console.log("日报内容生成开始")}else if(iterNum==3){console.log("周报内容生成开始")}else if(iterNum==4){console.log("月报内容生成开始");}
      
      let college = config.LEABLETI;
      console.log("专业是:"+college)
      if (college=="护理"){
          var result  = huli.data
          var texts = "";
          let reslength = result.length
          for (let index = 0; index < iterNum; index++) {
            let resultRandomLength = Math.round(Math.random()*reslength) // 从0~数据长度 角标
            texts += result[resultRandomLength].txt;
            texts += ";";
          }
          if(iterNum==2){console.log("日报内容生成SUCCESS")}else if(iterNum==3){console.log("周报内容生成SUCCESS")}else if(iterNum==4){console.log("月报内容生成SUCCESS");}
          return texts;
      }else if(college=="电子信息"){
          var result  = dianzixinxi.data
          var texts = "";
          let reslength = result.length
          for (let index = 0; index < iterNum; index++) {
            let resultRandomLength = Math.round(Math.random()*reslength) // 从0~数据长度 角标
            texts += result[resultRandomLength].txt;
            texts += ";";
          }
          if(iterNum==2){console.log("日报内容生成SUCCESS")}else if(iterNum==3){console.log("周报内容生成SUCCESS")}else if(iterNum==4){console.log("月报内容生成SUCCESS");}
          return texts;
      }
      console.log("没有内置这个专业")
      return "";
    } catch (error) {
      if(iterNum==2){console.log("日报内容生成异常")}else if(iterNum==3){console.log("周报内容生成异常")}else if(iterNum==4){console.log("月报内容生成异常");}
      contentTxts (config,iterNum)
    }
  }

module.exports = contentTxts;