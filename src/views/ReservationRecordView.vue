<template>
  <div>
    <div style="margin-bottom: 15px">
      <el-input v-model="params.name" style="width: 200px" placeholder="请输入养发馆编号"></el-input>
      <el-button type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>
      <el-button type="warning" style="margin-left: 10px" @click="reset()">清空</el-button>
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="养发馆" align="center"></el-table-column>
        <el-table-column prop="teacherName" label="养发馆管理员" align="center"></el-table-column>
        <el-table-column prop="studentName" label="预约人" align="center"></el-table-column>
        <el-table-column prop="time" label="操作时间" align="center"></el-table-column>
        <el-table-column prop="useTime" label="使用时间段" align="center"></el-table-column>
        <!-- <el-table-column prop="avatar" label="图片" align="center">
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
</el-table-column> -->
        <el-table-column prop="reserveStatus" label="预约状态" align="center">
          <template slot-scope="{ row }">
            {{ row.reserveStatus === 0 ? '待审核' : row.reserveStatus === 1 ? '审核通过' : '审核不通过' }}
          </template>
        </el-table-column>
        <el-table-column prop="useStatus" label="使用状态" align="center">
          <template slot-scope="{ row }">
            {{ row.useStatus === 0 ? '待审核' : row.useStatus === 1 ? '使用中' : row.useStatus === 2 ? '审核不通过' : '已结束' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="warning" plain
              v-if="user.role !== 'STUDENT' && scope.row.reserveStatus === 0 && scope.row.useStatus === 0"
              @click="edit1(scope.row)">通过</el-button>
            <el-button type="warning" plain
              v-if="user.role !== 'STUDENT' && scope.row.reserveStatus === 0 && scope.row.useStatus === 0"
              @click="edit2(scope.row)">不通过</el-button>

            <el-popconfirm title="确定取消预约吗？" @confirm="reservation1(scope.row)">
              <el-button slot="reference" v-if="user.role === 'STUDENT' && scope.row.reserveStatus === 0"
                type="danger">取消预约</el-button>
            </el-popconfirm>
            <el-popconfirm title="确定结束使用吗？" @confirm="reservation2(scope.row)">
              <el-button slot="reference" v-if="scope.row.reserveStatus === 1 && scope.row.useStatus === 1"
                type="danger" plain>结束使用</el-button>
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
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: 'ReserveRecord',
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      params: {
        name: '',
        studentName: '',
        teacherName: '',
        pageNum: 1,
        pageSize: 20
      },
      tableData: [],
      total: 0,
      form: {},
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
  },
  // 定义一些页面上控件出发的事件调用的方法
  methods: {
    findBySearch() {
      if (this.user.role === 'STUDENT') {
        this.params.studentName = this.user.name;
      }
      if (this.user.role === 'TEACHER') {
        this.params.teacherName = this.user.name;
      }
      request.get("/reserve/search", {
        params: this.params
      }).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.list;
          this.total = res.data.total;
        } else {
          this.$message.error(res.msg);
          // this.$router.push("/login");
        }
      })
    },
    reservation1(obj) {
      //顾客取消预约按钮
      this.form = obj;
      request.post("/reserve/update4", this.form).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功');
          this.findBySearch();
        } else {
          this.$message.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    reservation2(obj) {
      //结束使用按钮
      this.form = obj;
      request.post("/reserve/update3", this.form).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功');
          this.findBySearch();
        } else {
          this.$message.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    edit1(obj) {
      //审核通过按钮
      this.form = obj;
      request.post("/reserve/update1", this.form).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功');
          this.findBySearch();
        } else {
          this.$message.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    edit2(obj) {
      //审核不通过按钮
      this.form = obj;
      request.post("/reserve/update2", this.form).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功');
          this.findBySearch();
        } else {
          this.$message.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
      });
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
    successUpload(res) {
      this.form.avatar = res.data;
    },
    del(id) {
      // request.delete("/reserve/" + id).then(res => {
      //   if (res.code === 0) {
      //     this.$message({
      //       message: '删除成功',
      //       type: 'success'
      //     });
      //     this.findBySearch();
      //   } else {
      //     this.$message({
      //       message: res.msg,
      //       type: 'error'
      //     });
      //   }
      // })
    }
  }
}
</script>
