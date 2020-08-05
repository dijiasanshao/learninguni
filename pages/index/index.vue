<template>
	
	<view class="content">
		<!-- <helloComp myval = "hello next"></helloComp>
		<trailerStars innerScore= "8"></trailerStars> -->
		<!-- 轮播图 开始 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<!-- <swiper-item>
				<image src="../../static/carousel/batmanvssuperman.png" class="carousel"></image>
			</swiper-item>
			<swiper-item>
				<image src="../../static/carousel/spiderman.png" class="carousel"></image>
			</swiper-item> -->
			<swiper-item v-for="carousel in carouselList">
				<image :src="carousel.image" class="carousel" @click="showTrailer"></image>
			</swiper-item>

		</swiper>
		<!-- 轮播图 结束 -->
		<!-- 热门 开始 -->
		<view class="page-block super-hot">
			<view class="hot-title-wapper">
				<image src="../../static/icos/hot.png" mode="" class="hot-ico"></image>
				<view class="hot-title">
					热门超英
				</view>
			</view>
		</view>
		<scroll-view scroll-x="true" class="page-block hot">

			<view class="single-poster" v-for="(superhero,index) in hotSuperheroList" :key="index">
				<view class="poster-wapper">
					<image :src="superhero.cover" class="poster" mode=""></image>
					<view class="movie-name">
						{{superhero.name}}
					</view>
					<trailerStars :innerScore="superhero.score" showNum="1"></trailerStars>
				</view>
			</view>
			


		</scroll-view>
		<!-- 热门 结束 -->
		
		<!-- 热门预告 开始 -->
		<view class="page-block super-hot">
			<view class="hot-title-wapper">
				<image src="../../static/icos/interest.png" mode="" class="hot-ico"></image>
				<view class="hot-title">
					热门预告
				</view>
			</view>
		</view>
		<view class="hot-movies page-block">
			<video v-for="trailer in hotTrailerList" :src="trailer.trailer" :poster="trailer.poster" controls="controls" class="hot-movie-single" :id="trailer.id" :data-palyintIndex="trailer.id" @play="meIsPlaying"></video>
		</view>
		<!-- 热门预告 结束 -->
		<!-- 猜你喜欢 开始 -->
		<view class="page-block super-hot">
			<view class="hot-title-wapper">
				<image src="../../static/icos/guess-u-like.png" mode="" class="hot-ico"></image>
				<view class="hot-title">
					猜你喜欢
				</view>
			</view>
			
		</view>
		<view class="page-block guess-u-like">
			<view class="single-like-movie" v-for="(guess,gIndex) in guessULikeList">
				<image :src="guess.cover" class="like-movie" mode=""></image>
				<view class="movie-desc">
					<view class="movie-title">
						{{guess.name}}
					</view>
					<trailerStars :innerScore="guess.score" showNum="0"></trailerStars>
					<view class="movie-info">
						{{guess.basicInfo}}
					</view>
					<view class="movie-info">
						{{guess.releaseDate}}
					</view>
				</view>
				
				<view class="movie-oper"  @click="praiseMe" :data-gIndex="gIndex">
					<image src="../../static/icos/praise.png" class="praise-ico"></image>
					<view class="praise-me">赞一下</view>
					<view class="praise-me animation-opacity" :animation="animationDataArr[gIndex]"></view>
				</view>
			</view>
		</view>
		<!-- 猜你喜欢 结束 -->
	</view>
</template>

<script>
	// import common from "../../common/common.js";
	// 导入自定义组件
	import helloComp from "../../components/helloComp.vue";
	import trailerStars from "../../components/trailerStars.vue"
	export default {
		data() {
			return {
				title: 'Hello',
				carouselList: [],
				hotSuperheroList: [],
				hotTrailerList: [],
				animationData:{},
				guessULikeList: [],
				animationDataArr: [
					{}, {}, {}, {}, {}
				]
				
			}
		},
		
		onUnload() {
// 页面卸载的时候，清除动画数据
			this.animationData = {};
			this.animationDataArr = [
				{}, {}, {}, {}, {}
			];
		},
		onPullDownRefresh() {
			this.refresh();
		},
		onLoad() {
			var me = this;
			
		// #ifdef APP-PLUS || MP-WEIXIN
		// 在页面创建的时候，创建一个临时动画对象
		this.animation = uni.createAnimation();
		// #endif
			// 获取common.js 服务器中的url
			// var serverUrl = common.serverUrl;
			// 通过挂载到main.js 中获取服务器的地址，作为全局变量
			var serverUrl = me.serverUrl;
			// 查询热门超英
			uni.request({
				// 请求轮播图数据
				url: serverUrl + '/index/carousel/list', //仅为示例，并非真实接口地址。
				method: "POST",
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					qq: '2573971154'
				},
				success: (res) => {

					console.log("请求轮播图数据");
					// 获取真是数据之前，务必判断状态是否为200
					if (res.data.status == 200) {
						var carouselList = res.data.data;
						me.carouselList = carouselList;
					}
				}
			});
			uni.request({
				// 请求超英
				url: serverUrl + '/index/movie/hot?type=superhero', //仅为示例，并非真实接口地址。
				method: "POST",
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					qq: '2573971154'
				},
				success: (res) => {

					// 获取真是数据之前，务必判断状态是否为200
					if (res.data.status == 200) {
						var hotSuperheroList = res.data.data;
						me.hotSuperheroList = hotSuperheroList;
					}
				}
			});
			uni.request({
				// 请求热门
				url: serverUrl + '/index/movie/hot?type=trailer', //仅为示例，并非真实接口地址。
				method: "POST",
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					qq: '2573971154'
				},
				success: (res) => {
				
					console.log("请求热门");
					// 获取真是数据之前，务必判断状态是否为200
					if (res.data.status == 200) {
						var hotTrailerList = res.data.data;
						me.hotTrailerList = hotTrailerList;
					}
				}
			});uni.request({
				// 请求轮播图数据
				url: serverUrl + '/index/movie/hot?type=trailer', //仅为示例，并非真实接口地址。
				method: "POST",
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					qq: '2573971154'
				},
				success: (res) => {
					
					console.log(res);
					// 获取真是数据之前，务必判断状态是否为200
					if (res.data.status == 200) {
						var hotTrailerList = res.data.data;
						me.hotTrailerList = hotTrailerList;
					}
				}
			});
		
				this.refresh();
		},
		onHide() {
			if (this.videoContext) {
				this.videoContext.pause();
			}
		},
		methods: {
			// 播放一个视频的时候，需要暂停其他正在播放的视频
			meIsPlaying(){
				var me = this;
				var trailerId = "";
				if(e){
					trailerId = e.currentTarget.dataset.playintindex;
					me.videoContext = uni.createVideoContext(trailerId);
				}
				var hotTrailerList = me.hotTrailerList;
				for(var i = 0;i<hotTrailerList.length;i++){
					var tempId = hotTrailerList[i].id;
					if(tempId!=trailerId){
						uni.createVideoContext(tempId).pause();
					}
				}
			},
			refresh() {
				var me = this;
				
				uni.showLoading({
					mask: true
				});
				uni.showNavigationBarLoading();
				
				
				var serverUrl = me.serverUrl;
				// 查询猜你喜欢数据列表
				uni.request({
					url: serverUrl + '/index/guessULike',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						qq: '2573971154'
					},
					method: "POST",
					success: (res) => {
						// 获取真实数据之前，务必判断状态是否为200
						console.log(res.data)
						if (res.data.status == 200) {
							var guessULikeList = res.data.data;
							me.guessULikeList = guessULikeList;
						}
					},
					complete: () => {
						uni.hideNavigationBarLoading();
						uni.hideLoading();
						uni.stopPullDownRefresh();
					}
				});
			},
			// 实现点赞动画效果
			praiseMe(e) {
				// #ifdef APP-PLUS || MP-WEIXIN
				var gIndex = e.currentTarget.dataset.gindex;
				console.log(gIndex);
				// return;
				// 构建动画数据，并且通过step来表示这组动画的完成
				this.animation.translateY(-60).opacity(1).step({
					duration: 400
				});
				
				// 导出动画数据到view组件，实现组件的动画效果
				// this.animationData = this.animation.export();
				this.animationData = this.animation;
				this.animationDataArr[gIndex] = this.animationData.export();
			
				// 还原动画
				setTimeout(function() {
					this.animation.translateY(0).opacity(0).step({
						duration: 0
					});
					this.animationData = this.animation;
					this.animationDataArr[gIndex] = this.animationData.export();
				}.bind(this), 500)
				// #endif
			}
		},
		components:{
			helloComp,
			trailerStars
		}
	}
</script>

<style>
	@import url("index.css");
</style>
