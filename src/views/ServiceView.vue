<template>
  <div>
    <div style="margin-bottom: 15px">
<!--      <el-input v-model="params.name" style="width: 200px" placeholder="请输入分类名称"></el-input>-->
<!--      <el-button type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>-->
<!--      <el-button type="warning" style="margin-left: 10px" @click="reset()">清空</el-button>-->
      <el-button type="primary" style="margin-left: 10px" @click="add()" v-if="user.role === 'ADMIN'">新增</el-button>
    </div>
    <div>
      <!--      {-->
      <!--      "id": 1,-->
      <!--      "name": "珍珠养发",-->
      <!--      "category": "养发SPA",-->
      <!--      "remark": "发丝润亮泽",-->
      <!--      "time": 30,-->
      <!--      "description": "",-->
      <!--      "pic": "url",-->
      <!--      "picIntroduce": "url_detail",-->
      <!--      "createdAt": "2024-09-06 15:45:05",-->
      <!--      "updatedAt": "2024-09-06 15:45:05"-->
      <!--      }-->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="id" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="服务名称" align="center"></el-table-column>
        <el-table-column prop="time" label="服务时长" align="center"></el-table-column>
        <el-table-column prop="category" label="分类" align="center"></el-table-column>
        <el-table-column prop="remark" label="亮点词" align="center"></el-table-column>
        <el-table-column prop="description" label="描述" align="center"></el-table-column>
        <el-table-column prop="pic" label="产品小图" align="center">
          <template v-slot="scope">
            <el-image
                style="width: 70px; height: 70px; border-radius: 50%"
                :src="'http://localhost:8085/api/files/' + scope.row.pic"
                :preview-src-list="['http://localhost:8085/api/files/' + scope.row.pic]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="picIntroduce" label="产品卖点图片" align="center">
          <template v-slot="scope">
            <el-image
                style="width: 70px; height: 70px; border-radius: 50%"
                :src="'http://localhost:8085/api/files/' + scope.row.picIntroduce"
                :preview-src-list="['http://localhost:8085/api/files/' + scope.row.picIntroduce]">
            </el-image>
          </template>
        </el-table-column>

        <el-table-column v-if="user.role === 'ADMIN'" label="操作" align="center">
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
      <!--      {-->
      <!--      "id": 1,-->
      <!--      "name": "珍珠养发",-->
      <!--      "category": "养发SPA",-->
      <!--      "remark": "发丝润亮泽",-->
      <!--      "time": 30,-->
      <!--      "description": "",-->
      <!--      "pic": "url",-->
      <!--      "picIntroduce": "url_detail",-->
      <!--      "createdAt": "2024-09-06 15:45:05",-->
      <!--      "updatedAt": "2024-09-06 15:45:05"-->
      <!--      }-->
      <el-dialog title="请填写信息" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="form" :rules="rules">
          <el-form-item prop="name" label="服务名称" label-width="25%">
            <el-input v-model="form.name" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item prop="category" label="分类名称" label-width="25%">
            <el-input v-model="form.category" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item prop="remark" label="亮点" label-width="25%">
            <el-input v-model="form.remark" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item prop="time" label="服务时长" label-width="25%">
            <el-input v-model="form.time" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
<!--          <el-form-item prop="description" label="分类名称" label-width="25%">-->
<!--            <el-input v-model="form.description" autocomplete="off" style="width: 90%"></el-input>-->
<!--          </el-form-item>-->
          <el-form-item prop="description" label="描述" label-width="25%">
            <el-input v-model="form.description" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>

          <el-form-item prop="pic" label="产品小图" label-width="25%">
            <el-upload action="http://localhost:8085/api/files/upload" :on-success="successUploadPic">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item prop="picIntroduce" label="产品卖点图片" label-width="25%">
            <el-upload action="http://localhost:8085/api/files/upload" :on-success="successUploadPicIntro">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="reload()">取 消</el-button>
          <el-button type="primary" @click="submit()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Service",
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      params: {
        name: '',
        pageNum: 1,
        pageSize: 20
      },
      tableData: [],
      total: 0,
      dialogFormVisible: false,
      form: {},
      teacherData: [],
      rules: {
        name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
        ],
        teacherId: [
          {required: true, message: '请选择养发馆管理员', trigger: 'blur'},
        ]
      }
    }
  },
  // 页面加载的时候，做一些事情，在created里面
  created() {
    this.findBySearch();
    // this.loadTeacher();
  },
  // 定义一些页面上控件出发的事件调用的方法
  methods: {
    findBySearch() {
      request.get("/service/findAll", {
        params: null
      }).then(res => {
        if (res.code === 0) {
          this.tableData = res.data;
          this.total = res.data.length;
        } else {
          console.log(res);
          // this.$message.error(res.msg);
          // this.$router.push("/login");
        }
      }).catch(err => {
        console.log(err);
      });
    },
    // loadTeacher() {
      // request.get("/user/findAll").then(res => {
      //   if (res.code === 0) {
      //     this.teacherData = res.data;
      //   } else {
      //     console.log(res);
      //     // this.$message.error(res.msg);
      //   }
      // }).catch(err => {
      //   console.log(err);
      // })
    // },
    reload() {
      this.dialogFormVisible = false
      this.findBySearch();
    },
    add() {
      this.form = {};
      this.dialogFormVisible = true;
    },
    edit(obj) {
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
      request.post("/service/saveOrUpdate", this.form).then(res => {
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
    successUploadPic(res) {
      this.form.pic = res.data;
    },
    successUploadPicIntro(res) {
      this.form.picIntroduce = res.data;
    },
    del(id) {
      request.delete("/type/" + id).then(res => {
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
