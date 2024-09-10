<template>
  <div>
    <div style="margin-bottom: 15px">
      <el-input v-model="params.name" style="width: 200px" placeholder="请输入姓名"></el-input>
      <el-input v-model="params.phone" style="width: 200px; margin-left: 5px" placeholder="请输入电话"></el-input>
      <el-button type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>
      <el-button type="warning" style="margin-left: 10px" @click="reset()">清空</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="add()">新增</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="username" label="账号" align="center"></el-table-column>
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="phone" label="电话" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column prop="avatar" label="头像" align="center">
          <template v-slot="scope">
            <div class="block" style="margin-top: 10px;" v-if="scope.row.avatar === null">
              <el-avatar shape="circle" :size="large" :src="circleUrl"></el-avatar>
            </div>
            <div v-else>
            <el-image
                style="width: 70px; height: 70px; border-radius: 50%"
                :src="'http://localhost:8085/api/files/' + scope.row.avatar"
                :preview-src-list="['http://localhost:8085/api/files/' + scope.row.avatar]">
            </el-image>
          </div>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="del(scope.row.id)">
              <el-button slot="reference" type="danger" style="margin-left: 5px">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 10px">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.pageNum"
          :page-sizes="[20,50,100]"
          :page-size="params.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total">
      </el-pagination>
    </div>
    <div>
      <el-dialog title="请填写信息" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="form">
          <el-form-item label="账号" label-width="15%">
            <el-input v-model="form.username" autocomplete="off" style="width: 90%" :disabled="flag"></el-input>
          </el-form-item>
          <el-form-item label="姓名" label-width="15%">
            <el-input v-model="form.name" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="电话" label-width="15%">
            <el-input v-model="form.phone" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" label-width="15%">
            <el-input v-model="form.email" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="头像" label-width="15%">
            <el-upload action="http://localhost:8085/api/files/upload" :on-success="successUpload">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click=" reload()">取 消</el-button>
          <el-button type="primary" @click="submit()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Student",
  data() {
    return {
      params: {
        name: '',
        phone: '',
        pageNum: 1,
        pageSize: 20
      },
      tableData: [],
      total: 0,
      dialogFormVisible: false,
      form: {},
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      flag: false
    }
  },
  // 页面加载的时候，做一些事情，在created里面
  created() {
    this.findBySearch();
  },
  // 定义一些页面上控件出发的事件调用的方法
  methods: {
    findBySearch() {
      request.get("/student/search", {
        params: this.params
      }).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
          // this.$router.push("/login");
        }
      }).catch(err => {
        console.log(err);
      });
    },
    reload(){
      this.flag = false;
      this.dialogFormVisible = false
      this.findBySearch();
    },
    add() {
      this.form = {};
      this.dialogFormVisible = true;
    },
    edit(obj) {
      this.flag = true;
      this.form = obj;
      this.dialogFormVisible = true;
    },
    reset() {
      this.params = {
        pageNum: 1,
        pageSize: 20,
        name: '',
        phone: ''
      }
      this.findBySearch();
    },
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize;
      this.findBySearch();
    },
    handleCurrentChange(pageNum) {
      this.params.pageNum = pageNum;
      this.findBySearch();
    },
    submit() {
      request.post("/student", this.form).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功');
          this.dialogFormVisible = false;
          this.findBySearch();
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
    del(id) {
      request.delete("/student/" + id).then(res => {
        if (res.code === 0) {
          this.$message.success('删除成功');
          this.findBySearch();
        } else {
          this.$message.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    }
  }
}
</script>
