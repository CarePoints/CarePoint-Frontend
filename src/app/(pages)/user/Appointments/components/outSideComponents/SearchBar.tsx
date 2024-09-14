
"use client";

import React from "react";
import { PlaceholdersAndVanishInput } from "../../../../../components/ui/placeholders-and-vanish-input";
import { Dropdown, Space, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../../redux/store'; 
import { setDoctorSearchValue, setLocationSearchValue, setSelectedSearchType, setFilters } from '../../../../../../redux/yourSlice';

type SearchType = 'doctor' | 'location';

export function PlaceholdersAndVanishInputDemo() {
  const dispatch: AppDispatch = useDispatch();
  const doctorSearchValue = useSelector((state: RootState) => state.search.doctorSearchValue);
  const locationSearchValue = useSelector((state: RootState) => state.search.locationSearchValue);
  const selectedSearchType = useSelector((state: RootState) => state.search.selectedSearchType);
  const filters = useSelector((state: RootState) => state.search.filters);

  console.log('doctorSearchValue',doctorSearchValue)
  console.log('locationSearchValue',locationSearchValue)

  console.log('filters',filters)

  const placeholders: Record<SearchType, string[]> = {
    doctor: [
      "Search for a cardiologist",
      "Find a pediatrician near me",
      "Orthopedic surgeon with good reviews",
      "Dermatologist accepting new patients",
      "Experienced neurologist in my area",
    ],
    location: [
      "Search for hospitals in New York",
      "Find clinics near Central Park",
      "Medical centers in Downtown",
      "Emergency rooms within 5 miles",
      "Urgent care facilities nearby",
    ],
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedSearchType === "doctor") {
      dispatch(setDoctorSearchValue(e.target.value));
    } else if (selectedSearchType === "location") {
      dispatch(setLocationSearchValue(e.target.value));
    }
  };
  

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted:", selectedSearchType === "doctor" ? doctorSearchValue : locationSearchValue, filters);
  };

  const handleSearchTypeChange = (key: string) => {
    if (key === '1') {
      dispatch(setSelectedSearchType("doctor"));
    } else if (key === '2') {
      dispatch(setSelectedSearchType("location"));
    }
  };
  

  const handleFilterChange = (key: string) => {
    // Update the filters state based on the selected filter (you can customize this logic as needed)
    dispatch(setFilters([key])); 
  };

  const leftDropdownItems: MenuProps['items'] = [
    { key: '1', label: 'Search Doctor' },
    { key: '2', label: 'Search by current location' },
  ];

  const rightDropdownItems: MenuProps['items'] = [
    { key: '1', label: 'Cardiology' },
    { key: '2', label: 'ENT' },
    { key: '3', label: '...' },
  ];

  return (
    <div className="h-[10rem] flex flex-col justify-center items-center px-4">
      <div className="flex items-center w-full max-w-3xl">
      <Dropdown 
  menu={{ 
    items: leftDropdownItems, 
    onClick: ({ key }) => handleSearchTypeChange(key) 
  }} 
  className="mr-2"
>
  <a onClick={(e) => e.preventDefault()} className="text-gray-600 hover:text-gray-800">
    <Space>
      {selectedSearchType === "doctor" ? "Search Doctor" : "Search by Location"}
      <DownOutlined />
    </Space>
  </a>
</Dropdown>

        <div className="flex-grow relative">
          <PlaceholdersAndVanishInput
            placeholders={placeholders[selectedSearchType]}
            onChange={handleChange}
            onSubmit={onSubmit}
            value={selectedSearchType === "doctor" ? doctorSearchValue : locationSearchValue}
          />
        </div>
        {/* <Dropdown 
          menu={{ 
            items: rightDropdownItems, 
            onClick: ({ key }) => handleFilterChange(key) 
          }} 
          className="ml-2"
        >
          <Button type="default" className="text-gray-600 hover:text-gray-800">
            <Space>
              Filters
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown> */}
      </div>
    </div>
  );
}
