<template>
  <div class="register-container">
    <div
      style="width: 400px; height: 480px; margin: 150px auto; background-color:rgba(165,190,234,0.5); border-radius: 10px">
      <div style="width: 100%; height: 100px; font-size: 30px; line-height: 100px; text-align: center; color: #ffffff">
        顾客注册</div>
      <div style="margin-top: 20px; height: 320px;">
        <el-form :model="form" :rules="rules" label-width="13%">
          <el-form-item prop="username">
            <el-input v-model="form.username" prefix-icon="el-icon-user" style="width: 86%"
              placeholder="请输入账号名（用来登录）"></el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <el-input v-model="form.phone" prefix-icon="el-icon-user" style="width: 86%"
                      placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item prop="name">
            <el-input v-model="form.name" prefix-icon="el-icon-user" style="width: 86%"
                      placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" show-password prefix-icon="el-icon-lock" style="width: 86%"
              placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item prop="secPassword">
            <el-input v-model="SecPassword" show-password prefix-icon="el-icon-lock" style="width: 86%"
              placeholder="请再次输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 86%; margin-top: 10px" type="primary" @click="register()">注册</el-button>
          </el-form-item>
          <div style="text-align: center">
            已有账号？<a href="javascript:void(0)" style="text-decoration: none" @click="navLogin">点击登录</a>
          </div>
        </el-form>

      </div>
    </div>
  </div>
</template>

<script>

import request from "@/utils/request";

export default {
  name: "Register",
  data() {
    return {
      form: { role: 'USER' },
      SecPassword: '',
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        secPassword: [
        { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  // 页面加载的时候，做一些事情，在created里面
  created() {
  },
  // 定义一些页面上控件出发的事件调用的方法
  methods: {
    register() {
      if (this.form.password === this.SecPassword) {
        request.post("/register", this.form).then(res => {
          if (res.code === 0) {
            this.$message.success('注册成功,请登录');
            this.$router.push("/login");
          } else {
            this.$message.error(res.msg);
          }
        }).catch(err => {
          console.log(err);
        });
      } else {
        this.$message.error('两次输入的密码不一致');
      }
    },
    navLogin() {
      this.$router.push("/login")
    }
  }
}
</script>

<style scoped>
.register-container {
  height: 100vh;
  overflow: hidden;
  background-image: url("@/assets/register.jpg");
  background-size: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
