<template>
  <div style="margin-bottom: 15px">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户个人信息</span>
      </div>
      <div style="display: flex; flex-direction: column; ">
        <el-form :model="form">
          <el-form-item label-width="40%">
            <div class="block" style="margin-top: 10px;" v-if="form.avatar === null">
              <el-avatar shape="circle" :size="medium" :src="circleUrl"
                style="width: 90px; height: 90px; border-radius: 50%; margin-right: 5px;"></el-avatar>
            </div>
            <div class="block" style="margin-top: 10px;" v-else>
              <el-image style="width: 90px; height: 90px; border-radius: 50%; margin-right: 5px;"
                :src="imageUrl"></el-image>
            </div>
          </el-form-item>
          <el-form-item label-width="40%">
            <el-upload action="http://localhost:8085/api/files/upload" :on-success="successUpload"
              :show-file-list="showFileList">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="账号" label-width="20%">
            <el-input v-model="form.username" autocomplete="off" style="width: 90%" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="角色" label-width="20%">
            <el-input v-model="form.roleName" autocomplete="off" style="width: 90%" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="姓名" label-width="20%">
            <el-input v-model="form.name" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="电话" label-width="20%">
            <el-input v-model="form.phone" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" label-width="20%">
            <el-input v-model="form.email" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
        </el-form>
        <div style="margin-top: 10px; display: flex; justify-content: center;">
          <el-button type="primary" @click="edit()">保存</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: 'Personal',
  data() {
    return {
      form: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      SecPassword: '',
      imageUrl: '',
      // circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      // circleUrl:'http://localhost:8085/api/files/' + (localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}).avatar
      showFileList: true // 控制上传文件列表显示或隐藏的变量
    }
  },
  // 页面加载的时候，做一些事情，在created里面
  created() {
    this.initUser();
    // this.findUser();
  },
  methods: {
    initUser() {
      this.imageUrl = 'http://localhost:8085/api/files/' + this.form.avatar;
    },
    // findUser() {
    //   request.get("/getUser").then(res => {
    //     if (res.code === 0) {
    //       this.form = res.data;
    //       console.log(res.data)
    //       this.imageUrl = 'http://localhost:8085/api/files/' + this.form.avatar;
    //       // localStorage.removeItem("user");
    //       // localStorage.setItem("user", JSON.stringify(res.data));
    //     } else {
    //       this.$message.error(res.msg);
    //     }
    //   })
    // },
    edit() {
      request.post("/updatePersonal", this.form).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功');
          setTimeout(function () {
            window.location.reload();
          }, 2000);
          this.findUser();
          this.showFileList = false;
        } else {
          this.$message.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    successUpload(res) {
      this.form.avatar = res.data;
    },

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
  width: 580px;
  height: 550px;
}
</style>