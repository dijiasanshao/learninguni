<template>
	<view class="page">
		<view class="search-block">
			<view class="search-ico-wapper">
				<image src="../../static/icos/search.png" mode="" class="search-ico"></image>
			</view>
			<input type="text" value="" placeholder="搜索预告" class="search-text" maxlength="12" confirm-type="search" @confirm="searchMe" />
		</view>
		<view class="movie-list page-block">
			<view class="movie-wapper" v-for="trailer in trailerList">
				
				<image :src="trailer.cover" class="poster" mode="" :data-trailerId="trailer.id" @click="showTrailer"></image>
				<view class="movie-info">
					{{trailer.name}}
				</view>
			</view>


		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				trailerList: [],
				keywords: '', // 搜索的关键字
				page: 1, // 页数
				totalPages: 1 //
			}
		},
		onLoad() {
			var me = this;
			uni.showLoading({
				mask: true,
				title: "请稍后..."
			});
			uni.showNavigationBarLoading();

			var serverUrl = me.serverUrl;
			// 查询猜你喜欢数据列表
			uni.request({
				url: serverUrl + '/search/list?keywords=&page=&pageSize=',
				method: "POST",
				header: {
					'content-type': 'application/x-www-form-urlencoded'
				},
				data: {
					qq: '2573971154'
				},
				success: (res) => {
					// 获取真实数据之前，务必判断状态是否为200
					if (res.data.status == 200) {
						// debugger;
						// console.log(res.data.data.rows)
						var trailerList = res.data.data.rows;
						me.trailerList = trailerList;
					}
				},
				complete: () => {
					uni.hideNavigationBarLoading();
					uni.hideLoading();
				}
			});
		},
		onReachBottom() {
			var me = this;
			var page = me.page+1;// 查询下一个页面，当前页数累加1
			var keywords = me.keywords;// 获得当前页面中data里的搜索值
			var totalPages = me.totalPages;// 获取总页数
			
			// 如果当前需要分页的分页数和总页数相等，就不分页
			if(page>totalPages){
				return;
			}
			me.pagedTrailerList(keywords,page,15);
		},
		methods: {
			showTrailer(e){
				var trailerId = e.currentTarget.dataset.trailerid;
				// 页面接口api
				
				uni.navigateTo({
					url:'../movie/movie?trailerId='+trailerId
				})
			},
			pagedTrailerList(keywords, page, pageSize) {
				var me = this;
				uni.showLoading({
					mask: true,
					title: "请稍后..."
				});
				uni.showNavigationBarLoading();

				var serverUrl = me.serverUrl;
				// 查询猜你喜欢数据列表
				uni.request({
					url: serverUrl + '/search/list?keywords=' + keywords +
						'&page=' + page +
						'&pageSize=' + pageSize,
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						qq: '2573971154'
					},
					success: (res) => {
						// 获取真实数据之前，务必判断状态是否为200
						if (res.data.status == 200) {
							// debugger;
							var tempList = res.data.data.rows;
							me.trailerList = me.trailerList.concat(tempList);
							me.totalPages = res.data.data.total; // 获取总页数
							me.page = page; // 覆盖当前页面里的page
							
						}
					}, 
					complete: () => {
						uni.hideNavigationBarLoading();
						uni.hideLoading();
					}
				});
			},
			searchMe(e) {
				var me = this;
				// 获取搜索的内容
				var value = e.detail.value;
				
				me.keywords = value;
				me.trailerList = [];
				
				me.pagedTrailerList(value,1,15);
				console.log(me.pagedTrailerList(value,1,15))

			}
		}
	}
</script>

<style>
	@import url("search.css");
</style>
