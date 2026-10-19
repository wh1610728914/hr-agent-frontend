<template>
  <div class="chart-container" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
// 按需引入 ECharts 核心模块和图表类型
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer
]);

// 定义 DOM 引用
const chartRef = ref<HTMLElement | null>(null);
let myChart: echarts.ECharts | null = null;

// 图表配置项 (Option)
const getOption = () => {
  return {
    title: {
      text: '近7天新增候选人',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '投递人数',
        type: 'line',
        smooth: true, // 平滑曲线
        data: [120, 132, 101, 134, 90, 230, 210],
        itemStyle: { color: '#3b82f6' } // 蓝色
      },
      {
        name: '面试人数',
        type: 'line',
        smooth: true,
        data: [20, 32, 21, 44, 30, 60, 50],
        itemStyle: { color: '#10b981' } // 绿色
      }
    ]
  };
};

// 初始化图表
const initChart = () => {
  if (chartRef.value) {
    myChart = echarts.init(chartRef.value);
    myChart.setOption(getOption());
  }
};

// 监听窗口大小变化，自适应图表
const handleResize = () => {
  myChart?.resize();
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  myChart?.dispose(); // 销毁实例，防止内存泄漏
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px; /* 必须设置高度，否则不显示 */
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
</style>