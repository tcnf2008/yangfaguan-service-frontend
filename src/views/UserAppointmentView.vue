<template>
  <div>
    <div style="margin-bottom: 15px">
      <el-select v-model="params.salonId" placeholder="请选择" @change="findBySearch">
        <el-option
            v-for="item in salonList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
      <!--      <el-input v-model="params.name" style="width: 200px" placeholder="请输入姓名"></el-input>-->
      <!--      <el-input v-model="params.phone" style="width: 200px; margin-left: 5px" placeholder="请输入电话"></el-input>-->
      <!--      <el-button type="warning" style="margin-left: 10px" @click="findBySearch()">查询</el-button>-->
      <!--      <el-button type="warning" style="margin-left: 10px" @click="reset()">清空</el-button>-->
      <!--      <el-button type="primary" style="margin-left: 10px" @click="add()">新增技师</el-button>-->
    </div>
    <div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="预约编号" width="80" align="center"></el-table-column>
        <el-table-column prop="salonName" label="店铺名称" align="center"></el-table-column>
        <el-table-column prop="serviceName" label="服务名称" align="center"></el-table-column>
        <el-table-column prop="time" label="服务时长（分钟）" align="center"></el-table-column>
        <el-table-column prop="appointmentTime" label="预约时间" align="center"></el-table-column>
        <el-table-column prop="statusName" label="预约状态" align="center"></el-table-column>
        <el-table-column prop="createdAt" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" align="left" style="width:200px">
          <template slot-scope="scope">
            <!--            <el-button type="primary" @click="edit(scope.row)">编辑</el-button>-->
            <el-popconfirm title="确定要通过申请吗？" v-if="scope.row.status === 'PENDING'"
                           @confirm="passAppointment(scope.row)">
              <el-button slot="reference" type="primary" style="margin-left: 5px">通过预约申请</el-button>
            </el-popconfirm>
            <el-popconfirm title="确定取消吗？" v-if="scope.row.status === 'PENDING'"
                           @confirm="cancelAppointment(scope.row)">
              <el-button slot="reference" type="warning" style="margin-left: 5px">拒绝预约</el-button>
            </el-popconfirm>
            <el-popconfirm title="确定完成服务吗？" v-if="scope.row.status === 'APPROVED'"
                           @confirm="finishAppointment(scope.row)">
              <el-button slot="reference" type="success" style="margin-left: 5px">完成服务</el-button>
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
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "UserAppointment",
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
      params: {
        salonId: 1,
        name: '',
        phone: '',
        pageNum: 1,
        pageSize: 20
      },
      roles: [{role: "TECHNICIAN", roleName: "技师"}, {role: "MANAGER", roleName: "店长"}],
      tableData: [],
      salonList: [],
      total: 0,
      dialogFormVisible: false,
      form: {},
      flag: false
    }
  },
  // 页面加载的时候，做一些事情，在created里面
  created() {
    this.loadSalonList();
    this.findBySearch();
  },
  // 定义一些页面上控件出发的事件调用的方法
  methods: {
    loadSalonList() {
      request.get("/salon/findAll", {
        params: null
      }).then(res => {
        console.log(res);
        if (res.code === 0) {
          console.log("拉取数据成功");
          let salonList = res.data;
          this.salonList = salonList;
          this.params.salonId = salonList[0].id;
        } else {
          // this.$message.error(res.msg);
          this.$notify({
            title: '警告',
            message: '接口(/salon/findAll)异常：（' + res.msg + '）',
            type: 'warning'
          });
          // this.$router.push("/login");
        }
      }).catch(err => {
        console.log(err);
      });
    },
    findBySearch() {
      request.get("/salon/findBySalonId?salonId=" + this.params.salonId
          + "&pageSize=" + this.params.pageSize + "&pageNum=" + this.params.pageNum, {
        params: null
      }).then(res => {
        if (res.code === 0) {
          this.tableData = res.data;
          this.total = res.data.length;
        } else {
          this.$message.error(res.msg);
          // this.$router.push("/login");
        }
      }).catch(err => {
        console.log(err);
      });
    },
    reload() {
      this.flag = false;
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
    passAppointment(appointment) {
      let data = {
        id: appointment.id,
        status: 'APPROVED'
      };

      request.post("/salon/setAppointmentStatus", JSON.stringify(data))
          .then(res => {
            if (res.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success'
              });
              this.findBySearch();
            } else {
              this.$message({
                message: '操作失败：' + res.msg,
                type: 'warning'
              });
              this.findBySearch();
            }
          }).catch(err => {
        console.log(err);
      });
    },
    cancelAppointment(appointment) {
      let data = {
        id: appointment.id,
        status: 'CANCELED'
      };

      request.post("/salon/setAppointmentStatus", JSON.stringify(data)).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.findBySearch();
        } else {
          this.$message({
            message: '操作失败：' + res.msg,
            type: 'warning'
          });
          this.findBySearch();
        }
      }).catch(err => {
        console.log(err);
      });
    },
    finishAppointment(appointment) {
      let data = {
        id: appointment.id,
        status: 'COMPLETED'
      };

      request.post("/salon/setAppointmentStatus", JSON.stringify(data)).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.findBySearch();
        } else {
          this.$message({
            message: '操作失败：' + res.msg,
            type: 'warning'
          });
          this.findBySearch();
        }
      }).catch(err => {
        console.log(err);
      });
    }
  }
}
</script>
