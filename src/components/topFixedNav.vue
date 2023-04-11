<template>
	<div style="height: 40px;">
			<div class="top-fixed-nav">
				<div class="back iconfont icon-zuojiantou" @click="backPrevPage"></div>
				<span class="title">{{title}}</span>
			</div>
		</div>
</template>

<script type="text/javascript">
export default {
  name: 'topFixedNav',
  props: {
    title: String
  },
  methods:{
  	// 返回上一页
	backPrevPage(){
		this.$router.back(-1);
	},
  }
}
</script>

<style type="text/css" scoped>

</style>