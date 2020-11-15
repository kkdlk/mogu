/*
 * @Author: XiaoKang
 * @Date: 2020-11-06 16:29:54
 * @LastEditTime: 2020-11-06 21:02:29
 * @Description: 提醒模块
 */

async function reMind(axios, config, reMindMsg) {
  axios.defaults.baseURL = `https://sc.ftqq.com/${config.SCKEY}.send`;
  let { data: res } = await axios.request({
    method: "post",
    data: `text=${reMindMsg.text}&desp=${reMindMsg.desp}`,
  });
  let msg = "";
  if (res.errno == 0) {
    msg = "发送提醒成功！";
  } else {
    msg = "发送提醒失败！" + res.errmsg;
  }
  return msg;
}
module.exports = reMind;
