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
// 传入运行的参数
var args = process.argv.splice(2);
for (const key in args) {
   console.log("参数"+key)
}
if (args.length < 4) {
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
  // 用户分类 
  LEABLETI: args[4]
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

    // 签到结果
    const result = await save(axios, planId);
    /**
     * 当每日签到成功后进行日报汇报
     */
    if (result) {
       // 日报汇报
      const dayResult = await daily(axios, planId, config);
      // 日报汇报成功
      if (dayResult) {
        reMindMsg.text = `🎉 ${data.getFullYear()}年${
          data.getMonth() + 1
        }月${data.getDate()}日 蘑菇丁「日报☀️和每日签到📆」打卡成功啦！ 🎉`;
        reMindMsg.desp = "恭喜你蘑菇丁「日报和每日签到」打卡成功了！";
        // 发送消息
        let msg = await remind(axios, config, reMindMsg);
        console.log(msg);
      } else {
        reMindMsg.text = `🎉 ${data.getFullYear()}年${
          data.getMonth() + 1
        }月${data.getDate()}日 蘑菇丁「打卡签到📆」成功啦！❗️ ❗️ ❗️ 日报需要自己写了❗️ ❗️ ❗️ ❗️  🎉`;
        reMindMsg.desp = "恭喜你蘑菇丁「打卡签到📆」成功了！❗️ ❗️ ❗️ 日报需要自己写了❗️ ❗️ ❗️ ❗️ ";
         // 发送消息
         let msg = await remind(axios, config, reMindMsg);
         console.log(msg);
      }
    }else{
      reMindMsg.text = `系统异常了 ❗️ ❗️  ❗️ ❗️  ❗️ ❗️ `;
      reMindMsg.desp = "系统异常了 ❗️ ❗️  ❗️ ❗️  ❗️ ❗️";
       // 发送消息
       let msg = await remind(axios, config, reMindMsg);
       console.log(msg);
    }
    return true;
  } else {
    return;
  }
})();
