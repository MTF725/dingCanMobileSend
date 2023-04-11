<template>
  <div id="app">
    	<div class="send-btm-nav" v-show="$route.name!='login'&&$route.name!='setUp'&&$route.name!='orderInfo'&&$route.name!='assess'">
			<router-link to="/index">待处理</router-link>
			<router-link to="/orderManage">订单管理</router-link>
    	</div>
    <router-view></router-view>
  </div>
</template>

<script type="text/javascript">
  export default{
  	data:function(){
  		return{
  			tabNum:1
  		};
  	},
	watch:{

	},
  	methods:{
		// 跳转到首页
  		toIndex(){
			console.log(this.$route)
			this.tabNum=1;
			this.$router.push({path:'/index'})
		},
  		toOrderManage(){
			console.log(this.$route)
			this.tabNum=2;
			this.$router.push({path:'/orderManage'})
		}
  	},
  	created:function(){
  	}
  }
</script>
<style>


.send-btm-nav{position: fixed;width: 100%;left: 0;bottom: 0;background: #fff;z-index: 3;display: flex;font-size: 15px;border-top: 1px solid #eee;}
.send-btm-nav a{flex: 1;text-align: center;height: 45px;line-height: 45px;color: #333;}
.send-btm-nav .router-link-exact-active{color: #F4BE42;}
</style>
