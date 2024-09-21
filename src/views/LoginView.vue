<template>
  <div class="login-container">
    <div
        style="width: 400px; height: 400px; margin: 150px auto; background-color:rgba(396,396,279,0.5); border-radius: 10px">
      <div style="width: 100%; height: 60px; margin-top: 30px; font-size: 30px; text-align: center; color: #4a5ed0">
        养发馆预约系统
      </div>
      <div style="width: 100%; height: 50px; font-size: 25px; text-align: center; color: #4a5ed0">
        欢迎登录
      </div>
      <div style=" height: 320px;">
        <el-form :model="from" :rules="rules" label-width="13%">
          <el-form-item prop="username">
            <el-input v-model="from.username" prefix-icon="el-icon-user" style="width: 86%"
                      placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="from.password" show-password prefix-icon="el-icon-lock" style="width: 86%"
                      placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <div style="display: flex;">
              <el-input v-model="from.verCode" prefix-icon="el-icon-user" style="width: 42%; margin-right: 10px"
                        placeholder="请输入验证码"></el-input>
              <img :src="captchaUrl" @click="clickImg()" width="140px" height="33px"/>
            </div>
          </el-form-item>
          <!--          <el-form-item>-->
          <!--            <el-select v-model="from.role" style="width: 86%" placeholder="请选择角色">-->
          <!--              <el-option label="管理员" value="ADMIN"> </el-option>-->
          <!--              <el-option label="技师" value="TECHNICIAN"> </el-option>-->
          <!--              <el-option label="顾客" value="USER"> </el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item>
            <el-button style="width: 86%; margin-top: 10px" type="primary" @click="login()">登录</el-button>
          </el-form-item>
          <div style="text-align: center">
            未有账号？<a href="javascript:void(0)" style="text-decoration: none" @click="navRegister">点击注册</a>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>

import request from "@/utils/request";

export default {
  name: "Login",
  data() {
    return {
      from: {role: ''},
      key: '',
      captchaUrl: '',
      rules: {
        username: [
          {required: true, message: '请输入账号', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        verify: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ],

      }
    }
  },
  // 页面加载的时候，做一些事情，在created里面
  mounted() {
    this.key = Math.random();
    this.captchaUrl = 'http://localhost:8085/api/validCode?key=' + this.key;
  },
  // 定义一些页面上控件出发的事件调用的方法
  methods: {
    login() {
      request.post("/login?key=" + this.key, this.from).then(res => {
        if (res.code === 0) {
          this.$message.success("登录成功");
          console.log(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
          if (res.data.role === 'ADMIN') {
            this.$router.push("/salon");
          } else if (res.data.role === 'MANAGER' || res.data.role === 'TECHNICIAN') {
            this.$router.push("/userAppointment");
          } else if (res.data.role === 'USER') {
            this.$router.push("/appointment");
          }
        } else {
          this.$message.error(res.msg);
          this.key = Math.random();
          this.captchaUrl = 'http://localhost:8085/api/validCode?key=' + this.key;
          this.from.verCode = ''
        }
      }).catch(err => {
        console.log(err);
      });
    },
    clickImg() {
      this.key = Math.random();
      this.captchaUrl = 'http://localhost:8085/api/validCode?key=' + this.key;
    },
    navRegister() {
      this.$router.push("/register")
    }
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  overflow: hidden;
  background-image: url("@/assets/login.jpg");
  background-size: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
