import CustomHeader from "../components/header/CustomHeader"
import AdminProductListing from "./components/productsListing"

const page = () => {
  return (
    <div>
        <CustomHeader currentPage="productsListing" />
      <AdminProductListing/>
    </div>
  )
}

export default page
