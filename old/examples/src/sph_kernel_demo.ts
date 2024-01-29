/*
 * @Author: Xu.Wang
 * @Date: 2020-03-29 00:42:39
 * @Last Modified by: Xu.Wang
 * @Last Modified time: 2020-04-04 23:01:59
 */
import { SphKernelPoly6, SphKernelSpiky } from '../../src/sph/sph_kernel'
import { Chart } from 'chart.js'

export function SPH_Kernel_Demo() {
  let vMin = -1
  let vMax = 1
  let interval = 1000
  let vStep = (vMax - vMin) / interval

  let smoothRadius = 1
  let poly6 = new SphKernelPoly6(smoothRadius)
  let spiky = new SphKernelSpiky(smoothRadius)

  let chartDataPoly6 = {
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

  let chartDataSpiky = {
    datasets: [
      {
        label: 'spiky',
        function: function (x: number) {
          return spiky.get(x)
        },
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
      {
        label: 'spiky_firstDerivative',
        function: function (x: number) {
          return spiky.getFirstDerivative(x)
        },
        data: [],
        borderColor: 'rgba(192, 75, 192, 1)',
        fill: false,
      },
      {
        label: 'spiky_secondDerivative',
        function: function (x: number) {
          return spiky.getSecondDerivative(x)
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

  let divPoly6 = document.getElementById('chart_poly6')
  let ChartPoly6 = new Chart(divPoly6, {
    type: 'line',
    data: chartDataPoly6,
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'SPH kernel:poly6',
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
  let divSpiky = document.getElementById('chart_spiky')
  let ChartSpiky = new Chart(divSpiky, {
    type: 'line',
    data: chartDataSpiky,
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'SPH kernel:spiky',
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
              min: -15,
              max: 30,
            },
          },
        ],
      },
    },
  })
}
