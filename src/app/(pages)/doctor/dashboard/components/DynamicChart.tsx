'use client';
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const MyChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Initialize the chart
    const myChart = echarts.init(chartRef.current);

    // Show loading animation
    myChart.showLoading();

    // Fetch data
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        // Hide loading animation and set options
        myChart.hideLoading();
        myChart.setOption({
          title: {
            
          },
          tooltip: {},
          legend: {},
          xAxis: {
            data: data.categories
          },
          yAxis: {},
          series: [
            {
              
              type: 'bar',
              data: data.values
            }
          ]
        });
      })
      .catch(err => {
        console.error('Error fetching data:', err);
      });

    // Cleanup function
    return () => {
      myChart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ height: '300px', width: '120%' }} className='ml-0'/>;
};

export default MyChart;
