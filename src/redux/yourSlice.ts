import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SearchType = 'doctor' | 'location';

interface Doctor {
  firstname: string;
  lastname: string;
}

interface SearchState {
  doctorSearchValue: string;
  locationSearchValue: string;
  selectedSearchType: SearchType;
  filters: string[];
  doctorData: any[]
  appoinmentData: Record<string, any> | null; 
  messageDoctor: any | null;
  prescriptionData: PrescriptionData | null; 
}

interface PrescriptionData {
  patientName: string;
  patientEmail: string;
  medications: string[];
}

const initialState: SearchState = {
  doctorSearchValue:'',
  locationSearchValue: '',
  selectedSearchType: 'doctor',
  filters: [],
  doctorData:[],
  appoinmentData: null,
  messageDoctor: null,
  prescriptionData: null,
}

const yourSlice = createSlice({
  name: 'yourSlice',
  initialState,
  reducers: {
    setDoctorSearchValue(state, action: PayloadAction<string>) {
      state.doctorSearchValue = action.payload;
    },
    setLocationSearchValue(state, action: PayloadAction<string>) {
      state.locationSearchValue = action.payload;
    },
    // Fixing the reducer to update the correct state property
    setSelectedSearchType(state, action: PayloadAction<SearchType>) {
      state.selectedSearchType = action.payload;
    },
    setFilters(state, action: PayloadAction<string[]>) {
      state.filters = action.payload;
    },
    setDoctorData(state, action: PayloadAction<string[]>){
      state.doctorData = action.payload;
    },
    setAppoinmentData(state, action: PayloadAction<string[]>){
      state.appoinmentData = action.payload;
    },
    setDoctorForMessage(state, action: PayloadAction<Doctor | null>) {
      state.messageDoctor = action.payload;
    },
    setPrescriptionData(state, action: PayloadAction<PrescriptionData>) {
      state.prescriptionData = action.payload;
    },
  },
});


export const {setDoctorSearchValue, setLocationSearchValue, setSelectedSearchType,setFilters ,setDoctorData,setAppoinmentData,setDoctorForMessage,setPrescriptionData} = yourSlice.actions;
export default yourSlice.reducer;
