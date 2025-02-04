import useServiceStore from '../../store/serviceStore';
import { createDepartment, getDepartments, getDepartmentsName } from './department';


export const getDepartmentsHandlerName = async (name: string) => {
  const { setDepartments } = useServiceStore.getState(); // If Zustand store
  try {
    const departments = await getDepartmentsName(name);
    if (departments) {
      setDepartments(departments.reverse()); // Set the departments in the store
    }
  } catch (error) {
    console.error('Error fetching departments:', error);
  }
};

export const getDepartmentsHandler = async (parent?: boolean) => {
  const { setDepartments } = useServiceStore.getState();
  const departments = await getDepartments(parent);
  setDepartments(departments);
};

export const createDepartmentHandler = async (
  name: string,
  parent?: string,
  tags?: string[]
) => {
  await createDepartment(name, parent, tags);
  await getDepartmentsHandler();
};
