<template>
  <div>
    <div style="margin-bottom: 15px">
      <el-input v-model="params.name" style="width: 200px" placeholder="要查询的店铺名称"></el-input>
      <!--      <el-input v-model="params.phone" style="width: 200px; margin-left: 5px" placeholder="请输入电话"></el-input>-->
      <el-button type="warning" style="margin-left: 10px" @click="loadSalon()">查询</el-button>
      <!--      <el-button type="warning" style="margin-left: 10px" @click="reset()">清空</el-button>-->
      <el-button type="primary" style="margin-left: 10px" @click="add()">新增</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="编号" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="address" label="店铺地址" align="center"></el-table-column>
        <el-table-column prop="phone" label="电话" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？同时会删除该门店下相关的用户信息" @confirm="del(scope.row.id)">
              <el-button slot="reference" type="danger" style="margin-left: 5px">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
<!--    <div style="margin-top: 10px">-->
<!--      <el-pagination-->
<!--          @size-change="handleSizeChange"-->
<!--          @current-change="handleCurrentChange"-->
<!--          :current-page="params.pageNum"-->
<!--          :page-sizes="[20,50,100]"-->
<!--          :page-size="params.pageSize"-->
<!--          layout="total, sizes, prev, pager, next"-->
<!--          :total="total">-->
<!--      </el-pagination>-->
<!--    </div>-->
    <div>
      <el-dialog title="请填写信息" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="form">
          <el-form-item label="店铺名称" label-width="20%">
            <el-input v-model="form.name" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="地址" label-width="20%">
            <el-input v-model="form.address" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="电话" label-width="20%">
            <el-input v-model="form.phone" autocomplete="off" style="width: 90%"></el-input>
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
  name: "Salon",
  data() {
    return {
      params: {
        name: '',
        pageNum: 1,
        pageSize: 20
      },
      tableData: [],
      total: 0,
      dialogFormVisible: false,
      form: {},
      flag: false
    }
  },
  // 页面加载的时候，做一些事情，在created里面
  created() {
    this.loadSalon();
  },
  // 定义一些页面上控件出发的事件调用的方法
  methods: {
    loadSalon() {
      request.get("/salon/findAll"
          //?pageSize=" + this.params.pageSize + "&pageNum=" + this.params.pageNum
          , {
        params: null
      }).then(res => {
        console.log(res);
        if (res.code === 0) {
          console.log("拉取数据成功");
          let salonList = res.data;
          if (this.params.name) {
            salonList = salonList.filter(item => item.name.includes(this.params.name));
          }
          this.tableData = salonList;
          this.total = salonList.length;
        } else {
          // this.$message.error(res.msg);
          this.$notify({
            title: '警告',
            message: '接口异常：（' + res.msg + '）',
            type: 'warning'
          });
          // this.$router.push("/login");
        }
      }).catch(err => {
        console.log(err);
      });
    },
    reload() {
      this.flag = false;
      this.dialogFormVisible = false
      this.loadSalon();
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
      this.loadSalon();
    },
    handleSizeChange(pageSize) {
      this.params.pageSize = pageSize;
      this.loadSalon();
    },
    handleCurrentChange(pageNum) {
      this.params.pageNum = pageNum;
      this.loadSalon();
    },
    submit() {
      request.post("/salon/saveOrUpdateSalon", this.form).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功');
          this.dialogFormVisible = false;
          this.loadSalon();
        } else {
          this.$message.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    del(id) {
      request.delete("/salon/" + id).then(res => {
        if (res.code === 0) {
          this.$message.success('删除成功');
          this.loadSalon();
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
