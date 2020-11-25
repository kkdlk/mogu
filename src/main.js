/*
 * @Author: XiaoKang
 * @Date: 2020-11-06 16:27:11
 * @LastEditTime: 2020-11-06 21:15:34
 * @Description: 蘑菇丁签到入口文件
 */
let axios = require("axios");
let login = require("./components/login");
let getPlanId = require("./components/planId");
let save = require("./components/save");
let remind = require("./components/remind");
let daily = require("./components/daily")
let month = require("./components/month")
let weeks = require("./components/weeks")
// 传入运行的参数
var args = process.argv.splice(2);

 for (let index = 0; index < args.length; index++) {
   const element = args[index];
   console.log("参数:"+element)
 }

 if (args.length < 5) {
   console.log("参数传入不正确！");
   return;
 }

// 用户相关配置
let config = {
  // 用户手机号
  phone: args[0],
  // 用户密码
  password: args[1],
  // server酱密钥
  SCKEY: args[2],
  // 用户TOKEN
  token: args[3] || false,
  // 学院  护理 电子信息 
  LEABLETI: args[4],
  // 周报开始时间 2020/11/23  2020/07/20
  STARTTIMEDATE: args[5]
};
let reMindMsg = {
  // 消息标题
  text: "❌ 蘑菇丁签到失败了，请检查 ❌",
  // 消息主体
  desp: "请检查账号密码或Token（如果存在）是否失效。其他问题请联系作者！",
};
const data = new Date();
// 基地址
axios.defaults.baseURL = "https://api.moguding.net:9000";
(async function () {
  // 登录获取TOKEN
  const token = await login(axios, config);
  // 如果TOKEN获取成功
  if (token) {
    axios.defaults.headers.Authorization = token;
    // 获取需要签到的项目 - 最后一项
    const planId = await getPlanId(axios);
                                                          if (planId == "ERRORTOKEN"){
                                                            reMindMsg.desp = `${config.phone}的，TOKEN过期了`
                                                            reMindMsg.text = `${config.phone}的，TOKEN过期了`;
                                                            //       msg ______  发送消息
                                                            await remind(axios, config, reMindMsg);
                                                          }
    // ~~~~~~~~~~~~~~~~~ 每日签到 签到结果
    const result = await save(axios, planId);
    /**
     * 当每日签到成功后进行日报汇报
     */
    if (result) {
      if (result!="OUTTIME"){
        console.log("每日签到成功")
          // ~~~~~~~~~~~~~~~~~日报汇报  返回 daySuccess  dayError
          const dayResult = await daily(axios, planId, config);
          if(dayResult) {
            if(dayResult!="OUTTIME"){
              reMindMsg.text = `🎉 ${data.getFullYear()}年${
                data.getMonth() + 1
              }月${data.getDate()}日 蘑菇丁【${config.phone}的${result}签到、日报】成功啦！ 🎉`;
              reMindMsg.desp = `每日打卡信息：${config.phone}的${result}—日报信息：${dayResult}`;
            }
          }else {
            reMindMsg.text = `🎉 ${data.getFullYear()}年${
              data.getMonth() + 1
            }月${data.getDate()}日 蘑菇丁【${dayResult} ❗️ ❗️ ❗，${result}签到】成功！ 🎉`;
            reMindMsg.desp = `每日打卡信息：${result}—日报信息：${dayResult}`;
          }
            //       msg ______    发送消息
            await remind(axios, config, reMindMsg);
      }
    }else{
      console.log("每日签到失败了")
      reMindMsg.text = `系统异常了，每日签到失败 ❗️ ❗️  ❗️ ❗️  ❗️ ❗️ `;
      reMindMsg.desp = "系统异常了 ❗️ ❗️  ❗️ ❗️  ❗️ ❗️ 每日签到失败";
       //       msg ______    发送消息
       await remind(axios, config, reMindMsg);
    }

    //~~~~~~~~~~~~~~~~~ 月报汇报结果
    const monthResult = await month(axios,planId,config)
    if (monthResult){ //返回true
      if (monthResult !="ErrorTimeOut") { //在时间范围内并且返回true 就提示成功
        reMindMsg.text = `🎉 ${data.getFullYear()}年${
          data.getMonth() + 1
        }月${data.getDate()}日 蘑菇丁【${config.phone}的${monthResult}】成功！ 🎉`;
        reMindMsg.desp = `${config.phone}的${monthResult}`;
        //       msg ______    发送消息
        await remind(axios, config, reMindMsg);
      }
    }else{
      reMindMsg.text = `🎉 ${data.getFullYear()}年${
        data.getMonth() + 1
      }月${data.getDate()}日 蘑菇丁【${config.phone}的${monthResult}】❗️ ❗️ ❗️ ❗️ 🎉`;
      reMindMsg.desp = `${monthResult}❗️ ❗️ ❗️ ❗️`;
      //       msg ______    发送消息
       await remind(axios, config, reMindMsg);
    }
    

   
    //~~~~~~~~~~~~~~~~~ 周报汇报结果
    const weeksResult = await weeks(axios,planId,config)
    if(weeksResult){
        if(weeksResult!="OUTTIME"){
          reMindMsg.text = `🎉 ${data.getFullYear()}年${
            data.getMonth() + 1
          }月${data.getDate()}日 蘑菇丁【${config.phone}的${weeksResult}】 🎉`;
          reMindMsg.desp = `${config.phone}的${weeksResult}`;
          //       msg ______    发送消息
          await remind(axios, config, reMindMsg);
        }
    }else{
      reMindMsg.text = `🎉 ${data.getFullYear()}年${
        data.getMonth() + 1
      }月${data.getDate()}日 蘑菇丁【${config.phone}的${weeksResult} ❗️ ❗️ ❗️ ❗️  】 🎉`;
      reMindMsg.desp = `${config.phone}的${weeksResult}`;
      //       msg ______    发送消息
      await remind(axios, config, reMindMsg);
    }

    return true;
  } else {
    return;
  }
})();
