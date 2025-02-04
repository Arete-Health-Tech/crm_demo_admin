import { Roles } from '../../constants/types';

export interface iUser {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  uid: string;
  role: Roles;
  image: string;
  access: string;
  refresh: string;
  status?: boolean;

}

export interface iUserStore {
  user: null | iUser;
  setUser: (user: iUser | null) => void;
  
}
