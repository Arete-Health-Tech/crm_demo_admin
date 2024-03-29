import useServiceStore from '../../store/serviceStore';
import { createNewDoctor, getDoctors } from './doctor';

export const getDoctorsHandler = async () => {
  const { setDoctors } = useServiceStore.getState();
  const doctors = await getDoctors();
  setDoctors(doctors);
};

export const createNewDoctorHandler = async (doctor: any) => {
  const { setDoctors, doctors } = useServiceStore.getState();
  const addedDoctor = await createNewDoctor(doctor);
  // console.log(addedDoctor);
  setDoctors([...doctors, addedDoctor]);
};
