/*
 * @Author: XiaoKang
 * @Date: 2020-11-06 16:29:54
 * @LastEditTime: 2020-11-06 21:29:53
 * @Description: 登录模块，用于返回登录结果信息
 */
async function login(axios, config) {
  if (config.token) {
    console.log("自行提供Token,");
    return config.token;
  }
  let dataForm = {
    phone: config.phone,
    password: config.password,
    loginType: "iso",
  };

  let { data: res } = await axios.request({
    method: "post",
    url: "/session/user/v1/login",
    data: dataForm,
  });
  if (res.code == 200) {
    // 登录成功
    return res.data.token;
  } else {
    // 登录失败
    return false;
  }
}
module.exports = login;
