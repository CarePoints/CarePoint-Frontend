// // components/PieChart.js
// import React, { useEffect, useRef } from 'react';
// import * as echarts from 'echarts';

// const PieChart = () => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     const chart = echarts.init(chartRef.current);
    
//     function makeRandomData() {
//       return [
//         { value: Math.random(), name: 'A' },
//         { value: Math.random(), name: 'B' },
//         { value: Math.random(), name: 'C' }
//       ];
//     }

//     const option = {
//       series: [
//         {
//           type: 'pie',
//           radius: [0, '50%'],
//           data: makeRandomData()
//         }
//       ]
//     };

//     chart.setOption(option);

//     const interval = setInterval(() => {
//       chart.setOption({
//         series: [
//           {
//             data: makeRandomData()
//           }
//         ]
//       });
//     }, 2000);

//     // Cleanup on unmount
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="flex justify-end">
//       <div
//         ref={chartRef}
//         className="h-[200px] lg:h-[300px] w-[300px] max-w-[50%] absolute rounded-lg  right-20 top-10  "
//       >
  
//       </div>
//     </div>
//   );
// };

// export default PieChart;


// components/PieChart.js
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import Image from 'next/image'
import red from '../../../../../../public/images/red.png'
import yellow from '../../../../../../public/images/yellow.png'
import green from '../../../../../../public/images/green.png'

const PieChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    
    function makeRandomData() {
      return [
        { value: Math.random() * 1000, name: 'Online Appointments' },
        { value: Math.random() * 1000, name: 'Offline Appointments' },
        { value: Math.random() * 1000, name: 'Premium Users' },
        { value: Math.random() * 1000, name: 'Medicine suggection' }
      ];
    }

    const option = {
      series: [
        {
          type: 'pie',
          radius: [0, '50%'],
          data: makeRandomData()
        }
      ],
      legend: {
        show: false, // Hide the default legend
      }
    };

    chart.setOption(option);

    const interval = setInterval(() => {
      chart.setOption({
        series: [
          {
            data: makeRandomData()
          }
        ]
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex">
      <div className="flex-shrink-0">
        <div
          ref={chartRef}
          className="h-[200px] lg:h-[300px] w-[300px] lg:w-[400px] rounded-lg"
        />
      </div>
      <div className="ml-6 flex flex-col justify-center">
        <h2 className="text-white font-bold mb-8 relative top-0 ml-8">Revenue Breakdown</h2>
        <ul className="text-white">
          <li className="mb-2 flex items-center ml-8">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2" />
            Online Appointments
          </li>
          <li className="mb-2 flex items-center ml-8">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2" >
              <Image src={green}/>
            </div>
            Offline Appointments
          </li>
          <li className="mb-2 flex items-center ml-8">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2" >
              <Image src={yellow}/>
            </div>
            Premium Users
          </li>
          <li className="mb-2 flex items-center ml-8">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2" >
              <Image src={red}/>
            </div>
            Medicine suggection
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PieChart;
