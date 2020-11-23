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
  // 周报开始时间 2020/11/23
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
    //~~~~~~~~~~~~~~~~~ 周报汇报结果
    const weeksResult = await weeks(axios,planId,config)
    if (weeksResult=="weekSuccess"){
      reMindMsg.text = `🎉 ${data.getFullYear()}年${data.getMonth() + 1}月${data.getDate()}日 
        蘑菇丁「月报汇报」打卡成功啦！ 🎉`;
        reMindMsg.desp = "恭喜你蘑菇丁「周报汇报」打卡成功了！";
        //       msg ______  发送消息
        let msg = await remind(axios, config, reMindMsg);
    }else {
        reMindMsg.text = `🎉 ${data.getFullYear()}年${data.getMonth() + 1}月${data.getDate()}日 
        蘑菇丁「周报汇报」打卡失败！❗️ ❗️`;
        reMindMsg.desp = "蘑菇丁「周报汇报」打卡失败！❗️ ❗️";
          //       msg ______  发送消息
        let msg = await remind(axios, config, reMindMsg);
    }


    //~~~~~~~~~~~~~~~~~ 月报汇报结果
    const monthResult = await month(axios,planId,config)
    if (monthResult=="monthSuccess"){
      reMindMsg.text = `🎉 ${data.getFullYear()}年${data.getMonth() + 1}月${data.getDate()}日 
        蘑菇丁「月报汇报」打卡成功啦！ 🎉`;
        reMindMsg.desp = "恭喜你蘑菇丁「月报汇报」打卡成功了！";
        //       msg ______  发送消息
        let msg = await remind(axios, config, reMindMsg);
    }else {
      reMindMsg.text = `🎉 ${data.getFullYear()}年${data.getMonth() + 1}月${data.getDate()}日 
      蘑菇丁「月报汇报」打卡失败！❗️ ❗️`;
      reMindMsg.desp = "蘑菇丁「月报汇报」打卡失败！❗️ ❗️";
      //       msg ______  发送消息
      let msg = await remind(axios, config, reMindMsg);
    }
    // ~~~~~~~~~~~~~~~~~ 签到结果
    const result = await save(axios, planId);
    /**
     * 当每日签到成功后进行日报汇报
     */
    if (result) {
       // ~~~~~~~~~~~~~~~~~日报汇报  返回 daySuccess  dayError
      const dayResult = await daily(axios, planId, config);
      // ____日报汇报成功
      if (dayResult=="daySuccess") {
        reMindMsg.text = `🎉 ${data.getFullYear()}年${data.getMonth() + 1}月${data.getDate()}日 
        蘑菇丁「日报☀️和每日签到 📆 」打卡成功啦！ 🎉`;
        reMindMsg.desp = "恭喜你蘑菇丁「日报和每日签到」打卡成功了！";
        //       msg ______  发送消息
        let msg = await remind(axios, config, reMindMsg);
        console.log(msg);
        // ____日报超过8点
      } else if (dayResult=="dayOverTime"){
        reMindMsg.text = `🎉 ${data.getFullYear()}年${data.getMonth() + 1}月${data.getDate()}日
        蘑菇丁「打卡签到📆」成功啦！超过八点了🎉`;
        reMindMsg.desp = "恭喜你蘑菇丁「打卡签到📆」成功了！超过八点了，如果前面没有收到签到日报成功消息，请手动查看蘑菇丁！";
         //       msg ______   发送消息
         let msg = await remind(axios, config, reMindMsg);
         console.log(msg);
      } else {
        // ____失败了
        reMindMsg.text = `🎉 ${data.getFullYear()}年${data.getMonth() + 1}月${data.getDate()}日
        蘑菇丁「打卡签到📆」失败了啦！❗️ ❗️  ❗️ ❗️  ❗️ ❗️`;
        reMindMsg.desp = "❗️ ❗️  ❗️ ❗️  ❗️ ❗️签到失败了";
         //       msg ______   发送消息
         let msg = await remind(axios, config, reMindMsg);
         console.log(msg);
      }
    }else{
      reMindMsg.text = `系统异常了 ❗️ ❗️  ❗️ ❗️  ❗️ ❗️ `;
      reMindMsg.desp = "系统异常了 ❗️ ❗️  ❗️ ❗️  ❗️ ❗️";
       //       msg ______    发送消息
       let msg = await remind(axios, config, reMindMsg);
       console.log(msg);
    }
    return true;
  } else {
    return;
  }
})();
