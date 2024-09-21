// import Vue from 'vue'
// import VueRouter from 'vue-router'
// import HomeView from '@/views/HomeView.vue'
// import LoginView from "@/views/LoginView.vue";
// import SalonView from "@/views/SalonView.vue";
// import TechnicianView from "@/views/TechnicianView.vue";
// import AppointmentView from "@/views/AppointmentView.vue";
// import MyAppointmentView from "@/views/MyAppointmentView.vue";
// import UserAppointmentView from "@/views/UserAppointmentView.vue";
// import LayoutView from "@/views/Layout.vue";
// import RegisterView from "@/views/RegisterView";
// import ServiceView from "@/views/ServiceView.vue";
// import NoticeView from "@/views/NoticeView";
//
//
// Vue.use(VueRouter)
//
// const routes = [
//     {
//         path: '/login',
//         name: 'Login',
//         component: LoginView
//     },
//     {
//         path: '/register',
//         name: 'Register',
//         component: RegisterView
//     },
//     {
//         path: '/',
//         name: 'Layout',
//         component: LayoutView,
//         children: [
//             {
//                 path: '',
//                 component: HomeView
//             },
//             {
//                 path: 'appointment',
//                 component: AppointmentView
//             },
//             {
//                 path: 'myAppointment',
//                 component: MyAppointmentView
//             },
//             {
//                 path: 'userAppointment',
//                 component: UserAppointmentView
//             },
//             {
//                 path: 'technician',
//                 component: TechnicianView
//             },
//             {
//                 path: 'service',
//                 component: ServiceView
//             },
//             {
//                 path: 'reserve',
//                 component: ReserveView
//             },
//             {
//                 path: 'notice',
//                 component: NoticeView
//             },
//             {
//                 path: 'salon',
//                 component: SalonView
//             },
//         ]
//     },
// ]
//
// const router = new VueRouter({
//     mode: 'history',
//     base: process.env.BASE_URL,
//     routes
// })
//
// // 路由守卫
// router.beforeEach((to, from, next) => {
//     const user = localStorage.getItem("user");
//     if (!user && to.path !== '/login' && to.path !== '/register') {
//         return next("/login");
//     }
//     next();
// })
//
// export default router
