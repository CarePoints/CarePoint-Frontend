import React from "react";
import OrderManagement  from "./components/OrderManagement";
import CustomHeader from "../components/header/CustomHeader";

const page = () => {
  return (
    <div>
      <CustomHeader currentPage="orderManagment" />
      <OrderManagement />
    </div>
  );
};

export default page;
