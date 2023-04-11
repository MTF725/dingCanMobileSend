<template>
	<div class="index" style="padding-bottom: 45px;">
		<!-- 顶部导航 -->
		<top-fixed-nav title="设置"></top-fixed-nav>
		<van-cell-group>
			<van-cell title="头像" is-link>
			  <!-- 使用 right-icon 插槽来自定义右侧图标 -->
			  <template #default>
				  <van-uploader :after-read="uploadImg">
					  <img class="send-head" :src="headImg" alt="">
				  </van-uploader>
			    
			  </template>
			</van-cell>
			<van-cell title="姓名" :value="name" />
		  <van-cell title="用户名" :value="userName" />
		  <van-cell is-link title="手机号" :value="phone" v-on:click="editPhonePopup=true" />
		  <van-cell is-link title="修改密码" :value="password" v-on:click="editPasswordPopup=true" />
		  <van-cell is-link title="关于我们" v-on:click="aboutUsPopup=true" />
		</van-cell-group>
		<div class="big-btn-wrap">
			<van-button type="primary" block color="#F4BE42" v-on:click="exitLogin">退出登录</van-button>
		</div>
		
		<!-- 关于我们 -->
		<van-popup position="right" :style="{width:'100%', height: '100%'}" v-model="aboutUsPopup">
			<!-- popup内头部 -->
			<div class="popup-header">
				<span class="back iconfont icon-zuojiantou" v-on:click="aboutUsPopup=false"></span>关于我们
			</div>
			<!-- popup内容区 -->
			<div class="popup-main" style="height: calc(100% - 40px);">
				<div class="about-wrap">
					<p>兴港智慧公寓平台-云订餐系统——开启订餐新征程，是一款致力于解决便捷用餐、避免拥挤用餐的新产品，用户通过“兴港智慧公寓平台-云订餐系统”便捷下单购买各种商品以及服务，对于外卖配送的商品通过配送员抢单的方式，由抢得订单的配送员采办配送。该系统采用最新流行的微服务架构模式，将应用和服务分解成更小的、松散耦合的组件，使得整个系统的易用性、扩展性和维护性更加便捷。</p>
				</div>
			</div>
		</van-popup>
		
		<!-- 修改手机号 -->
		<van-popup position="right" :style="{width:'100%', height: '100%',background:'#eee'}" v-model="editPhonePopup">
			<!-- popup内头部 -->
			<div class="popup-header">
				<span class="back iconfont icon-zuojiantou" v-on:click="editPhonePopup=false"></span>修改手机号
			</div>
			<!-- popup内容区 -->
			<div class="popup-main" style="height: calc(100% - 40px);">
				<van-cell-group>
				  <van-field input-align="right" v-model="newPhone" label="新手机号" placeholder="请输入新手机号" />
				</van-cell-group>
				<div class="big-btn-wrap">
					<van-button type="primary" block color="#F4BE42" v-on:click="editPhoneConfirm">确定</van-button>
				</div>
			</div>
		</van-popup>
		
		<!-- 修改密码 -->
		<van-popup position="right" :style="{width:'100%', height: '100%',background:'#eee'}" v-model="editPasswordPopup">
			<!-- popup内头部 -->
			<div class="popup-header">
				<span class="back iconfont icon-zuojiantou" v-on:click="editPasswordPopup=false"></span>修改密码
			</div>
			<!-- popup内容区 -->
			<div class="popup-main" style="height: calc(100% - 40px);">
				<van-cell-group>
				  <van-field input-align="right" v-model="newPassword" label="新密码" placeholder="请输入新密码" />
				  <van-field input-align="right" v-model="confirmPassword" label="确认密码" placeholder="请输入新密码" />
				</van-cell-group>
				<div class="big-btn-wrap">
					<van-button type="primary" block color="#F4BE42" v-on:click="editPasswordConfirm">确定</van-button>
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script type="text/javascript">
	export default{
		data:function(){
			return{
				headImg:'',//头像
				userName:JSON.parse(localStorage.getItem('sendPerson')).pNo,//用户名
				name:JSON.parse(localStorage.getItem('sendPerson')).pName,//姓名
				phone:'',//手机号
				aboutUsPopup:false,//关于我们
				editPhonePopup:false,//修改手机号
				newPhone:'',//新手机号
				password:'',//密码
				newPassword:'',//新密码
				confirmPassword:'',//确认密码
				editPasswordPopup:false,//修改密码popup
			};
		},
		methods:{
			// 修改密码确认
			editPasswordConfirm(){
				var _this=this;
				if(_this.newPassword==''){
					_this.$toast('请输入新密码');
					return;
				}
				if(_this.confirmPassword==''){
					_this.$toast('请确认新密码');
					return;
				}
				if(_this.confirmPassword!=_this.newPassword){
					_this.$toast('两次输入不一致');
					return;
				}
				
				_this.$axios({
					method: 'post',
					url: port + '/v1/deliveryInfo/modPsd',
					headers:{'token':localStorage.getItem('sendToken')},
					params:{
						pId:JSON.parse(localStorage.getItem('sendPerson')).pId,
						psd:_this.newPassword
					}
				}).then(function(data) {
					console.log('修改密码', data)
					if(data.data.status==200){
						_this.$toast('修改成功');
						setTimeout(()=>{
							_this.exitLogin();
						},1500)
					}else{
						_this.$toast(data.data.msg);
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			// 上传图片
			uploadImg(e){
				var _this=this;
				_this.headImg=e.content;
				console.log(e.content)
				var formData=new FormData();
				formData.append('file',e.file)
				
				var load = _this.$toast.loading({
					message: '上传中...',
					duration: 0,
					forbidClick: true,
				});
				_this.$axios({
					method: 'post',
					url: port + '/v1/deliveryInfo/modPhoto',
					headers:{'token':localStorage.getItem('sendToken')},
					data:formData,
					params:{
						deliveryPersonId:JSON.parse(localStorage.getItem('sendPerson')).pId
					}
				}).then(function(data) {
					console.log('上传图片', data)
					if(data.data.status==200){
						load.clear();
						_this.$toast('上传成功');
						var sendPerson=JSON.parse(localStorage.getItem('sendPerson'))
						sendPerson.pPhoto=data.data.data;
						localStorage.setItem('sendPerson',JSON.stringify(sendPerson))
					}else{
						_this.$toast(data.data.msg);
					}
				}).catch(function(error) {
					console.log(error);
				});
			},
			// 退出登录
			exitLogin(){
				var _this=this;
				_this.$dialog.confirm({
				  title: '温馨提示',
				  message: '确定退出当前登录？',
				})
				  .then(() => {
				    // on confirm
					var load = _this.$toast.loading({
						message: '正在退出...',
						duration: 0,
						forbidClick: true,
					});
					_this.$axios({
						method: 'post',
						url: port + '/v1/deliveryInfo/logout',
						headers:{'token':localStorage.getItem('sendToken')},
						params:{
							cId:localStorage.getItem('cId')
						}
					}).then(function(data) {
						console.log('退出登录', data)
						if(data.data.status==200){
							localStorage.removeItem('sendLogin');
							load.clear();
							// 清除配送员token和配送员信息
							localStorage.removeItem('sendToken');
							localStorage.removeItem('sendPerson')
							_this.$router.push({path:'logIn'})
						}else{
							_this.$toast(data.data.msg);
						}
					}).catch(function(error) {
						console.log(error);
					});
				  })
				  .catch(() => {
				    // on cancel
				  });
			},
			// 修改手机号确定
			editPhoneConfirm(){
				var _this=this;
				if(_this.newPhone==''){
					_this.$toast('请输入新手机号');
					return;
				}
				if(!phongReg.test(_this.newPhone)){
					_this.$toast('手机号格式错误');
					return;
				}
				
				var load = _this.$toast.loading({
					message: '提交中...',
					duration: 0,
					forbidClick: true,
				});
				_this.$axios({
					method: 'get',
					url: port + '/v1/deliveryInfo/modMobile',
					headers:{'token':localStorage.getItem('sendToken')},
					params: {
						pId:JSON.parse(localStorage.getItem('sendPerson')).pId,
						mobile:_this.newPhone,
					}
				}).then(function(data) {
					console.log('修改手机号', data)
					if(data.data.status==200){
						load.clear();
						_this.$toast("修改成功");
						_this.phone=_this.newPhone;
						var sendPerson=JSON.parse(localStorage.getItem('sendPerson'))
						sendPerson.pMobile=_this.newPhone;
						localStorage.setItem('sendPerson',JSON.stringify(sendPerson))
						setTimeout(()=>{
							_this.editPhonePopup=false
						},1000)
					}else{
						_this.$toast(data.data.msg);
					}
				}).catch(function(error) {
					console.log(error);
				});
			}
			
			
		},
		created:function(){
			if(localStorage.getItem('sendPerson')){
				if(this.newPhone==''){
					this.phone=JSON.parse(localStorage.getItem('sendPerson')).pMobile;
				}else{
					this.phone=this.newPhone;
				}
				
				if(JSON.parse(localStorage.getItem('sendPerson')).pPhoto){
					this.headImg=port+JSON.parse(localStorage.getItem('sendPerson')).pPhoto;
				}else{
					this.headImg='./static/images/icon/default_head.png';
				}
			}
			if(!localStorage.getItem('sendToken')){
				this.$router.push({'path':'/login',query:{cId:sessionStorage.getItem('cId')}})
			}
		}
	}
</script>
<style type="text/css" scoped>
.van-cell{align-items: center;}
.send-head{width: 50px;height: 50px;border-radius: 50%;}	
	
.about-wrap{padding: 10px;}
.about-wrap p{text-indent: 2em;line-height: 2em;}
</style>