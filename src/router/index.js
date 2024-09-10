import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LayoutView from "@/views/Layout.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView";
import TechnicianView from "@/views/TechnicianView.vue";
import AppointmentView from "@/views/AppointmentView.vue";
import MyAppointmentView from "@/views/MyAppointmentView.vue";
import UserAppointmentView from "@/views/UserAppointmentView.vue";
import SalonView from "@/views/SalonView.vue";
import PasswordView from "@/views/PasswordView.vue";
import PersonalView from "@/views/PersonalView.vue";
import ServiceView from "@/views/ServiceView.vue";


Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/',
    name: 'Layout',
    component: LayoutView,
    children: [
      {
        path: '',
        component: HomeView
      },
      {
        path: '/password',
        name: 'Password',
        component: PasswordView
      },
      {
        path: '/appointment',
        name: 'Appointment',
        component: AppointmentView
      },
      {
        path: '/myAppointment',
        name: 'MyAppointment',
        component: MyAppointmentView
      },//UserAppointmentView
      {
        path: '/userAppointment',
        name: 'UserAppointment',
        component: UserAppointmentView
      },
      {
        path: '/salon',
        name: 'Salon',
        component: SalonView
      },
      {
        path: '/personal',
        name: 'Personal',
        component: PersonalView
      },
      {
        path: '/service',
        name: 'Service',
        component: ServiceView
      },
      {
        path: 'technician',
        component: TechnicianView
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to ,from, next) => {
  const user = localStorage.getItem("user");
  if (!user && to.path !== '/login' && to.path !== '/register') {
    return next("/login");
  }
  next();
})

export default router
