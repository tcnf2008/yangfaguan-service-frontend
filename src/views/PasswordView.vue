<template>
  <div style="margin-bottom: 15px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户修改密码</span>
      </div>
      <div style="display: flex; flex-direction: column;">
        <el-form :model="form" style="margin-top: 30px;">
          <el-form-item label="账号" label-width="20%">
            <el-input v-model="form.username" autocomplete="off" style="width: 90%" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="原密码" label-width="20%">
            <el-input v-model="form.password" show-password autocomplete="off" style="width: 90%"
              placeholder="请输入原密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" label-width="20%">
            <el-input v-model="form.newPassword" show-password autocomplete="off" style="width: 90%"
              placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" label-width="20%">
            <el-input v-model="SecPassword" show-password autocomplete="off" style="width: 90%"
              placeholder="请确认新密码"></el-input>
          </el-form-item>
        </el-form>
        <div style="margin-top: 10px; display: flex; justify-content: center;">
          <el-button type="primary" @click="edit()">修改</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: 'Password',
  data() {
    return {
      form: {},
      SecPassword: ''
    }
  },
  // 页面加载的时候，做一些事情，在created里面
  created() {
    // this.findUser();
    this.initUser();
  },
  methods: {
    initUser() {
      this.form = JSON.parse(localStorage.getItem("user"));
      console.log(this.form);
      this.form.password = '';
    },
    // findUser() {
    //   request.get("/getUser").then(res => {
    //     if (res.code === 0) {
    //       this.form = res.data;
    //       this.form.password = '';
    //     } else {
    //       this.$message.error(res.msg);
    //     }
    //   })
    // },
    edit() {
      if (this.form.newPassword === this.SecPassword) {
        request.post("/updatePassword", this.form).then(res => {
        if (res.code === 0) {
          this.$message.success('修改成功');
          localStorage.removeItem("user");
          this.$router.push("/login");
        } else {
          this.$message.error(res.msg);
        }
      })
      }else{
        this.$message.error('两次输入新的密码不一致');
      }
    }
  }
}
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 480px;
  height: 200px;
}
</style>