<template>
  <div>
    <div style="margin-bottom: 15px">
      <el-button type="primary" style="margin-left: 10px" @click="goToAppointment()">去预约</el-button>
    </div>
    <div>
      <!--      {-->
      <!--      "id": 5,-->
      <!--      "userId": 1,-->
      <!--      "userName": "超级管理员2",-->
      <!--      "technicianId": 16,-->
      <!--      "technicianName": "技师-小草2",-->
      <!--      "serviceId": 1,-->
      <!--      "serviceName": "姜养SPA",-->
      <!--      "salonId": 1,-->
      <!--      "salonName": null,-->
      <!--      "appointmentTime": "2024-09-10 19:30:00",-->
      <!--      "time": 30,-->
      <!--      "finishTime": "2024-09-10 20:00:00",-->
      <!--      "status": "PENDING",-->
      <!--      "createdAt": "2024-09-10 15:11:32",-->
      <!--      "updatedAt": "2024-09-10 15:11:32"-->
      <!--      }-->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="预约编号" width="80" align="center"></el-table-column>
        <el-table-column prop="salonName" label="店铺名称" align="center"></el-table-column>
        <el-table-column prop="serviceName" label="服务名称" align="center"></el-table-column>
        <el-table-column prop="time" label="服务时长（分钟）" align="center"></el-table-column>
        <el-table-column prop="appointmentTime" label="预约时间" align="center"></el-table-column>
        <el-table-column prop="statusName" label="预约状态" align="center"></el-table-column>
        <el-table-column prop="createdAt" label="创建时间" align="center"></el-table-column>
        <el-table-column v-if="user.role === 'ADMIN'" label="操作" align="center">
          <template slot-scope="scope">
            <!--            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>-->
            <el-popconfirm title="确定取消吗？" @confirm="cancelAppointment(scope.row)">
              <el-button slot="reference" type="danger" style="margin-left: 5px">取消预约</el-button>
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
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "MyAppointment",
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
      request.get("/salon/findByUserId?userId=" + this.user.id + "&pageSize=" + this.params.pageSize + "&pageNum=" + this.params.pageNum, {
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
    reload() {
      this.dialogFormVisible = false
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

    cancelAppointment(appointment) {
      let data = {
        id: appointment.id,
        status: 'CANCELED'
      };

      request.post("/salon/setAppointmentStatus", JSON.stringify(data)).then(res => {
        if (res.code === 0) {
          this.$notify({
            title: '预约已取消',
            message: '您的预约已经取消',
            type: 'success'
          });
          this.findBySearch();
        } else {
          this.$notify.error({
            title: '操作失败',
            message: '操作失败：' + res.msg,
          });
        }
      }).catch(err => {
        console.log(err);
      });
    },
    goToAppointment() {
      this.$router.push("/appointment");
    }
  }
}
</script>
