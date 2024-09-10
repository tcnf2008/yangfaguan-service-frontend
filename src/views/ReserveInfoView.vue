<template>
  <div>
    <div style="margin-bottom: 15px">
      <el-input v-model="params.name" style="width: 200px" placeholder="请输入养发馆编号"></el-input>
      <el-button type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>
      <el-button type="warning" style="margin-left: 10px" @click="reset()">清空</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="add()">新增</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="养发馆编号" align="center"></el-table-column>
        <el-table-column prop="description" label="介绍" align="center"></el-table-column>
        <el-table-column prop="start" label="开始时间" align="center"></el-table-column>
        <el-table-column prop="end" label="闭门时间" align="center"></el-table-column>
        <el-table-column prop="avatar" label="图片" align="center">
          <template v-slot="scope">
            <div class="block" style="margin-top: 10px;" v-if="scope.row.avatar === null">
              <el-avatar shape="circle" :size="large" :src="circleUrl"></el-avatar>
            </div>
            <div v-else>
              <el-image style="width: 70px; height: 70px;" :src="'http://localhost:8085/api/files/' + scope.row.avatar"
                :preview-src-list="['http://localhost:8085/api/files/' + scope.row.avatar]">
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="{ row }">
            {{ row.status === 0 ? '空闲中' : row.status === 1 ? '使用中' : '未知状态' }}
          </template>
        </el-table-column>
        <el-table-column prop="typeName" label="所属分类" align="center"></el-table-column>
        <el-table-column prop="teacherName" label="养发馆管理员" align="center"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="primary" v-if="user.role !== 'STUDENT'" @click="edit(scope.row)">编辑</el-button>
            <el-button type="primary" v-if="user.role === 'STUDENT'" @click="reservation(scope.row)">预约</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="del(scope.row.id)">
              <el-button slot="reference" v-if="user.role !== 'STUDENT'" type="danger"
                style="margin-left: 5px">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 10px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="params.pageNum" :page-sizes="[20,50,100]" :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next" :total="total">
      </el-pagination>
    </div>
    <div>
      <el-dialog title="请填写信息" :visible.sync="dialogFormVisible" width="35%">
        <el-form :model="form">
          <el-form-item label="养发馆编号" label-width="20%">
            <el-input v-model="form.name" autocomplete="off" style="width: 80%"></el-input>
          </el-form-item>
          <el-form-item label="养发馆介绍" label-width="20%">
            <el-input type="textarea" :rows="3" v-model="form.description" autocomplete="off"
              style="width: 80%"></el-input>
          </el-form-item>
          <el-form-item label="开始时间" label-width="20%">
            <template>
              <el-time-picker v-model="form.start" :picker-options="{
                selectableRange: '00:00:00 - 22:30:00'
              }" format="HH:mm:ss" value-format="HH:mm:ss" placeholder="任意时间点">
              </el-time-picker>
            </template>
          </el-form-item>
          <el-form-item label="闭门时间" label-width="20%">
            <template>
              <el-time-picker v-model="form.end" :picker-options="{
                selectableRange: '00:00:00 - 22:30:00'
              }" format="HH:mm:ss" value-format="HH:mm:ss" placeholder="任意时间点">
              </el-time-picker>
            </template>
          </el-form-item>
          <el-form-item label="养发馆图片" label-width="20%">
            <el-upload action="http://localhost:8085/api/files/upload" :on-success="successUpload">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="养发馆分类" label-width="20%">
            <el-select v-model="form.typeId" placeholder="请选择养发馆分类" style="width: 53%">
              <el-option v-for="item in typeData" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="teacherId" label="养发馆管理员" label-width="20%">
            <el-select v-model="form.teacherId" placeholder="请选择养发馆管理员" style="width: 53%">
              <el-option v-for="item in teacherData" :label="item.name" :value="item.id"></el-option>
            </el-select>
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
  name: "ReserveInfo",
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      params: {
        name: '',
        userId: '',
        pageNum: 1,
        pageSize: 20
      },
      tableData: [],
      total: 0,
      dialogFormVisible: false,
      form: {},
      typeData: [],
      teacherData: [],
      reserve: {
        id: '',
        name: '',
        studentName: '',
        teacherName: '',
        time: '',
        useTime: '',
        reserveStatus: '',
        useStatus: ''
      },
      circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    }
  },
  // 页面加载的时候，做一些事情，在created里面
  created() {
    this.findBySearch();
    this.loadType();
    this.loadTeacher();
  },
  // 定义一些页面上控件出发的事件调用的方法
  methods: {
    findBySearch() {
      if(this.user.role === 'TEACHER'){
        this.params.userId = this.user.id;
      }
      request.get("/room/search", {
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
    loadType() {
      request.get("/type/findAll").then(res => {
        if (res.code === 0) {
          this.typeData = res.data;
        } else {
          this.$message.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    loadTeacher() {
      request.get("/teacher/findAll").then(res => {
        if (res.code === 0) {
          this.teacherData = res.data;
        } else {
          this.$message.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    reload() {
      this.dialogFormVisible = false
      this.findBySearch();
    },
    add() {
      this.form = {};
      this.dialogFormVisible = true;
    },
    reservation(obj) {
      this.form = obj;
      this.form.studentName = this.user.name;
      console.log(this.form);

      request.post("/reserve", this.form).then(res => {
        if (res.code === 0) {
          this.$message.success('已预约，请留意审核通知');
          this.findBySearch();
        } else {
          this.$message.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    edit(obj) {
      this.form = obj;
      this.dialogFormVisible = true;
    },

    reset() {
      this.params = {
        pageNum: 1,
        pageSize: 20,
        name: ''
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
      request.post("/room", this.form).then(res => {
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
      request.delete("/room/" + id).then(res => {
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
