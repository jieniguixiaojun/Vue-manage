<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px">
      <el-card shadow="hover">
        <div class="user">
          <el-image
            class="img-title"
            :src="userImg"
            :preview-src-list="srcList"
          >
          </el-image>
          <div class="userinfo">
            <p class="name">Admin</p>
            <p class="access">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>
            当前登录时间:<span>{{ positime }}</span>
          </p>
          <p>
            当前登录地点:<span>{{ positionInfo }}</span>
          </p>
        </div>
      </el-card>
      <el-card style="margin-top: 20px; height: 460px">
        <el-table :data="tableData">
          <el-table-column
            v-for="(val, index) in tableLabel"
            :key="index"
            :prop="index"
            :label="val"
          >
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16" style="margin-top: 20px">
      <div class="num">
        <el-card
          v-for="item in countData"
          :key="item.name"
          :body-style="{ display: 'flex', padding: 0 }"
        >
          <i
            class="icon"
            :class="`el-icon-${item.icon}`"
            :style="{ background: item.color }"
          ></i>
          <div class="detail">
            <P class="num">{{ item.value }}</P>
            <P class="text">{{ item.name }}</P>
          </div>
        </el-card>
      </div>
      <el-card style="height: 280px">
        <!-- <div style="height: 280px" ref="echarts"></div> -->
        <ECharts :chartData="echartData.order" style="height: 280px" />
      </el-card>
      <div class="graph">
        <el-card style="height: 265px">
          <!-- <div style="height: 240px" ref="userEcharts"></div> -->
          <ECharts :chartData="echartData.user" style="height: 240px" />
        </el-card>
        <el-card style="height: 260px">
          <!-- <div style="height: 240px" ref="videoEcharts"></div> -->
          <ECharts
            :chartData="echartData.video"
            :isAxisChart="false"
            style="height: 240px"
          />
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>
    
<script>
import { getData } from "../../../api/data";
// import * as echarts from "echarts";
import ECharts from "../../components/ECharts.vue";
export default {
  name: "home",
  components: {
    ECharts,
  },
  data() {
    return {
      userImg: require("../../assets/images/user.png"),
      srcList: [require("../../assets/images/user.png")],
      tableData: [],
      tableLabel: {
        name: "课程",
        todayBuy: "今日购买",
        monthBuy: "本月购买",
        totalBuy: "总购买",
      },
      countData: [
        {
          name: "今日支付订单",
          value: 1234,
          icon: "success",
          color: "#2ec7c9",
        },
        {
          name: "今日收藏订单",
          value: 210,
          icon: "star-on",
          color: "#ffb980",
        },
        {
          name: "今日未支付订单",
          value: 1234,
          icon: "s-goods",
          color: "#5ab1ef",
        },
        {
          name: "本月支付订单",
          value: 1234,
          icon: "success",
          color: "#2ec7c9",
        },
        {
          name: "本月收藏订单",
          value: 210,
          icon: "star-on",
          color: "#ffb980",
        },
        {
          name: "本月未支付订单",
          value: 1234,
          icon: "s-goods",
          color: "#5ab1ef",
        },
      ],
      echartData: {
        order: {
          xData: [],
          series: [],
        },
        user: {
          xData: [],
          series: [],
        },
        video: {},
      },
      // 当前位置
      positionInfo: "未知",
      // 当前时间
      positime: "",
    };
  },
  mounted() {
    this.dingwei();
    this.$nextTick(() => {
      setInterval(this.getNowTime, 1000);
    });
    getData().then((res) => {
      const { code, data } = res.data;
      if (code === 20000) {
        //列表数据
        this.tableData = data.tableData;
        //折线图数据处理
        const order = data.orderData;
        const xData = order.date;
        const keyArray = Object.keys(order.data[0]);
        const series = [];
        keyArray.forEach((key) => {
          series.push({
            name: key,
            data: order.data.map((item) => item[key]),
            type: "line",
          });
        });

        this.echartData.order.xData = xData;
        this.echartData.order.series = series;
        //柱状图
        (this.echartData.user.xData = data.userData.map((item) => item.date)),
          (this.echartData.user.series = [
            {
              name: "新增用户",
              data: data.userData.map((item) => item.new),
              type: "bar",
            },
            {
              name: "活跃用户",
              data: data.userData.map((item) => item.active),
              type: "bar",
            },
          ]);
      }
      // 饼图配置
      this.echartData.video = {
        series: [
          {
            name: "金额",
            type: "pie",
            radius: "50%",
            data: data.videoData,
          },
        ],
      };
    });
  },
  methods: {
    dingwei() {
      AMap.plugin("AMap.Geolocation", () => {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
        });

        geolocation.getCityInfo((status, result) => {
          //只能获取当前用户所在城市和城市的经纬度
          if (status == "complete") {
            console.log("当前位置", result.province);
            this.positionInfo = result.province;
          }
        });
        geolocation.getCurrentPosition((status, result) => {
          //获取用户当前的精确位置
          if (status == "complete") {
          }
        });
      });
    },
    //获取当前时间
    getNowTime() {
      var date = new Date();
      //年 getFullYear()：四位数字返回年份
      var year = date.getFullYear(); //getFullYear()代替getYear()
      //月 getMonth()：0 ~ 11
      var month = date.getMonth() + 1;
      //日 getDate()：(1 ~ 31)
      var day = date.getDate();
      //时 getHours()：(0 ~ 23)
      var hour = date.getHours();
      //分 getMinutes()： (0 ~ 59)
      var minute = date.getMinutes();
      //秒 getSeconds()：(0 ~ 59)
      var second = date.getSeconds();
      var time =
        year +
        "-" +
        this.addZero(month) +
        "-" +
        this.addZero(day) +
        " " +
        this.addZero(hour) +
        ":" +
        this.addZero(minute) +
        ":" +
        this.addZero(second);
      return (this.positime = time);
    },
    addZero(s) {
      return s < 10 ? "0" + s : s;
    },
  },
};
</script>
    