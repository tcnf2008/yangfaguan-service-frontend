<template>
  <div>
    <!--     卡片展示-可预约服务信息服务信息-->
    <el-row>
      <el-col :span="6" v-for="(o, index) in tableData" :key="o">
        <el-card :body-style="{ padding: '10px' }">
          <!--          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">-->
          <!--          <template v-slot="scope">-->
          <el-image class="image"
                    :src="'http://localhost:8085/api/files/' + o.picIntroduce"
                    :preview-src-list="['http://localhost:8085/api/files/' + o.picIntroduce]">
          </el-image>
          <div style="padding: 5px; margin: 5px;">
            <div class="bottom clearfix">
              <!--              <time class="time">{{ currentDate }}</time>-->
              <el-button type="text" class=" button " style="margin-right: 30px;" @click="openAppointment(o)">立即预约
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

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

      <el-dialog title="欢迎预约" :visible.sync="dialogFormVisible" width="30%">
        门店：
        <el-select v-model="salonSelectedId" placeholder="请选择" @change="loadTimeSpanList">
          <el-option
              v-for="item in salonList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
        <p/>
        <!--  timeSpanList 数据格式： [{"timeOfDay":"08:00","valid":true,"validTechnicians":[{"id":4,"username":"tech1","password":"123456","name":"技师-小草","avatar":"1715663517309","role":"TECHNICIAN","phone":"13236954655","email":"admin2@nau.com","salonId":1,"token":null,"verCode":null,"newPassword":null,"roleName":null},{"id":5,"username":"tech2","password":"123456","name":"技师-艾青","avatar":"1725876090899","role":"TECHNICIAN","phone":"13236954656","email":"admin2@nau.com","salonId":1,"token":null,"verCode":null,"newPassword":null,"roleName":null},{"id":6,"username":"tech3","password":"123456","name":"技师-文青","avatar":"1715663517329","role":"TECHNICIAN","phone":"13236954657","email":"admin2@nau.com","salonId":1,"token":null,"verCode":null,"newPassword":null,"roleName":null},{"id":16,"username":"3","password":"123456","name":"技师-小草2","avatar":"1725876029664","role":"TECHNICIAN","phone":"33","email":"222","salonId":1,"token":null,"verCode":null,"newPassword":null,"roleName":null}]}]-->
        日期：
        <el-select v-model="daySelectedFullDate" placeholder="请选择" @change="loadTimeSpanList">
          <el-option
              v-for="item in dayList"
              :key="item.fullDate"
              :label="item.dayNick"
              :value="item.fullDate">
          </el-option>
        </el-select>

        <div style="margin-top: 10px;">
          <!-- 平铺展示时间段 -->
          <el-button
              v-for="(item, index) in timeSpanList"
              :key="index"
              :type="selectedTime === item.timeOfDay ? 'primary' : 'default'"
              :disabled="!(item.valid)"
              @click="selectTime(item)" style="width:65px;text-align: center;margin: 3px 6px;">
            {{ item.timeOfDay }}
          </el-button>
        </div>
        <div style="margin-top: 10px;">
          <!-- 平铺展示技师 -->
          <el-button
              v-for="(item, index) in technicianList"
              :key="index"
              :type="selectedTechnicianId === item.id ? 'primary' : 'default'"
              @click="selectTechnician(item)" style="width:80px;text-align: center;margin: 3px 6px;"
          >
            {{ item.name }}
          </el-button>
        </div>
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
  name: "Appointment",
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
      service: {},
      salonList: [], /* 加载的门店列表 */
      salonSelectedId: 0,
      dayList: [], /* 可预约日期，展示近8天，日期和星期 */
      daySelectedFullDate: {}, /* 选中的日期 */
      timeSpanList: [], /* 可预约时间段 */
      selectedTime: null, // 用于记录当前选中的时间
      selectedTimeSpan: null,
      technicianList: [],  /* 可用技师 */
      selectedTechnician: null, // 用于记录当前选中的技师
      selectedTechnicianId: null, // 用于记录当前选中的技师
    }
  },
  // 页面加载的时候，做一些事情，在created里面
  created() {
    this.findBySearch();
    this.generateDays();
    this.loadSalonList();
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
    loadSalonList() {
      request.get("/salon/findAll", {
        params: null
      }).then(res => {
        if (res.code === 0) {
          console.log(JSON.stringify(res.data));
          this.salonList = res.data;
          this.salonSelectedId = this.salonList[0].id;
          this.loadTimeSpanList();
          // this.total = res.data.length;
        } else {
          console.log(res);
          // this.$message.error(res.msg);
          // this.$router.push("/login");
        }
      }).catch(err => {
        console.log(err);
      });
    },
    generateDays() {
      const daysOfWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const dayListInner = [];
      const today = new Date();

      for (let i = 0; i < 8; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        let month = date.getMonth() + 1;
        if (month <= 9) {
          month = "0" + month;
        }
        const day = date.getDate();
        const year = date.getFullYear();
        const dayOfWeek = daysOfWeek[date.getDay()];
        let dayNick = month + "-" + day;
        if (i === 0) {
          dayNick = "今天";
        }
        if (i === 1) {
          dayNick = "明天";
        }
        if (i === 2) {
          dayNick = "后天";
        }

        dayListInner.push({
          fullDate: `${year}-${month}-${day}`,
          date: `${month}-${day}`,
          dayNick: dayNick,
          dayOfWeek: dayOfWeek
        });

      }
      this.dayList = dayListInner;
      this.daySelectedFullDate = dayListInner[0].fullDate;
      console.log(dayListInner);
    },
    loadTimeSpanList() {
      console.log("加载可预约时间段 " + this.salonSelectedId);
      request.get("/salon/findAvailableTime?salonId=" + this.salonSelectedId + "&date=" + this.daySelectedFullDate, {
        params: null
      }).then(res => {
        if (res.code === 0) {
          this.timeSpanList = res.data;
          console.log("可预约时间段：", JSON.stringify(res.data));
          this.clearSelectTime();
          // this.total = res.data.length;
        } else {
          console.log(res);
          this.clearSelectTime();
          // this.$message.error(res.msg);
          // this.$router.push("/login");
        }
      }).catch(err => {
        console.log(err);
      });
    },

    openAppointment(service) {
      this.clearTechnician();
      this.clearSelectTime();
      this.service = service;
      this.dialogFormVisible = true;
    },

    selectTime(timeSpan) {
      console.log("timeSpan: " + JSON.stringify(timeSpan));
      // this.selectedTimeSpan = timeSpan;
      // this.selectedTechnician = null;
      if (this.selectedTime === timeSpan.timeOfDay) {
        this.selectedTime = null; // 取消选中
        this.selectedTimeSpan = null;
        this.technicianList = [];
      } else {
        this.selectedTime = timeSpan.timeOfDay; // 切换选中
        this.selectedTimeSpan = timeSpan;
        this.technicianList = timeSpan.validTechnicians;
      }
    },
    clearSelectTime() {
      this.selectedTime = null;
      this.selectedTimeSpan = null;
      this.technicianList = [];
      this.selectedTechnician = null;
    },
    selectTechnician(technician) {
      console.log("technician: " + JSON.stringify(technician));

      //this.selectedTechnician = null;
      if (this.selectedTechnicianId === technician.id) {
        this.selectedTechnicianId = null; // 取消选中
        this.selectedTechnician = null;
      } else {
        this.selectedTechnicianId = technician.id; // 切换选中
        this.selectedTechnician = technician;
      }
    },
    clearTechnician() {
      this.selectedTechnicianId = null;
      this.selectedTechnician = null;
    },
    reload() {
      this.dialogFormVisible = false
      // this.findBySearch();
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
      let addAppointmentData = null;

      try {
        addAppointmentData = {
          userId: this.user.id,
          userName: this.user.name,
          technicianId: this.selectedTechnicianId,
          technicianName: this.selectedTechnician.name,
          serviceId: this.service.id,
          serviceName: this.service.name,
          salonId: this.salonSelectedId,
          appointmentTime: this.daySelectedFullDate + " " + this.selectedTimeSpan.timeOfDay+":00"
        };
      } catch (e) {
        console.log(e);
        this.$message.error('请先选择预约时间和技师');
        return;
      }

      request.post("/salon/addAppointment", JSON.stringify(addAppointmentData))
          .then(res => {
            if (res.code === 0) {
              // this.$message.success('预约成功');
              this.$notify({
                title: '预约成功',
                message: '您已经预约成功。',
                type: 'success'
              });
              this.dialogFormVisible = false;
              this.findBySearch();
            } else {
              // this.$message.error(res.msg);
              this.$notify.error({
                title: '预约失败',
                message: '预约失败，请检查预约信息。' + res.msg,
              });
            }
          }).catch(err => {
        console.log(err);
      });
    }
  }
}
</script>

<style>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding-right: 50px;
  float: right;
}

.image {
  width: 100%;
//margin: 5px 5px 5px 5px; display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>