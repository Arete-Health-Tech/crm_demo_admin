import { apiClient } from '../apiClient';

export const getDoctorsName = async (name: String) => {
  const { data } = await apiClient.get(`/department/allDoctor/?name=${name}`);
  console.log(data);
  return data.body;
};
export const getDoctors = async () => {
  const { data } = await apiClient.get(
    `/department/doctor?department&subDepartment`
  );
  return data;
};

export const createNewDoctor = async (doctor: any) => {
  const { data } = await apiClient.post(`/department/doctor`, doctor);
  return data;
};
