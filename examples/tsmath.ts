/*
 * @Author: Xu.Wang
 * @Date: 2020-03-28 03:29:28
 * @Last Modified by:   Xu.Wang
 * @Last Modified time: 2020-03-28 03:29:28
 */
import { SphKernelPoly6 } from '../src/sph/sph_kernel'
import { Chart } from 'chart.js'

let vMin = -1
let vMax = 1
let interval = 1000
let vStep = (vMax - vMin) / interval

let smoothRadius = 1
let poly6 = new SphKernelPoly6(smoothRadius)

let chartData = {
  datasets: [
    {
      label: 'poly6',
      function: function (x: number) {
        return poly6.get(x)
      },
      data: [],
      borderColor: 'rgba(75, 192, 192, 1)',
      fill: false,
    },
    {
      label: 'poly6_firstDerivative',
      function: function (x: number) {
        return poly6.getFirstDerivative(x)
      },
      data: [],
      borderColor: 'rgba(192, 75, 192, 1)',
      fill: false,
    },
    {
      label: 'poly6_secondDerivative',
      function: function (x: number) {
        return poly6.getSecondDerivative(x)
      },
      data: [],
      borderColor: 'rgba(192, 192, 75, 1)',
      fill: false,
    },
  ],
}

Chart.pluginService.register({
  beforeInit: function (chart: any) {
    let data = chart.config.data
    for (let i = 0; i < data.datasets.length; i++) {
      for (let _x = vMin; _x <= vMax; _x += vStep) {
        let fct = data.datasets[i].function
        let _y = fct(_x)
        data.datasets[i].data.push({ x: _x, y: _y })
      }
    }
  },
})

let ctx = document.getElementById('TSChart')
let TSChart = new Chart(ctx, {
  type: 'line',
  data: chartData,
  options: {
    responsive: true,
    title: {
      display: true,
      text: 'SPH kernel',
    },
    scales: {
      xAxes: [
        {
          type: 'linear',
          display: true,
          ticks: {
            major: {
              fontStyle: 'bold',
              fontColor: '#FF0000',
            },
          },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'value',
          },
          ticks: {
            min: -10,
            max: 10,
          },
        },
      ],
    },
  },
})
