// "use client";

// import * as React from "react";
// import { DayPicker, DayPickerProps } from "react-day-picker";

// import { cn } from "@/app/utils/util";
// import { buttonVariants } from "@/components/ui/button";

// export type CalendarProps = DayPickerProps;

// function Calendar({
//   className,
//   classNames,
//   showOutsideDays = true,
//   ...props
// }: CalendarProps) {
//   const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);

//   const handleDayClick = (day: Date) => {
//     setSelectedDate(day);
//   };

//   return (
//     <div>
//       <DayPicker
//         showOutsideDays={showOutsideDays}
//         className={cn("p-3", className)}
//         classNames={{
//           months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
//           month: "space-y-4",
//           caption: "flex justify-center pt-1 relative items-center",
//           caption_label: "text-sm font-medium text-white",
//           nav: "space-x-1 flex items-center",
//           nav_button: cn(
//             buttonVariants({ variant: "outline" }),
//             "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
//           ),
//           nav_button_previous: "absolute left-1 text-white", // Set arrow color to white
//           nav_button_next: "absolute right-1 text-white", // Set arrow color to white
//           table: "w-full border-collapse space-y-1",
//           head_row: "flex",
//           head_cell:
//             "text-white rounded-md w-9 font-normal text-[0.8rem]",
//           row: "flex w-full mt-2",
//           cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
//           day: cn(
//             buttonVariants({ variant: "ghost" }),
//             "h-9 w-9 p-0 font-normal text-white hover:bg-green-500 hover:text-white"
//           ),
//           day_range_end: "day-range-end",
//           day_selected:
//             "bg-green-500 text-white hover:bg-green-600 focus:bg-green-600", // Maintain color on selected day
//           day_today: "bg-accent text-white",
//           day_outside:
//             "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
//           day_disabled: "text-muted-foreground opacity-50",
//           day_range_middle:
//             "aria-selected:bg-accent aria-selected:text-white",
//           day_hidden: "invisible",
//           ...classNames,
//         }}
//         onDayClick={handleDayClick} // Add this line to handle day clicks
//         {...props}
//       />
      
//       <div className="mt-4 text-black py-2 rounded-2xl bg-blue-200">
//         <div className="ml-[21%]">Selected Date: {selectedDate ? selectedDate.toDateString() : "None"}</div>
//       </div>
//     </div>
//   );
// }

// Calendar.displayName = "Calendar";

// export { Calendar };


"use client";

import * as React from "react";
import { DayPicker, DayPickerProps } from "react-day-picker";

import { cn } from "@/app/utils/util";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps =  any;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  onDateChange,
  ...props
}: CalendarProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    if(day){
      onDateChange(day)
    }
  };
 
  return (
    <div>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium text-white",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1 text-white",
          nav_button_next: "absolute right-1 text-white",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-white rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal text-white hover:bg-green-500 hover:text-white"
          ),
          day_range_end: "day-range-end",
          day_selected: "bg-green-800 text-white hover:bg-green-900 focus:bg-green-900", // Changed to dark green
          day_today: "bg-accent text-white",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-white",
          day_hidden: "invisible",
          ...classNames,
        }}
        selected={selectedDate}
        onDayClick={handleDayClick}
        {...props}
      />

      <div className="mt-4 text-black py-2 rounded-2xl bg-blue-200">
        <div className="ml-[21%]">Selected Date: {selectedDate ? selectedDate.toDateString() : "None"}</div>
      </div>
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };



