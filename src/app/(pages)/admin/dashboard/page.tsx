import CustomHeader from "../components/header/CustomHeader"
import Dashboard from "./components/Dashboard"

const page = () => {
  return (
    <div>
      <CustomHeader currentPage="dashboard" />
      <Dashboard/>
    </div>
  )
}

export default page
