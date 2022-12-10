import { apiClient } from "../apiClient";

export const getDepartments = async (parent?: boolean) => {
  const { data } = await apiClient.get(`/department?parent=${parent ? true : false}`);
  return data;
};

export const createDepartment = async (name: string, parent?: string, tags?: string[]) => {
  const { data } = await apiClient.post("/department", { name, parent, tags });
  return data;
};

export const getDepartmentTags = async () => {
  const { data } = await apiClient.get("/department/tag");
  return data;
};
