<template>
	<div class="index" style="background: #fff;">
		<!-- 顶部导航 -->
		<top-fixed-nav title="订单信息"></top-fixed-nav>
		
		<div style="height: 65px;">
			<div class="select-order-list-tit">
				<p class="select-month" v-on:click="yearMonthPopup=true">{{yearMonth}} <van-icon name="arrow-down" /></p>
				<!-- <p class="select-order-num"><span>订单量100</span><span>统计<van-icon name="arrow" /></span></p> -->
			</div>
		</div>
		<div class="order-list">
			<van-cell-group>
			   <van-cell v-for="(item,index) in orderList" :label="item.createTime">
			     <!-- 使用 title 插槽来自定义标题 -->
			     <template #title>
					 <span class="order-num">{{index+1}}</span>
			       <span class="custom-title">订单号：{{item.orderNo}}</span>
			     </template>
			   </van-cell>
			</van-cell-group>
		</div>
		
		<!-- 选择月份 -->
		<van-popup v-model="yearMonthPopup" position="bottom" :style="{ height: '270px' }">
			<van-datetime-picker v-on:confirm="getMonth" v-on:cancel="yearMonthPopup=false" v-model="currentDate" type="year-month" title="选择年月"
			/>
		</van-popup>
		
	</div>
</template>

<script type="text/javascript">
	export default{
		data:function(){
			return{
				orderList:[],//订单列表
				yearMonthPopup:false,
				currentDate:new Date(),
				yearMonth:'',
			};
		},
		methods:{
			getMonth(e){
				var _this=this;
				var myDate=new Date(e)
				var year=myDate.getFullYear();
				var month=myDate.getMonth()+1;
				if(month<10){
					month='0'+month
				}
				_this.yearMonth=year+'-'+month;
				_this.yearMonthPopup=false;
				
				_this.getMonthOrder(_this.yearMonth)
				_this.getMonthOrderNum(_this.yearMonth)
			},
			// 根据月份查询每月订单
			getMonthOrder(yearMonth){
				var _this=this;
				
				var load=_this.$toast.loading({
				  message: '加载中...',
				  duration:0,
				  forbidClick: true,
				});
				_this.$axios({
					  method: 'get',
					  url: port+'/v1/deliveryStatistics/queryBill',
					  headers:{'token':localStorage.getItem('sendToken')},
					  params: {
						deliveryPersonId:JSON.parse(localStorage.getItem('sendPerson')).pId,
						month:yearMonth
					  }
					}).then(function(data){
						_this.orderList=[];
						load.clear();
						if (data.data.status==200) {
							if(data.data.data.length<=0){
								_this.$toast('当前时间暂无数据');
							}else{
								_this.orderList=data.data.data;
								console.log('查询每月订单',_this.orderList)
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
					});
			},
			// 查询指定月份的总订单数 2020-05
			getMonthOrderNum(yearMonth){
				var _this=this;
				_this.$axios({
					  method: 'get',
					  url: port+'/v1/deliveryStatistics/queryBill',
					  headers:{'token':localStorage.getItem('sendToken')},
					  params: {
						deliveryPersonId:JSON.parse(localStorage.getItem('sendPerson')).pId,
						month:yearMonth
					  }
					}).then(function(data){
						console.log('查询'+yearMonth+'数据数量',data)
						if (data.data.status==200) {
							
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
					});
			},
			
		},
		created:function(){
			var myDate=new Date();
			var year=myDate.getFullYear();
			var month=myDate.getMonth()+1;
			if(month<10){
				month='0'+month;
			}
			this.yearMonth=year+'-'+month;
			if(localStorage.getItem('sendPerson')){
				this.getMonthOrder(this.yearMonth)
			}else{
				this.$router.push({'path':'/login'})
			}
		}
	}
</script>
<style type="text/css" scoped>
.select-order-list-tit{background: #F6F6F6;padding: 10px;position: fixed;width: 100%;left: 0;top: 40px;z-index: 3;box-sizing: border-box;}
.select-order-num{font-size: 12px;margin-top: 10px;color: #8A8A8A;display: flex;justify-content: space-between;}
.order-list .van-cell__title{position: relative;padding-left: 40px;}
.order-num{position: absolute;width: 30px;height: 30px;left: 0;top: 50%;background: #EDC106;color: #fff;border-radius: 50%;text-align: center;line-height: 30px;font-size: 14px;transform: translateY(-50%);}
</style>