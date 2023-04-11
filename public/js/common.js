
/////////////开发
// var port='http://192.168.1.100:9101';//本地
// var port='http://192.168.1.252:9101';//服务
//图片前缀
// var sellerPort = 'http://192.168.1.252:9001'; //商家
// var winPort = 'http://192.168.1.252:2003'; //总后台


////////////////////////////线上
var port='http://ordermealw.ngrok2.xiaomiqiu.cn';//线上
// // // 图片前缀
var sellerPort = 'http://shopmanage.ngrok2.xiaomiqiu.cn'; //商家
var winPort = 'http://ordermeal.ngrok2.xiaomiqiu.cn'; //总后台

///常用正则表达式
var integerReg=/^[0-9]+$/;//大于等于0的整数
var zzsReg = /^\+?[1-9]\d*$/; //大于0的整数
var zsReg = /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/; //大于0的数（包括小数）
var ddlReg = /^\d+(?=\.{0,1}\d+$|$)/;//大于等于0（包含小数）
var phongReg = /^1[3456789]\d{9}$/; //手机号码
var idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证
var dateReg=/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;//日期xxxx-xx-xx


 // 设置默认时间为当前时间之后30分钟——先转化为毫秒数，加上 20 分钟的毫秒数，再转化回来（参数为分钟）
 function setDefaultTime(min) {
    let t = new Date().getTime() + 1000*60*min;
    let d = new Date(t);
    let theMonth = d.getMonth() + 1;
    let theDate = d.getDate();
    let theHours = d.getHours();
    let theMinutes = d.getMinutes();
    if (theMonth < 10) {
      theMonth = '0' + theMonth
    }
    if (theDate < 10) {
      theDate = '0' + theDate
    }
    if (theHours < 10) {
      theHours = '0' + theHours
    }
    if (theMinutes < 10) {
      theMinutes = '0' + theMinutes
    }
    let date = d.getFullYear() + '-' + theMonth + '-' + theDate
    let time = theHours + ':' + theMinutes
    let Spare = date + ' ' + time
    // console.log(date)
    // console.log(time)
    // console.log(Spare)
    return{
        hours:theHours,
        min:theMinutes
    };
  };
  
  // 获取url参数
  function getUrlKey(name){
      return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
  }
  
  // 判断是否登录
  function isLogin(){
  	  if(localStorage.getItem('sendToken')&&localStorage.getItem('sendLogin')){
  		  return true;
  	  }else{
  		  return false;
  	  }
  }