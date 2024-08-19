import Image from 'next/image';
import { Calendar } from "./outSideComponents/Calendar";
import { PlaceholdersAndVanishInputDemo } from "./outSideComponents/SearchBar";
import ResponsiveTimePickers from "./outSideComponents/TimePicker";
import doctor from "../../../../../../public/images/profile.png";

const Appointments = () => {
  return (
    <div className="flex flex-row p-10 px-20 mt-6">
      <div className="bg-[#1E1F25] p-10 flex flex-col w-[490px] rounded-3xl min-h-screen">
        <Calendar className="ml-5" />
        <span className="border-b-2 border-white text-white inline-block mt-4"></span>
        <ResponsiveTimePickers />
      </div>
      <div className="bg-blue-300 p-10 flex flex-col ml-10 rounded-3xl w-full">
        <div>
          <h1 className="font-extrabold text-[22px]">List of Physicians</h1>
          <PlaceholdersAndVanishInputDemo />
        </div>
        <div className="flex gap-10">
          <div className="p-32 rounded-3xl bg-gray-100">
         
          </div>
          <div className="p-32 rounded-3xl bg-black"></div>
          <div className="p-32 rounded-3xl bg-black"></div>
        </div>
        
      </div>
    </div>
  );
};

export default Appointments;
