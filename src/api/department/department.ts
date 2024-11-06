import { apiClient } from '../apiClient';

export const getDepartments = async (parent?: boolean) => {
  const { data } = await apiClient.get(
    `/department?parent=${parent ? true : false}`
  );
  console.log( data, "api" );
  return data;
};

export const createDepartment = async (
  name: string,
  parent?: string,
  tags?: string[]
) => {
  // console.log(name, parent, tags);
  const { data } = await apiClient.post('/department', { name, parent, tags });
  return data;
};


