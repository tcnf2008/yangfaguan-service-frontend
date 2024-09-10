<template>
  <div>
    <el-container>
      <el-header
          style="background-color: #4c535a; height: 80px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center;">
          <img src="../assets/system_logo.png" alt=""
               style="width: 80px; height: 80px;position: relative;margin-left: 20px; border-radius: 50%;">
          <span style="font-size: 25px; margin-left: 10px; color: #FF7F50">养发馆预约系统</span>
        </div>
        <el-dropdown style="float: right; height: 60px; line-height: 60px" @command="handleCommand">
          <span class="el-dropdown-link" style=" color: white; font-size: 16px; display: flex; align-items: center;">

            <div class="block" style="margin-top: 10px;" v-if="user.avatar === null">
              <el-avatar shape="circle" :size="medium" :src="circleUrl"></el-avatar>
            </div>
            <div class="block" style="margin-top: 10px;" v-else>
              <el-image style="width: 50px; height: 50px; border-radius: 50%; margin-right: 5px;"
                        :src="'http://localhost:8085/api/files/' + user.avatar"
                        :preview-src-list="['http://localhost:8085/api/files/' + user.avatar]">
              </el-image>
            </div>
            <span style="margin-bottom: 10px;">{{ user.name }}</span>
            <span style="margin-bottom: 6px;">（{{ user.roleName }}）</span>
            <i class="el-icon-arrow-down el-icon--right" style="margin-left: 5px;margin-bottom: 5px;"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="myInfo">个人信息</el-dropdown-item>
            <el-dropdown-item command="changePwd">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
    </el-container>

    <el-container>
      <el-aside style="overflow: hidden; min-height: 100vh; background-color: #545c64; width: 250px">
        <el-menu :default-active="$route.path" router background-color="#545c64" text-color="#fff"
                 active-text-color="#ffd04b">

          <el-menu-item v-if="user.role === 'USER'" index="/appointment">
            <i class="el-icon-shopping-cart-2"></i>
            <span slot="title">服务预约</span>
          </el-menu-item>
          <el-menu-item v-if="user.role === 'USER'" index="/myAppointment">
            <i class="el-icon-s-goods"></i>
            <span slot="title">我的预约</span>
          </el-menu-item>

          <el-submenu index="2" v-if="user.role === 'ADMIN'||user.role === 'MANAGER'||user.role === 'TECHNICIAN'">
            <template slot="title">
              <i class="el-icon-location"></i><span>门店信息管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-if="user.role === 'ADMIN'" index="/salon">门店信息</el-menu-item>
              <el-menu-item v-if="user.role === 'ADMIN' ||user.role === 'MANAGER'" index="/technician">技师信息
              </el-menu-item>
              <el-menu-item index="/service">技能服务信息</el-menu-item>
              <el-menu-item index="/userAppointment">顾客预约信息</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-s-custom"></i><span>个人中心</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/password">修改密码</el-menu-item>
              <el-menu-item index="/personal">个人信息</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Layout",

  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      form: {},
    }
  },
  // 页面加载的时候，做一些事情，在created里面
  mounted() {
  },
  methods: {
    handleCommand(command) {
      if (command == "logout") {
        this.form = this.user;
        request.post("/out", this.form).then(res => {
          if (res.code === 0) {
            this.$message.success('已退出系统');
          } else {
            this.$message(res.msg);
          }
        }).catch(err => {
          console.log(err);
        });
        localStorage.removeItem("user");
        this.$router.push("/login");
      } else if (command == "myInfo") {
        console.log(this.$route.path); // 打印当前路径
        if ("/personal" === this.$route.path) {
          this.$message.success('当前已在个人信息页面');
        } else {
          this.$router.push("/personal");
        }
      } else {
        console.log(this.$route.path); // 打印当前路径
        if ("/password" === this.$route.path) {
          this.$message.success('当前已在修改密码页面');
        } else {
          this.$router.push("/password");
        }
      }
    }
  }
}
</script>

<style>
.el-menu {
  border-right: none !important;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>