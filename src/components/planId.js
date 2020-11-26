/*
 * @Author: XiaoKang
 * @Date: 2020-11-06 16:29:54
 * @LastEditTime: 2020-11-06 21:29:44
 * @Description: 获取签到的ID
 */
 async function planId(axios) {
  
  let dataForm = {
    paramsType: "student",
  };
  let { data: res } = await axios.request({
    method: "post",
    url: "/practice/plan/v1/getPlanByStu",
    data: dataForm,
  });
  if(res.code==200) {
    console.log("Token可用：planId中的状态码："+res.code+"；planID的值："+res.data[0].planId);
    return res.data.pop().planId;
  }else if(res.code==401){
    console.log("TOKEN过期了")
    return "ERRORTOKEN";
  }else {
    planId(axios);
  }
}
module.exports = planId;
