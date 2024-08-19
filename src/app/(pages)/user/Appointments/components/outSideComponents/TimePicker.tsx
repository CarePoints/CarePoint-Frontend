'use client';
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';

export default function ResponsiveTimePickers() {
  // State to hold the selected time value
  const [selectedTime, setSelectedTime] = React.useState<Dayjs | null>(dayjs());

  // Handler to update the selected time
  const handleTimeChange = (newValue: Dayjs | null) => {
    setSelectedTime(newValue);
  };

  // Format the selected time to only display hours and minutes
  const formatTime = (time: Dayjs | null) => {
    return time ? time.format('HH:mm') : 'None';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            onChange={handleTimeChange} // Handle time change
            // Additional props if needed
          />
        </DemoItem>
      </DemoContainer>

      {/* Displaying the selected time */}
      <div className="text-white mt-4">
        Selected Time: {formatTime(selectedTime)}
      </div>
    </LocalizationProvider>
  );
}
