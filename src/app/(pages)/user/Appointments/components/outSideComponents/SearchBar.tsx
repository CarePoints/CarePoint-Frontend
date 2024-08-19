"use client";

import React, { useState } from "react";
import { PlaceholdersAndVanishInput } from "../../../../../components/ui/placeholders-and-vanish-input";

export function PlaceholdersAndVanishInputDemo() {
  const [inputValue, setInputValue] = useState("");
  console.log('inputValue',inputValue);
  
  const placeholders = [
    "How can I schedule an appointment with a specialist?",
    "What are the symptoms of a common cold?",
    "How do I prepare for a medical check-up?",
    "What are the available treatments for hypertension?",
    "How can I access my medical records online?",
  ];
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // Update the input value in state
    console.log(e.target.value); // Log the current input value
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
    console.log("Input Value: ", inputValue); // Log the final input value on submit
  };

  return (
    <div className="h-[10rem] flex flex-col justify-center items-center px-4">
  
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
        value={inputValue} // Pass the input value to the component
      />
    </div>
  );
}
