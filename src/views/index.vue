<template>
	<div class="index" style="padding-bottom: 45px;">
		<!-- 顶部导航 -->
		<div style="height: 40px;">
			<div class="top-fixed-nav">
				<div style="font-size: 40px;color: #fff;" class="back iconfont icon-zhedie" @click="openLeftSidePopup"></div>
				<span class="title">{{title}}</span>
			</div>
		</div>
		
		<!-- 订单切换 -->
		<div style="height: 66px;">
			<div class="order-tab">
				<div v-on:click="orderTab(1)" :class="{active:orderTabNum==1}"><i class="iconfont icon-xindingdan"></i>新订单</div>
				<div v-on:click="orderTab(2)" :class="{active:orderTabNum==2}"><i class="iconfont icon-cuidan1"></i></i>催单</div>
			</div>
		</div>
		
		<!-- 下拉刷新 -->
		<van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
			<!-- 新订单列表 -->
			<div class="new-order-list" style="min-height: 300px;">
				<ul>
					<li v-for="(item,index) in newOrderList" v-on:click="openNewOrderDetail(item.orderNo)">
						<p v-show="orderTabNum==1" class="send-time"><i class="iconfont icon-iconfontcolor35"></i>期望时间 {{item.arrivalTime}} 送达</p>
						<p v-show="orderTabNum==2" class="send-time">{{index+1}}. {{item.orderState==8?'待配送':'待取餐'}}</p>
						<div class="new-order-main">
							<div class="new-order-item">
								<span class="qu">取：</span>
								<p>{{item.sellerWinAddress}}</p>
								<p class="sub">{{item.sellerWinFullAddress}}</p>
							</div>
							<div class="new-order-item">
								<span class="song">送：</span>
								<p>{{item.address}}</p>
								<p class="sub">{{item.contact}} {{item.phone}}</p>
							</div>
						</div>
						<div class="big-btn-wrap" v-show="orderTabNum==1">
							<van-button type="primary" block color="#F4BE42" v-on:click.stop="grabOrder(item.orderNo)">抢单</van-button>
						</div>
					</li>
				</ul>
			</div>
		</van-pull-refresh>
		
	
		
		
		<!-- 左侧popup -->
		<van-popup position="left" :style="{width:'60%', height: '100%' }" v-model="leftSidePopup">
			<div class="head-wrap">
				<img :src="headImg" alt="">
				<p class="head-name">{{sendPersonName}}</p>
				<p class="head-phone">{{sendPersonPhone}}</p>
			</div>
			
			<div class="head-set">
				<p v-on:click="$router.push({path:'/orderInfo'})"><i class="iconfont icon-zhangdan"></i>订单</p>
				<p v-on:click="$router.push({path:'/assess'})"><i class="iconfont icon-pingjia"></i>评价</p>
				<p v-on:click="$router.push({path:'/setUp'})"><i class="iconfont icon-shezhi"></i>设置</p>
			</div>
		</van-popup>
		
		<!-- 订单详情 -->
		<van-popup position="right" :style="{width:'100%', height: '100%',background:'#eee'}" v-model="orderDetailPopup">
			<!-- popup内头部 -->
			<div class="popup-header">
				<span class="back iconfont icon-zuojiantou" v-on:click="orderDetailPopup=false"></span>订单详情
			</div>
			<!-- popup内容区 -->
			<div class="popup-main" style="height: calc(100% - 40px);">
				<div class="order-detail">
					<div style="margin: 10px;border-radius: 6px;overflow: hidden;">
						<van-cell-group>
						  <van-cell title="配送信息"  />
						  <van-cell title="取餐地址" :value="orderDetail.sellerWinAddress+''+orderDetail.sellerWinName" />
						  <van-cell title="送餐地址" :value="sendAddress.address" />
						  <van-cell title="期望送达时间" :value="sendAddress.arrivalTime" />
						  <van-cell title="订餐方式" :value="sendAddress.mealMode==1?'自提':sendAddress.mealMode==2?'外卖配送':'到店用餐'"  />
						</van-cell-group>
						<a class="a-tell" :href="'tel:'+sendAddress.phone"><span class="name">{{sendAddress.contact}}</span><span class="phone">{{sendAddress.phone}}</span></a>
					</div>
					<div class="my-order-list" style="margin: 10px;border-radius: 6px;overflow: hidden;">
						<van-cell-group>
						  <van-cell title="订单详情"  />
						</van-cell-group>
						<ul>
							<li v-for="item in orderDetail.orderGoodses">
								<p class="my-order-name"><img :src="item.gPic" alt="">{{item.gName}}*{{item.buyCounter}}</p>
								<p class="price">￥{{item.totalPrice}}</p>
							</li>
						</ul>
						<div class="send-wrap">
							<p><span>配送费</span><span>￥{{orderDetail.deliveryFee}}</span></p>
							<p><span>环保费</span><span>￥{{orderDetail.totalGreenMoney}}</span></p>
						</div>
						<p class="total-price">小计<span>￥{{orderDetail.totalPrice}}</span></p>
						<a :href="'tel:'+orderDetail.sellerPhone" class="seller-phone"><i class="iconfont icon-dianhua"></i>商家电话</a>
					</div>
					<div style="margin: 10px;border-radius: 6px;overflow: hidden;">
						<van-cell-group>
						  <van-cell title="订单信息"  />
						  <van-cell value-class="cell-value" title="订单号" :value="orderDetail.orderNo" />
						  <van-cell title="订单提交日期" :value="orderDetail.createTime" />
						  <van-cell title="备注" :value="orderDetail.remark" />
						  
						</van-cell-group>
					</div>
					<div class="big-btn-wrap" style="margin: 20px;" v-show="orderTabNum==1">
						<van-button type="primary" block color="#F4BE42" v-on:click="grabOrder(orderDetail.orderNo,true)">抢单</van-button>
					</div>
					
				</div>
			</div>
		</van-popup>
		
	</div>
</template>

<script type="text/javascript">
// var cNo=getUrlKey('cNo');//获取url编号参数
// sessionStorage.setItem('cNo',getUrlKey('cNo'));
var pageNum=1;
	export default{
		data:function(){
			return{
				headImg:'',//头像
				sendPersonName:'',//配送员姓名
				sendPersonPhone:'',//配送员电话
				title:'订单',
				leftSidePopup:false,//左侧设置
				orderTabNum:1,//订单类型切换
				newOrderList:[],//新订单、催单
				orderDetailPopup:false,//订单详情
				orderDetail:'',//订单详情
				sendAddress:'',//配送地址
				refreshLoading: false,//下拉刷新
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
						// 若果切换状态为1，加载新订单
						if(this.orderTabNum==1){
							console.log('新订单到底了',pageNum)
							this.getNewOrder(pageNum);
						}
						
						if(this.orderTabNum==2){
							console.log('催单到底了',pageNum)
							this.getCuiOrder(pageNum);
						}
						
						
					}
			},
			// 下拉刷新
			 onRefresh() {
				 pageNum=1;
				 this.newOrderList=[];
			        if(this.orderTabNum==1){
						this.getNewOrder(pageNum);
						setTimeout(()=>{
							this.$toast('新订单已刷新');
							this.refreshLoading = false;
						},100)
						
					}
					if(this.orderTabNum==2){
						this.getCuiOrder(pageNum);
						setTimeout(()=>{
							this.$toast('催单已刷新');
							this.refreshLoading = false;
						},100)
						
					}
			    },
				// 查询单位信息，用来查cId
				getUnitNo(no){
					localStorage.setItem('sNo',no);
					var _this=this;
					
					_this.$axios({
						  method: 'get',
						  url: port+'/v1/ordermeal/queryCompanyBycNo',
						  params: {
							cNo:no
						  }
						}).then(function(data){
							console.log('查询单位信息',data)
							if (data.data.status==200) {
								localStorage.setItem('cId',data.data.data.cId)
							}
						}).catch(function(error){
							console.log(error);
						});
				},
			// 抢单
			grabOrder(orderNo,detailGrab){
				var _this=this;
				var sendPersonInfo=JSON.parse(localStorage.getItem('sendPerson'))
				var load=_this.$toast.loading({
				  message: '提交中...',
				  duration:0,
				  forbidClick: true,
				});
				_this.$axios({
					  method: 'post',
					  url: port+'/v1/deliveryOrder/configDeliveryPerson',
					  headers:{'token':localStorage.getItem('sendToken')},
					  params: {
						orderNo:orderNo,
						personId:sendPersonInfo.pId,
						personName:sendPersonInfo.pName,
						phone:sendPersonInfo.pMobile
					  }
					}).then(function(data){
						console.log('抢单',data)
						load.clear();
						if (data.data.status==200) {
							_this.$toast('抢单成功');
							
							setTimeout(()=>{
								pageNum=1;
								_this.newOrderList=[];
								_this.getNewOrder(pageNum);
								_this.$router.push({path:'/orderManage'})
							},1000)
							
							if(detailGrab){
								setTimeout(()=>{
									_this.orderDetailPopup=false
								},1000)
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
						_this.$toast('抢单失败');
					});
			},
			// 打开新订单详情
			openNewOrderDetail(orderNo){
				this.orderDetailPopup=true
				this.getOrderDetail(orderNo)
			},
			// 订单类型切换
			orderTab(e){
				var _this=this;
				pageNum=1;
				_this.newOrderList=[];
				
				_this.orderTabNum=e;
				// 若果切换状态为1，加载新订单
				if(_this.orderTabNum==1){
					_this.getNewOrder(pageNum);
				}
				
				if(_this.orderTabNum==2){
					_this.getCuiOrder(pageNum);
				}
			},
			// 打开左侧popup
			openLeftSidePopup(){
				this.leftSidePopup=true
			},
			// 获取新订单列表
			getNewOrder(pageNum){
				var _this=this
				if(localStorage.getItem('sendToken')){
					var load=_this.$toast.loading({
					  message: '加载中...',
					  duration:0,
					  forbidClick: true,
					});
					_this.$axios({
						  method: 'get',
						  url: port+'/v1/deliveryOrder/queryNew',
						  headers:{'token':localStorage.getItem('sendToken')},
						  params: {
							pageNum:pageNum,
							pageSize:10,
							deliveryPersonId:JSON.parse(localStorage.getItem('sendPerson')).pId
						  }
						}).then(function(data){
							console.log('新订单',data)
							load.clear();
							if (data.data.status==200) {
								if(data.data.data.list.length<=0){
									_this.$toast('没有更多数据');
								}else{
									for (var i=0;i<data.data.data.list.length;i++) {
										_this.newOrderList.push(data.data.data.list[i])
									}
								}
							}
							if(data.data.status==600){
								// _this.$toast(data.data.msg);
							}
							if(data.data.status==601||data.data.status==602||data.data.status==603){
								// _this.$toast(data.data.msg);
								setTimeout(()=>{
									_this.$router.push({'path':'/login'})
								},1000)
							}
						}).catch(function(error){
							console.log(error);
							_this.$toast('登录过期，请重新登录');
							setTimeout(()=>{
								_this.$router.push({'path':'/login'})
							},2000)
						});
				}else{
					setTimeout(()=>{
						_this.$router.push({'path':'/login'})
					},2000)
				}
			},
			// 获取催单列表
			getCuiOrder(pageNum){
				var _this=this
				if(localStorage.getItem('sendToken')){
					var load=_this.$toast.loading({
					  message: '加载中...',
					  duration:0,
					  forbidClick: true,
					});
					_this.$axios({
						  method: 'get',
						  url: port+'/v1/deliveryOrder/queryRemind',
						  headers:{'token':localStorage.getItem('sendToken')},
						  params: {
							pageNum:pageNum,
							pageSize:5,
							personId:JSON.parse(localStorage.getItem('sendPerson')).pId
						  }
						}).then(function(data){
							console.log('催单',data)
							load.clear();
							if (data.data.status==200) {
								if(data.data.data.list.length<=0){
									_this.$toast('没有更多数据');
								}else{
									for (var i=0;i<data.data.data.list.length;i++) {
										_this.newOrderList.push(data.data.data.list[i])
									}
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
							_this.$toast('登录过期，请重新登录');
							setTimeout(()=>{
								_this.$router.push({'path':'/login'})
							},2000)
						});
				}else{
					setTimeout(()=>{
						_this.$router.push({'path':'/login'})
					},2000)
				}
			},
			// 订单详情、配送地址
			getOrderDetail(orderNo){
				var _this=this
					var load=_this.$toast.loading({
					  message: '加载中...',
					  duration:0,
					  forbidClick: true,
					});
					_this.$axios({
						  method: 'get',
						  url: port+'/v1/deliveryOrder/get',
						  headers:{'token':localStorage.getItem('sendToken')},
						  params: {
							orderNo:orderNo
						  }
						}).then(function(data){
							load.clear();
							if (data.data.status==200) {
								_this.orderDetail=data.data.data;
								console.log('订单详情',_this.orderDetail)
								var totalPrice=0;
								// 计算所有菜品的环保费
								var greenMoney=0;
								for (var i=0;i<_this.orderDetail.orderGoodses.length;i++) {
									// 计算每个菜品的总价
									_this.orderDetail.orderGoodses[i].totalPrice=_this.orderDetail.orderGoodses[i].buyCounter*_this.orderDetail.orderGoodses[i].gPrice;					
									
									greenMoney+=_this.orderDetail.orderGoodses[i].buyCounter*_this.orderDetail.orderGoodses[i].gGreenFee;
									_this.orderDetail.totalGreenMoney=greenMoney;
									
									// 计算总价
									totalPrice+=_this.orderDetail.orderGoodses[i].totalPrice;
								}
								
								_this.orderDetail.totalPrice=totalPrice+greenMoney+_this.orderDetail.deliveryFee;
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
							_this.$toast(error);
						});
						
						// 配送地址
						_this.$axios({
							  method: 'get',
							  url: port+'/v1/deliveryOrder/getOrderAddress',
							  headers:{'token':localStorage.getItem('sendToken')},
							  params: {
								orderNo:orderNo
							  }
							}).then(function(data){
								load.clear();
								if (data.data.status==200) {
									_this.sendAddress=data.data.data;
									console.log('配送地址',_this.sendAddress)
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
								_this.$toast(error);
							});
				
			},
			// 跳转到窗口列表,把店铺id传递过去
			toWinList(index,id,shopName){
				this.$router.push({path:'/winList',query:{shopId:id,shopName:shopName}})
			}
			
		},
		created:function(){
			var cNo=getUrlKey('cNo');//获取url编号参数
			if(cNo){
				localStorage.setItem('sNo',cNo);
			}
			this.getUnitNo(localStorage.getItem('sNo'))//传入配送员单位编号
			if(localStorage.getItem('sendPerson')){
				this.getNewOrder(pageNum);
				var sendPerson=JSON.parse(localStorage.getItem('sendPerson'))
				this.sendPersonName=sendPerson.pName;
				this.sendPersonPhone=sendPerson.pMobile;
				
				if(JSON.parse(localStorage.getItem('sendPerson')).pPhoto){
					this.headImg=port+JSON.parse(localStorage.getItem('sendPerson')).pPhoto;
				}else{
					this.headImg='./static/images/icon/default_head.png';
				}
			}
			if(!isLogin()){
				this.$router.push({'path':'/login'})
			}
		}
	}
</script>
<style type="text/css" scoped>
.big-btn-wrap{margin: 0 15px;}
.head-wrap img{width: 70px;height: 70px;border-radius: 50%;}
.head-wrap{text-align: center;border-bottom: 1px solid #eee;padding: 20px 0;}
.head-wrap p{margin-top: 5px;}

.head-set{margin-top: 20px;}
.head-set p{line-height: 2em;padding: 4px 20px;}
.head-set p .iconfont{color: #F4BE42;margin-right: 10px;}

.order-tab{position: fixed;width: 100%;line-height: 45px;left: 0;top: 40px;display: flex;padding: 10px;box-sizing: border-box;z-index: 2;background-color: #f9f9f9;}
.order-tab div{flex: 1;text-align: center;background-color: #fff;}
.order-tab div.active{background-color: #FDF2D9;}
.order-tab div.active .iconfont{color: #F4BE42;}
.order-tab .iconfont{margin-right: 4px;font-size: 20px;vertical-align: middle;}

.new-order-list li{background: #fff;margin:0 10px 10px;padding-bottom: 10px;}
.new-order-list .send-time{padding: 10px;border-bottom: 1px solid #eee;}
.new-order-list .send-time .iconfont{margin-right: 6px;color: #F4BE42;}
.new-order-main{padding: 10px;}
.new-order-list .new-order-item{position: relative;padding-left: 40px;}
.new-order-list .new-order-item p{margin-bottom: 4px;min-height: 20px;}
.new-order-list .new-order-item p.sub{color: #999;}
.new-order-list .new-order-item span{position: absolute;left: 5px;top: 0;}
.new-order-list .new-order-item span.qu{color: #5D93EC;}
.new-order-list .new-order-item span.song{color: #35B039;}

.order-detail-top{background: #fff;text-align: center;margin: 10px;padding: 10px;border-radius: 6px;}
.order-detail-top p{margin: 4px 0;}
.order-detail-top .time{color: #FFBD27;}

.seller-phone{text-align: center;padding: 10px;background: #fff;color: #333;display: block;border-top: 1px solid #eee;}
.seller-phone .iconfont{color: #FFBD27;margin-right: 5px;}

.seller-info{background: #fff;border-bottom: 1px solid #eee;padding: 15px;overflow: hidden;}
.seller-info img{width: 40px;height: 40px;float: left;margin-right: 10px;}
.seller-info p{overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
.seller-info p.seller-name{font-weight: bold;}

.a-tell{background: #fff;text-align: right;color: #333;padding: 15px;display: block;}
.a-tell .phone{margin-left: 10px;color: #F4BE42;}

.send-btm-nav{position: fixed;width: 100%;left: 0;bottom: 0;background: #fff;z-index: 3;display: flex;font-size: 15px;border-top: 1px solid #eee;}
.send-btm-nav span{flex: 1;text-align: center;height: 45px;line-height: 45px;}
.send-btm-nav span.active{color: #F4BE42;}
.cell-value{flex: none;}
</style>