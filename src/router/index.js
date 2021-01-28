import Vue from 'vue'
import Router from 'vue-router'
// import Landing from '../components/Landing/Landing.vue'

Vue.use(Router)
Router.prototype.goBack = function () { 
　　this.isBack = true
}
export default new Router({
	mode: 'history',
  routes: [
    {
      path: '/landing',
      name: 'Landing',
			component:()=> 
			import ('../components/Landing/Landing.vue')
	},
	{
		path: '*',
		name: '首页',
		component:()=> 
			import ('../components/Home/Home.vue'),
		redirect: '/nav',
	},
	{
		path: '/Home',
		name: '首页',
		
		redirect: '/nav',
		component:()=> 
			import ('../components/Home/Home.vue'),
		children:[
			{
				path: '/generalView',
				name: '我的',
				redirect: '/equipErr',
				
				component:()=> 
			import ('../components/generalView/generalView.vue'),
				meta: {
					keep_alive: true 
					},
				children:[
					{
						path: '/equipMain',
						name: '我的设备',
						component:()=> 
			import ('../components/equipMain/equipMain.vue'),

					},
					{
						path: '/equipErr',
						name: '设备',
						component:()=> 
					import ('../components/equipErr/equipErr.vue'),
					meta: {
						keep_alive: true 
						},
					},
					{
						path: '/executing',
						name: '正在执行',
						component:()=> 
					import ('../components/list/executing/executing.vue'),
					meta: {
						keep_alive: true 
						},
					},
				]
			},
			{
				path: '/equipManage',
				name: '菜单管理',
				component:()=> 
			import ('../components/equipManage/equipManage.vue'),
				redirect:'/nav',
				children:[
					{
						path: '/nav',
						name: '菜单',
						meta: {
							keep_alive: true 
							},
						component:()=> 
			import ('../components/nav/nav.vue'),
					},
					{
						path: '/electricSet',
						name: '电压临界值设定',
						component:()=> 
			import ('../components/nav/electricSet.vue'),
					},
					{
						path: '/collector',
						name: '无线设备安装',
						meta: {
							keep_alive: true 
							},
							component:()=> 
			import ('../components/list/collector/collector.vue'),
						
					},
					{
						path: '/collectorList',
						name: '设备管理',
						component:()=> 
			import ('../components/list/collectorList/collectorList.vue'),
						meta: {
							keep_alive: true // true 表示需要使用缓存 false表示不需要被缓存
							}
					},
					{
						path: '/watermeter',
						name: '水表安装',
						component:()=> 
			import ('../components/list/watermeter/watermeter.vue'),
						meta: {
							keep_alive: true // true 表示需要使用缓存 false表示不需要被缓存
						}
					},
					{
						path: '/offline',
						name: '离线待安装',
						component:()=> 
			import ('../components/list/offline/offline.vue'),
					},
					{
						path: '/offlineRecord',
						name: '离线记录',
						component:()=> 
			import ('../components/list/offline/offlineRecord.vue'),
					},
					{
						path: '/equipsearchDetail',
						name: '设备详情',
						component:()=> 
			import ('../components/list/equipsearchDetail/equipsearchDetail.vue'),
					},
					{
						path: '/invented',
						name: '虚拟采集器',
						component:()=> 
			import ('../components/list/invented/invented.vue'),
					},
					{
						path: '/textonline',
						name: '联网测试',
						component:()=> 
			import ('../components/list/textonline/textonline.vue'),
					},
					{
						path: '/replaceCollector',
						name: '设备替换查询',
						component:()=> 
			import ('../components/list/replaceCollector/replaceCollector.vue'),
					},
					{
						path: '/replace',
						name: '设备替换',
						component:()=> 
			import ('../components/list/replace/replace.vue'),
					},
					{
						path: '/addCount',
						name: '账户管理',
						meta: {
							keep_alive: true 
						},
						component:()=> 
			import ('../components/addCount/addCount.vue'),
					},
					{
						path: '/areaList',
						name: '区域列表',
						component:()=> 
							import ('../components/addCount/areaList.vue'),
					},
					{
						path: '/waterMerchantList',
						name: '水务商列表',
						component:()=> 
							import ('../components/addCount/waterMerchantList.vue'),
					},
					{
						path: '/accountDetail',
						name: '注册账户',
						component:()=> 
			import ('../components/accountDetail/accountDetail.vue'),
					},
					{
						path: '/testonlineResult',
						name: '联网测试结果',
						component:()=> 
			import ('../components/testonlineResult/testonlineResult.vue'),
					}
				]
			},
			{
				path: '/repairList',
				name: '维修记录',
				meta: {
					keep_alive: true 
					},
				component:()=> 
					import ('../components/repairList/repairList.vue'),
			}
			
		]
	},
	{
		path: '/coloterManage',
		name: '采集器',
		component:()=> 
			import ('../components/list/coloterManage/coloterManage.vue'),
	},
	{
		path: '/watermeterDetail',
		name: '水表',
		component:()=> 
			import ('../components/list/watermeterDetail/watermeterDetail.vue'),
	},
	{
		path: '/singlemeter',
		name: '无线单表',
		component:()=> 
			import ('../components/singlemeter/singlemeter.vue'),
	},
	
  ]
})
