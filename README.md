## 声明
项目在小康的开源项目上修改而来、小康的网站：xiaokang.me

蘑菇丁自动登录，自动签到，日报，周报，月报填写

优化了信息提示模块；

添加了Token过期，自动签到，自动生成日报信息，自动生成周报信息，自动生成月报信息，等模块

添加了各个模块的注解，和简单异常的处理
---------------------------------
## 相关参数和注意事项

````
PHONE :手机号  
PASSWORD：密码  
SCKEY：Server酱的key:http://sc.ftqq.com/3.version
TOKEN: 蘑菇丁token
LEABLETI：专业，护理、JAVA、学前教育、C#、测试、药学、初等教育、物流管理、会计、
STARTTIMEDATE：开始签到的第一天的时间日期，格式：2020/11/23   2020/07/20
Sava.js中添加了两个地址，咸职和第四人民医院的地址
在线经纬度获取：http://www.daquan.la/jingwei/
sava中：longitude经度，latitude纬度
````

---------------------------------

## 静态配置的Jenkinsfile

````
pipeline {
  agent any
  stages {
    stage('检出') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: GIT_BUILD_REF]],
          userRemoteConfigs: [[
            url: GIT_REPO_URL,
            credentialsId: CREDENTIALS_ID
          ]]])
        }
      }
      stage('安装环境') {
        steps {
          sh '''yarn install
cd ./src
node main.js ${PHONE} ${PASSWORD} ${SCKEY} ${TOKEN} ${LEABLETI} ${STARTTIMEDATE}'''
        }
      }
    }
  }
````