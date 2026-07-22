<template>
    <div class="console-page">
        <!-- 欢迎区域 -->
        <div class="welcome-section">
            <n-h2 class="welcome-text">
                欢迎回来，{{ userStore.userNickName }}
            </n-h2>
            <n-text depth="3">祝你今天工作愉快！</n-text>
        </div>

        <!-- 图表区域 -->
        <n-grid :x-gap="16" :y-gap="16" cols="1 m:3" responsive="screen">
            <n-grid-item>
                <n-card title="访问趋势" size="small" :bordered="false" class="chart-card">
                    <div ref="lineChartRef" class="chart-box"></div>
                </n-card>
            </n-grid-item>
            <n-grid-item>
                <n-card title="每日活跃用户" size="small" :bordered="false" class="chart-card">
                    <div ref="barChartRef" class="chart-box"></div>
                </n-card>
            </n-grid-item>
            <n-grid-item>
                <n-card title="用户活跃时段" size="small" :bordered="false" class="chart-card">
                    <div ref="heatmapRef" class="chart-box"></div>
                </n-card>
            </n-grid-item>
        </n-grid>
    </div>
</template>

<script setup>
    import { ref, onMounted, onBeforeUnmount } from 'vue'
    import * as echarts from 'echarts'
    import { useUserStore } from '@/stores/userStore'

    const userStore = useUserStore()

    const lineChartRef = ref(null)
    const barChartRef = ref(null)
    const heatmapRef = ref(null)

    let lineChart = null
    let barChart = null
    let heatmap = null

    // 折线图：访问趋势
    const initLineChart = () => {
        if (!lineChartRef.value) return
        lineChart = echarts.init(lineChartRef.value)
        lineChart.setOption({
            grid: { top: 10, right: 10, bottom: 24, left: 36 },
            tooltip: { trigger: 'axis' },
            xAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                axisLine: { lineStyle: { color: '#ddd' } },
            },
            yAxis: {
                type: 'value',
                splitLine: { lineStyle: { color: '#f0f0f0' } },
            },
            series: [
                {
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    smooth: true,
                    lineStyle: { color: '#18a058' },
                    itemStyle: { color: '#18a058' },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(24, 160, 88, 0.3)' },
                            { offset: 1, color: 'rgba(24, 160, 88, 0.02)' },
                        ]),
                    },
                },
            ],
        })
    }

    // 柱状图：每日活跃用户
    const initBarChart = () => {
        if (!barChartRef.value) return
        barChart = echarts.init(barChartRef.value)
        barChart.setOption({
            grid: { top: 10, right: 10, bottom: 24, left: 36 },
            tooltip: { trigger: 'axis' },
            xAxis: {
                type: 'category',
                data: ['07/16', '07/17', '07/18', '07/19', '07/20', '07/21', '07/22'],
                axisLine: { lineStyle: { color: '#ddd' } },
            },
            yAxis: {
                type: 'value',
                splitLine: { lineStyle: { color: '#f0f0f0' } },
            },
            series: [
                {
                    data: [120, 200, 150, 180, 220, 260, 310],
                    type: 'bar',
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#2080f0' },
                            { offset: 1, color: '#4098fc' },
                        ]),
                        borderRadius: [4, 4, 0, 0],
                    },
                },
            ],
        })
    }

    // 热力图：用户活跃时段
    const initHeatmap = () => {
        if (!heatmapRef.value) return
        heatmap = echarts.init(heatmapRef.value)

        const hours = ['0h', '2h', '4h', '6h', '8h', '10h', '12h', '14h', '16h', '18h', '20h', '22h']
        const days = ['周六', '周五', '周四', '周三', '周二', '周一', '周日']
        const data = []
        for (let i = 0; i < hours.length; i++) {
            for (let j = 0; j < days.length; j++) {
                let value = Math.floor(Math.random() * 100)
                // 模拟上班时段活跃
                if (i >= 4 && i <= 9) value += 60
                if (j >= 2 && j <= 5) value += 30
                data.push([i, j, Math.min(value, 100)])
            }
        }

        heatmap.setOption({
            grid: { top: 10, right: 20, bottom: 24, left: 40 },
            tooltip: {
                formatter: (params) =>
                    `${days[params.value[1]]} ${hours[params.value[0]]}: ${params.value[2]}%`,
            },
            xAxis: {
                type: 'category',
                data: hours,
                splitArea: { show: true },
                axisLine: { lineStyle: { color: '#ddd' } },
            },
            yAxis: {
                type: 'category',
                data: days,
                splitArea: { show: true },
                axisLine: { lineStyle: { color: '#ddd' } },
            },
            visualMap: {
                min: 0,
                max: 100,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: 0,
                inRange: { color: ['#f0f9ff', '#2080f0', '#0e5eb8'] },
                show: false,
            },
            series: [
                {
                    type: 'heatmap',
                    data: data,
                    label: { show: false },
                    emphasis: {
                        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' },
                    },
                },
            ],
        })
    }

    const resizeCharts = () => {
        lineChart?.resize()
        barChart?.resize()
        heatmap?.resize()
    }

    onMounted(() => {
        initLineChart()
        initBarChart()
        initHeatmap()
        window.addEventListener('resize', resizeCharts)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('resize', resizeCharts)
        lineChart?.dispose()
        barChart?.dispose()
        heatmap?.dispose()
    })
</script>

<style scoped>
.console-page {
    padding: 24px;
}
.welcome-section {
    margin-bottom: 24px;
}
.welcome-text {
    margin: 0 0 4px 0;
}
.chart-card {
    border-radius: 8px;
}
.chart-box {
    width: 100%;
    height: 260px;
}
</style>
