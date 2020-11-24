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
  console.log("planid："+res.data.pop().planId)
  if(res.code==200) {
    return res.data.pop().planId;
  }
  return planId(axios);
}
module.exports = planId;
