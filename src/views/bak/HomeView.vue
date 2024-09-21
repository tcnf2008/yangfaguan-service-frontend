<!--<template>-->
<!--  <div>-->
<!--    <div style="display: flex">-->
<!--      <div style="flex: 1;">-->
<!--        <span style="color: #FF7F50">您好！{{ user.name }}，欢迎使用本系统 </span>-->
<!--        <div style="margin-bottom: 15px; margin-top: 10px; font-weight: bold; font-size: 18px">系统通知提醒-->
<!--        </div>-->
<!--        <el-collapse v-model="activeName" accordion>-->
<!--          <el-collapse-item v-for="item in data" :title="item.name + '   ' + item.time"  :name="item.id">-->
<!--            <div style="padding: 0 20px;">{{ item.description }}</div>-->
<!--          </el-collapse-item>-->
<!--        </el-collapse>-->
<!--      </div>-->
<!--      <div style="width: 50px"></div>-->
<!--      <div style="flex: 1;">-->
<!--        <div id="bie" style="width: 100%; height: 400px"></div>-->
<!--      </div>-->
<!--    </div>-->
<!--    <div style="display: flex">-->
<!--      <div style="flex: 1; margin-top: 20px">-->
<!--        <div id="bar" style="width: 100%; height: 400px"></div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->

<!--import request from "@/utils/request";-->
<!--import * as echarts from "echarts";-->

<!--export default {-->
<!--  name: 'HomeView',-->

<!--  data() {-->
<!--    return {-->
<!--      activeName: '1',-->
<!--      data: [],-->
<!--      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},-->
<!--      params: {-->
<!--        userName: ''-->
<!--      },-->
<!--    };-->
<!--  },-->
<!--  mounted() {-->
<!--    // this.findNotice();-->
<!--    // this.initEcharts();-->
<!--    // this.initBar();-->
<!--    this.jump();-->
<!--  },-->
<!--  methods: {-->
<!--    initEcharts() {-->
<!--      request.get("/room/echarts/bie").then(res => {-->
<!--        if (res.code === 0) {-->
<!--          // 开始去渲染饼图数据啦-->
<!--          this.initBie(res.data)-->
<!--        } else {-->
<!--          this.$message.error(res.msg)-->
<!--        }-->
<!--      }).catch(err => {-->
<!--        console.log(err);-->
<!--      });-->
<!--      request.get("/reserve/echarts/bar").then(res => {-->
<!--        if (res.code === 0) {-->
<!--          let map = res.data;-->
<!--          // 开始去渲染柱状图数据啦-->
<!--          this.initBar(map.xAxis, map.yAxis)-->
<!--        } else {-->
<!--          this.$message.error(res.msg)-->
<!--        }-->
<!--      }).catch(err => {-->
<!--        console.log(err);-->
<!--      });-->
<!--    },-->
<!--    initBie(data) {-->
<!--      let chartDom = document.getElementById('bie');-->
<!--      let myChart = echarts.init(chartDom);-->
<!--      let option;-->

<!--      option = {-->
<!--        title: {-->
<!--          text: '养发馆统计（饼图）',-->
<!--          subtext: '统计维度：养发馆分类',-->
<!--          left: 'center'-->
<!--        },-->
<!--        tooltip: {-->
<!--          trigger: 'item'-->
<!--        },-->
<!--        legend: {-->
<!--          orient: 'vertical',-->
<!--          left: 'left'-->
<!--        },-->
<!--        series: [-->
<!--          {-->
<!--            name: '养发馆分类',-->
<!--            type: 'pie',-->
<!--            radius: '50%',-->
<!--            data: data,-->
<!--            emphasis: {-->
<!--              itemStyle: {-->
<!--                shadowBlur: 10,-->
<!--                shadowOffsetX: 0,-->
<!--                shadowColor: 'rgba(0, 0, 0, 0.5)'-->
<!--              }-->
<!--            }-->
<!--          }-->
<!--        ]-->
<!--      };-->
<!--      option && myChart.setOption(option);-->
<!--    },-->
<!--    initBar(xAxis, yAxis) {-->
<!--      let chartDom = document.getElementById('bar');-->
<!--      let myChart = echarts.init(chartDom);-->
<!--      let option;-->

<!--      option = {-->
<!--        title: {-->
<!--          text: '养发馆预约统计（柱状图）',-->
<!--          subtext: '统计维度：养发馆预约次数',-->
<!--          left: 'center'-->
<!--        },-->
<!--        xAxis: {-->
<!--          type: 'category',-->
<!--          data: xAxis-->
<!--        },-->
<!--        yAxis: {-->
<!--          type: 'value'-->
<!--        },-->
<!--        series: [-->
<!--          {-->
<!--            data: yAxis,-->
<!--            type: 'bar',-->
<!--            showBackground: true,-->
<!--            backgroundStyle: {-->
<!--              color: 'rgba(180, 180, 180, 0.2)'-->
<!--            }-->
<!--          }-->
<!--        ]-->
<!--      };-->
<!--      option && myChart.setOption(option);-->
<!--    },-->
<!--    jump(){-->
<!--      if(this.user.role === 'USER'){-->
<!--        this.$router.push('/appointment')-->
<!--      }-->
<!--      else if(this.user.role === 'ADMIN'||user.role === 'MANAGER'||user.role === 'TECHNICIAN'){-->
<!--        this.$router.push('/salon');-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->
