import CustomHeader from "../components/header/CustomHeader"
import DoctorMangement from "./components/DoctorManagement"

const page = () => {
  return (
    <div>
        <CustomHeader currentPage="doctors" />
        <DoctorMangement/>
    </div>
  )
}

export default page
