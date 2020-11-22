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
// 传入运行的参数
var args = process.argv.splice(2);
if (args.length < 3) {
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
    if (result) {
      reMindMsg.text = `🎉 ${data.getFullYear()}年${
        data.getMonth() + 1
      }月${data.getDate()}日 蘑菇丁签到成功啦！ 🎉`;
      reMindMsg.desp = "恭喜你蘑菇丁签到成功了！";
    }
    let msg = await remind(axios, config, reMindMsg);
    // 日报结果
    const result1 = await daily(axios, planId);
    if (result1) {
      reMindMsg.text = `🎉 ${data.getFullYear()}年${
        data.getMonth() + 1
      }月${data.getDate()}日 蘑菇丁日报打卡成功啦！ 🎉`;
      reMindMsg.desp = "恭喜你蘑菇丁日报打卡成功了！";
    }
    let msg = await remind(axios, config, reMindMsg);
    console.log(msg);
    return true;
  } else {
    return;
  }
})();
