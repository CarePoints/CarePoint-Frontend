import CustomHeader from '../components/header/CustomHeader'
import UserManagement from './components/UserManagement'
const page = () => {
  return (
    <div>
        <CustomHeader currentPage="users" />
        <UserManagement/>
    </div>
  )
}

export default page
