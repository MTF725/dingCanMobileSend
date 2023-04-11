<template>
	<div class="order-manage" style="padding-bottom: 45px;">
		<!-- 顶部导航 -->
		<top-fixed-nav title="用户评价"></top-fixed-nav>
		<!-- 订单状态切换 -->
		<div style="height: 40px;">
			<div class="order-state-nav">
				<span :class="{active:tabNum==0}" v-on:click="assessTab(0)">全部</span>
				<span :class="{active:tabNum==1}" v-on:click="assessTab(1)">满意</span>
				<span :class="{active:tabNum==2}" v-on:click="assessTab(2)">不满意</span>
			</div>
		</div>
		
		<!-- 下拉刷新 -->
		<van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
			<!-- 待配送、新订单列表 -->
			<div class="new-order-list" style="min-height: 300px;">
				<!-- 评价列表 -->
				<div class="dis-list">
					<ul v-if="userAssess.length>0">
						<li v-for="(item,index) in userAssess">
							<img class="head-img" src="../../public/static/images/icon/default_head.png" alt="">
							<p class="dis-user-name"><span class="dis-name">{{item.pName?item.pName:'匿名'}}</span><span class="dis-date">{{item.createTime}}</span></p>
							<p class="dis-remark" style="color: #999;">{{item.commentWordTypeName}}</p>
							<p class="dis-remark">{{item.commentWords}}</p>
						</li>
					</ul>
					<p v-else style="text-align: center;margin: 20px;">暂无评价</p>
				</div>
			</div>
		</van-pull-refresh>
	
		
		
	</div>
</template>

<script type="text/javascript">
var pageNum=1;
	export default{
		data:function(){
			return{
				tabNum:0,
				refreshLoading: false,//下拉刷新
				userAssess:[]
			};
		},
		mounted() {
			 // 滚动到底加载更多
			window.addEventListener('scroll',this.reachBottom)			  
		},
		// 销毁监听滚动条事件
		destroyed(){
		    window.removeEventListener('scroll', this.reachBottom)
			console.log('销毁')
		  },
		methods:{
			assessTab(e){
				pageNum=1;
				var _this=this;
				_this.tabNum=e;
				_this.userAssess=[];
				this.getUserAssess(e,pageNum)
			},
			// 滚动到底加载更多
			reachBottom(){
				  //变量scrollTop是滚动条滚动时，距离顶部的距离
				  let scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
				  //变量windowHeight是可视区的高度
				  let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
				  //变量scrollHeight是滚动条的总高度
				  let scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
					//滚动条到底部的条件
					if(scrollTop+windowHeight >= scrollHeight){
						pageNum++;
						console.log('到底了',pageNum)
						this.getUserAssess(this.tabNum,pageNum);
					}
			},
			// 下拉刷新
			 onRefresh() {
				 pageNum=1;
				 this.userAssess=[];
				this.getUserAssess(this.tabNum,pageNum);
				setTimeout(()=>{
					this.$toast('已刷新');
					this.refreshLoading = false;
				},100)
						
					
					
			    },
			
		
			// 获取用户对配送员评价
			getUserAssess(type,pageNum){
				var _this=this;
				var load=_this.$toast.loading({
				  message: '加载中...',
				  duration:0,
				  forbidClick: true,
				});
				_this.$axios({
					  method: 'get',
					  url: port+'/v1/deliveryInfo/queryComment',
					  headers:{'token':localStorage.getItem('sendToken')},
					  params: {
						pId:JSON.parse(localStorage.getItem('sendPerson')).pId,
						typeId:type,//评论类型id（0全部1满意2不满意）
						pageNum:pageNum,
						pageSize:8
					  }
					}).then(function(data){
						console.log('用户对配送员评价',data)
						load.clear();
						if (data.data.status==200) {
							var arr=data.data.data.list;
							if(arr.length>0){
								for (var i=0;i<arr.length;i++) {
									_this.userAssess.push(arr[i])
								}
							}else{
								_this.$toast('已加载全部');
							}
						}
						if(data.data.status==600){
							_this.$toast(data.data.msg);
						}
						if(data.data.status==601||data.data.status==602||data.data.status==603){
							_this.$toast('请先登录');
							setTimeout(()=>{
								_this.$router.push({'path':'/login'})
							},2000)
						}
					}).catch(function(error){
						console.log(error);
						_this.$toast('操作失败');
					});
			},
			
			
			
		},
		created:function(){
			this.getUserAssess(0,pageNum)
		}
	}
</script>
<style type="text/css" scoped>
.order-state-nav{position: fixed;width: 100%;left: 0;top: 40px;display: flex;z-index: 3;border-bottom: 1px solid #eee;}
.order-state-nav span{flex: 1;text-align: center;height: 40px;line-height: 40px;background: #fff;position: relative;}
.order-state-nav span.active::after{content: '';position: absolute;width: 50px;height: 3px;background-color: #F4BE42;left: 50%;bottom: 0;transform: translateX(-50%);}

.dis-list li{position: relative;border-bottom: 1px solid #eee;padding: 10px 10px 10px 60px;min-height: 40px;}
.dis-list li .head-img{position: absolute;width: 40px;height: 40px;left: 10px;top: 10px;border-radius: 50%;}
.dis-user-name{display: flex;justify-content: space-between;}
.dis-user-name .dis-name{font-size: 15px;font-weight: bold;margin-bottom: 10px;}
.dis-user-name .dis-date{font-size: 12px;color: #999;}

</style>