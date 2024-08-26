import CustomHeader from "../components/header/CustomHeader"
import UserAppointmentsAdmin from "./components/userAppoinments"

const page = () => {
  return (
    <div>
      <CustomHeader currentPage="userAppoinment" />
      <UserAppointmentsAdmin/>
    </div>
  )
}

export default page
