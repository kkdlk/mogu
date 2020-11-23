/*
 * @Author: XiaoKang
 * @Date: 2020-11-06 16:29:54
 * @LastEditTime: 2020-11-06 23:09:21
 * @Description: 开始执行签到
 */
//打卡类型  上班或者下班 
function saveType () {
  var date = new Date();
  let type = "START";
  if (date.getHours() >= 15) {
    type = "END";
  }
  console.log(date.getHours());
  return type;
}

// 签到方法
async function save (axios, planId) {
  let type = saveType();
    /*
  let dataForm = {
    device: "iOS",
    planId: planId,
    country: "中国",
    state: "NORMAL",
    attendanceType: "",
    address: "西安市第四医院",
    type: type,
    longitude: "109.024177",
    city: "新城区",
    province: "西安市",
    latitude: "34.256022",
  };
 */

  let dataForm = {
    device: "iOS",
    planId: planId,
    country: "中国",
    state: "NORMAL",
    attendanceType: "",
    address: "咸阳职业技术学院",
    type: type,
    longitude: "108.74309",
    city: "秦都区",
    province: "咸阳市",
    latitude: "34.304881",
  };
  
  console.log("Type:", type);
  // 发送签到请求
  let { data: res } = await axios.request({
    method: "post",
    url: "/attendence/clock/v1/save",
    data: dataForm,
  });
  
  let msg = false;
  if (res.code == 200) {
    // 签到成功
    msg = type === "START" ? "上班" : "下班";
  }
  return msg;
}
module.exports = save;
