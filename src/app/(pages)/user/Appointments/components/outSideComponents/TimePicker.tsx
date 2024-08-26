// 'use client';
// import * as React from 'react';
// import dayjs, { Dayjs } from 'dayjs';
// import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';

// export default function ResponsiveTimePickers({onTimeChange}:any) {
//   // State to hold the selected time value
//   const [selectedTime, setSelectedTime] = React.useState<Dayjs | null>(dayjs());

//   // Handler to update the selected time
//   const handleTimeChange = (newValue: Dayjs | null) => {
//     setSelectedTime(newValue);
//     onTimeChange(newValue)
//   };

//   // Format the selected time to only display hours and minutes
//   const formatTime = (time: Dayjs | null) => {
//     return time ? time.format('HH:mm') : 'None';
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <DemoContainer
//         components={[
//           'TimePicker',
//           'MobileTimePicker',
//           'DesktopTimePicker',
//           'StaticTimePicker',
//         ]}
//       >
//         <DemoItem label="Static variant">
//           <StaticTimePicker
//             value={selectedTime}
//             onChange={handleTimeChange} // Handle time change
//             // Additional props if needed
//           />
//         </DemoItem>
//       </DemoContainer>

//       {/* Displaying the selected time */}
//       <div className="text-black py-2 rounded-2xl mt-4 bg-blue-200">
//         <div className='ml-[25%]'>
//         Selected Time: {formatTime(selectedTime)}
//         </div>
//       </div>
//     </LocalizationProvider>
//   );
// }


'use client';
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';

export default function ResponsiveTimePickers({onTimeChange}:any) {
  const [selectedTime, setSelectedTime] = React.useState<Dayjs | null>(dayjs());

  const handleTimeChange = (newValue: Dayjs | null) => {
    setSelectedTime(newValue);
    onTimeChange(newValue)
  };

  const formatTime = (time: Dayjs | null) => {
    return time ? time.format('HH:mm') : 'None';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <style jsx global>{`
        .MuiDialogActions-root {
          display: none !important;
        }
      `}</style>
      <DemoContainer
        components={[
          'TimePicker',
          'MobileTimePicker',
          'DesktopTimePicker',
          'StaticTimePicker',
        ]}
      >
        <DemoItem label="Static variant">
          <StaticTimePicker
            value={selectedTime}
            onChange={handleTimeChange}
          />
        </DemoItem>
      </DemoContainer>

      <div className="text-black py-2 rounded-2xl mt-4 bg-blue-200">
        <div className='ml-[25%]'>
        Selected Time: {formatTime(selectedTime)}
        </div>
      </div>
    </LocalizationProvider>
  );
}