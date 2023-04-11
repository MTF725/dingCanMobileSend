<template>
	<div class="order-manage" style="padding-bottom: 45px;">
		<!-- 顶部导航 -->
		<top-fixed-nav title="订单管理"></top-fixed-nav>
		<!-- 订单状态切换 -->
		<div style="height: 40px;">
			<div class="order-state-nav">
				<span :class="{active:tabNum==1}" v-on:click="getDaiSend">待配送</span>
				<span :class="{active:tabNum==2}" v-on:click="getSending">配送中</span>
				<span :class="{active:tabNum==3}" v-on:click="getDone">已完成</span>
			</div>
		</div>
		
		<!-- 下拉刷新 -->
		<van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
			<!-- 待配送、新订单列表 -->
			<div class="new-order-list" style="min-height: 300px;">
				<ul v-if="tabNum!=3">
					<li v-for="item in waitOrderList" v-on:click="openNewOrderDetail(item.orderNo)">
						<p class="send-time"><i class="iconfont icon-iconfontcolor35"></i>期望时间 {{item.arrivalTime}} 送达</p>
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
						<div class="big-btn-wrap two" v-show="tabNum==1&&item.outMealState==1">
							<van-button type="primary"  color="#F4BE42" v-on:click.stop="confirmTakeMeal(item.orderNo)">确定取餐</van-button>
							<van-button type="default" v-on:click.stop="transferOrder(item.orderNo)">转单</van-button>
						</div>
						<div class="big-btn-wrap" v-show="tabNum==2">
							<van-button type="primary" block color="#F4BE42" v-on:click.stop="confirmService(item.orderNo)">确定送达</van-button>
						</div>
					</li>
				</ul>
				<div v-else>
					<div style="height: 50px;">
						<div class="order-search-wrap">
							<van-field
							  v-model="orderSearch" center clearable placeholder="输入姓名或手机号查询">
							  <template #button>
							    <van-button color="#F4BE42" size="small" type="primary" v-on:click="searchOrderBtn">查询</van-button>
							  </template>
							</van-field>
						</div>
					</div>
					
					<ul>
						<li v-for="item in doneList" v-on:click="openNewOrderDetail(item.orderNo)">
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
						</li>
					</ul>
				</div>
			</div>
		</van-pull-refresh>
	
		
		
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
					<div class="big-btn-wrap two" v-show="tabNum==1" style="margin: 10px;">
						<van-button type="primary"  color="#F4BE42" v-on:click.stop="confirmTakeMeal(orderDetail.orderNo,'true')">确定取餐</van-button>
						<van-button type="default" v-on:click.stop="transferOrder(orderDetail.orderNo)">转单</van-button>
					</div>
					<div class="big-btn-wrap" v-show="tabNum==2" style="margin: 10px;">
						<van-button type="primary" block color="#F4BE42" v-on:click.stop="confirmService(orderDetail.orderNo,'true')">确定送达</van-button>
					</div>
					
					
				</div>
			</div>
		</van-popup>
		
		
		<!-- 转单 -->
		<van-popup :close-on-click-overlay="false" :style="{width:'80%', height: '240px',background:'#fff',borderRadius:'6px',boxSizing:'border-box',padding:'20px'}" v-model="transferOrderPopup">
			<div class="transfer-reason">
				<van-field
				  v-model="transferOrderReason"
				  rows="3"
				  type="textarea"
				  maxlength="50"
				  placeholder="请输入转单原因"
				  show-word-limit
				/>
			</div>
			<div class="big-btn-wrap two" style="margin-top: 15px;">
				<van-button type="default" v-on:click="transferOrderPopup=false">取消</van-button>
				<van-button type="primary"  color="#F4BE42" v-on:click.stop="transferOrderConfirm()">确定</van-button>
			</div>
		</van-popup>
	</div>
</template>

<script type="text/javascript">
var pageNum=1;
	export default{
		data:function(){
			return{
				tabNum:1,
				sendPersonName:'',//配送员姓名
				sendPersonPhone:'',//配送员电话
				title:'订单',
				leftSidePopup:false,//左侧设置
				waitOrderList:[],//新订单
				orderDetailPopup:false,//订单详情
				orderDetail:'',//订单详情
				sendAddress:'',//配送地址
				transferOrderPopup:false,//转单
				transferOrderReason:'',//转单原因
				transferOrderNo:'',//转单单号
				refreshLoading: false,//下拉刷新
				doneList:[],//已完成
				orderSearch:'',//已完成搜索框
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
						if(this.tabNum==1){
							console.log('待配送到底了',pageNum)
							this.getWaitOrderList(pageNum);
						}
						
						if(this.tabNum==2){
							console.log('配送中到底了',pageNum)
							this.getOrderList(pageNum);
						}
						
						if(this.tabNum==3){
							console.log('已完成到底了',pageNum)
							this.getDoneList(pageNum,this.orderSearch?this.orderSearch:'');
						}
						
						
					}
			},
			// 下拉刷新
			 onRefresh() {
				 pageNum=1;
				 this.waitOrderList=[];
				 this.doneList=[];
			        if(this.tabNum==1){
						this.getWaitOrderList(pageNum);
						setTimeout(()=>{
							this.$toast('待配送已刷新');
							this.refreshLoading = false;
						},100)
						
					}
					if(this.tabNum==2){
						this.getOrderList(pageNum);
						setTimeout(()=>{
							this.$toast('配送中已刷新');
							this.refreshLoading = false;
						},100)
					}
					if(this.tabNum==3){
						this.getDoneList(pageNum);
						setTimeout(()=>{
							this.$toast('已完成已刷新');
							this.refreshLoading = false;
						},100)
					}
					
			    },
				// 已完成搜索按钮
				searchOrderBtn(){
					if(this.orderSearch==''){
						this.$toast('请输入姓名或手机号');
						return;
					}
					pageNum=1;
					this.doneList=[];
					this.getDoneList(pageNum,this.orderSearch);
				},
			// 转单原因确定
			transferOrderConfirm(){
				var _this=this;
				if(_this.transferOrderReason==''){
					_this.$toast('请输入转单原因');
					return;
				}
				_this.transferOrderPopup=false;
				var load=_this.$toast.loading({
				  message: '提交中...',
				  duration:0,
				  forbidClick: true,
				});
				_this.$axios({
					  method: 'post',
					  url: port+'/v1/deliveryOrder/changeDelivery',
					  headers:{'token':localStorage.getItem('sendToken')},
					  params: {
						orderNo:_this.transferOrderNo,
						personName:JSON.parse(localStorage.getItem('sendPerson')).pName,
						phone:JSON.parse(localStorage.getItem('sendPerson')).pMobile,
						remark:_this.transferOrderReason
					  }
					}).then(function(data){
						console.log('转单提交',data)
						load.clear();
						
						if (data.data.status==200) {
							_this.waitOrderList=[];
							_this.$toast('转单成功');
							setTimeout(()=>{
								_this.getWaitOrderList(pageNum);
							},500)
							
							if(_this.orderDetailPopup==true){
								_this.orderDetailPopup=false
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
			// 打开转单原因
			transferOrder(orderNo){
				var _this=this;
				_this.transferOrderNo=orderNo;
				_this.transferOrderPopup=true
			},
			// 确定送达
			confirmService(orderNo,detailConfirm){
				var _this=this;
				var load=_this.$toast.loading({
				  message: '提交中...',
				  duration:0,
				  forbidClick: true,
				});
				_this.$axios({
					  method: 'post',
					  url: port+'/v1/order/arrive',
					  headers:{'token':localStorage.getItem('sendToken')},
					  params: {
						orderNo:orderNo,
					  }
					}).then(function(data){
						console.log('确定送达',data)
						load.clear();
						if (data.data.status==200) {
							_this.$toast('已送达');
							setTimeout(()=>{
								_this.orderDetailPopup=false;
								_this.waitOrderList=[];
								_this.getOrderList(pageNum);
								_this.getDone();
							},500)
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
			// 确定取餐
			confirmTakeMeal(orderNo,detailConfirm){
				var _this=this;
				var load=_this.$toast.loading({
				  message: '提交中...',
				  duration:0,
				  forbidClick: true,
				});
				_this.$axios({
					  method: 'post',
					  url: port+'/v1/deliveryOrder/takeMeal',
					  headers:{'token':localStorage.getItem('sendToken')},
					  params: {
						orderNo:orderNo,
						personName:JSON.parse(localStorage.getItem('sendPerson')).pName,
						phone:JSON.parse(localStorage.getItem('sendPerson')).pMobile,
					  }
					}).then(function(data){
						console.log('确定取餐',data)
						load.clear();
						if (data.data.status==200) {
							
							_this.waitOrderList=[];
							_this.$toast('已取餐');
							setTimeout(()=>{
								_this.getWaitOrderList(pageNum);
								_this.getSending();
							},500)
							if(detailConfirm){
								_this.orderDetailPopup=false
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
			// 店家待配送
			getDaiSend(){
				var _this=this;
				pageNum=1;
				_this.waitOrderList=[];
				_this.tabNum=1;
				_this.getWaitOrderList(pageNum)
			},
			// 点击配送中
			getSending(){
				var _this=this;
				pageNum=1;
				_this.waitOrderList=[];
				_this.tabNum=2;
				_this.getOrderList(pageNum)
			},
			// 切换已完成
			getDone(){
				var _this=this;
				pageNum=1;
				_this.orderSearch='';
				_this.doneList=[];
				_this.tabNum=3;
				_this.getDoneList(pageNum);
			},
			
			// 打开新订单详情
			openNewOrderDetail(orderNo){
				this.orderDetailPopup=true
				this.getOrderDetail(orderNo)
			},
		
			// 打开左侧popup
			openLeftSidePopup(){
				this.leftSidePopup=true
			},
			// 配送中订单列表（配送中（8））
			getOrderList(pageNum){
				var _this=this
				if(localStorage.getItem('sendToken')){
					var load=_this.$toast.loading({
					  message: '加载中...',
					  duration:0,
					  forbidClick: true,
					});
					_this.$axios({
						  method: 'get',
						  url: port+'/v1/deliveryOrder/query',
						  headers:{'token':localStorage.getItem('sendToken')},
						  params: {
							stateId:8,
							pageNum:pageNum,
							pageSize:5,
							personId :JSON.parse(localStorage.getItem('sendPerson')).pId
						  }
						}).then(function(data){
							console.log('配送中',data)
							
							load.clear();
							if (data.data.status==200) {
								if(data.data.data.list.length<=0){
									_this.$toast('没有更多数据');
								}else{
									for (var i=0;i<data.data.data.list.length;i++) {
										_this.waitOrderList.push(data.data.data.list[i])
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
			// 查询待配送
			getWaitOrderList(pageNum){
				var _this=this
				if(localStorage.getItem('sendToken')){
					var load=_this.$toast.loading({
					  message: '加载中...',
					  duration:0,
					  forbidClick: true,
					});
					_this.$axios({
						  method: 'get',
						  url: port+'/v1/deliveryOrder/queryDeliverying',
						  headers:{'token':localStorage.getItem('sendToken')},
						  params: {
							pageNum:pageNum,
							pageSize:5,
							personId :JSON.parse(localStorage.getItem('sendPerson')).pId
						  }
						}).then(function(data){
							console.log('待配送',data)
							
							load.clear();
							if (data.data.status==200) {
								if(data.data.data.list.length<=0){
									_this.$toast('没有更多数据');
								}else{
									for (var i=0;i<data.data.data.list.length;i++) {
										_this.waitOrderList.push(data.data.data.list[i])
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
			// 已完成列表
			getDoneList(pageNum,keyword){
				var _this=this
				if(localStorage.getItem('sendToken')){
					var load=_this.$toast.loading({
					  message: '加载中...',
					  duration:0,
					  forbidClick: true,
					});
					_this.$axios({
						  method: 'get',
						  url: port+'/v1/deliveryOrder/queryFinish',
						  headers:{'token':localStorage.getItem('sendToken')},
						  params: {
							pageNum:pageNum,
							pageSize:5,
							personId :JSON.parse(localStorage.getItem('sendPerson')).pId,
							keyword:keyword
						  }
						}).then(function(data){
							console.log('已完成',data)
							load.clear();
							if (data.data.status==200) {
								if(data.data.data.list.length<=0){
									_this.$toast('没有更多数据');
								}else{
									for (var i=0;i<data.data.data.list.length;i++) {
										_this.doneList.push(data.data.data.list[i])
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
			this.getWaitOrderList(pageNum);
			if(localStorage.getItem('sendPerson')){
				var sendPerson=JSON.parse(localStorage.getItem('sendPerson'))
				this.sendPersonName=sendPerson.pName;
				this.sendPersonPhone=sendPerson.pMobile;
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
.head-set p{line-height: 2em;padding: 0 20px;}
.head-set p .iconfont{color: #F4BE42;margin-right: 10px;}

.order-tab{position: fixed;width: 100%;line-height: 45px;left: 0;top: 40px;display: flex;padding: 10px;box-sizing: border-box;z-index: 2;background-color: #f9f9f9;}
.order-tab div{flex: 1;text-align: center;background-color: #fff;}
.order-tab div.active{background-color: #FDF2D9;}
.order-tab div.active .iconfont{color: #F4BE42;}
.order-tab .iconfont{margin-right: 4px;font-size: 20px;vertical-align: middle;}

.new-order-list li{background: #fff;margin:10px;padding-bottom: 10px;}
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

.order-state-nav{position: fixed;width: 100%;left: 0;top: 40px;display: flex;z-index: 3;border-bottom: 1px solid #eee;}
.order-state-nav span{flex: 1;text-align: center;height: 40px;line-height: 40px;background: #fff;position: relative;}
.order-state-nav span.active::after{content: '';position: absolute;width: 50px;height: 3px;background-color: #F4BE42;left: 50%;bottom: 0;transform: translateX(-50%);}
.cell-value{flex: none;}
.transfer-reason{border: 1px solid #ddd;}

.order-no{color: #999;}

.order-search-wrap{position: fixed;width: 100%;left: 0;top: 81px;z-index: 3;border-bottom: 1px solid #eee;}
</style>