export interface iUser {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  uid: string;
  role: string;
  image: string;
  access: string;
  refresh: string;
}

export interface iUserStore {
  user: null | iUser;
  setUser: (user: iUser | null) => void;
}
