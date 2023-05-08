export interface iDepartment {
  name: string;
  parent?: string;
  _id?: string;
}

export interface IWard {
  _id?: string;
  name: string;
  type: number;
  code: string;
  roomRent: string;
  consultation: string;
  emergencyConsultation: string;
}

export interface iDoctor {
  name: string;
  departments: string[];
  _id: string;
}
export type createTag = Omit<iServiceTag, '_id'>;

export interface iServiceTag {
  name: string;
  _id: string;
}

export type serviceAdded = {
  id: string | undefined;
  isSameSite: boolean;
};

export interface iAllServices {
  services: iService[];
  total: number;
}

export interface iService {
  _id?: string;
  name: string;
  serviceId: string;
  department: string;
  departmentType: string;
  tag: string;
  opd_one: number;
  ipd_one: number;
  four_one: number;
  twin_one: number;
  single_one: number;
  deluxe_one: number;
  vip_one: number;
  opd_two: number;
  ipd_two: number;
  four_two: number;
  twin_two: number;
  single_two: number;
  deluxe_two: number;
  vip_two: number;
}

export interface iStage {
  children: [
    {
      code: Number,
      description: String,
      name: String,
      _id: String
    }
  ];
  _id?: string;
  name: string;
  code: number;
  description: string;
  parent: null | string;
}

export interface iScript {
  text: string;
  service: string;
  stage: string;
}

export interface iServiceStore {
  departments: iDepartment[];
  setDepartments: (departments: iDepartment[]) => void;
  serviceTags: iServiceTag[];
  setServiceTags: (tag: iServiceTag[]) => void;
  doctors: iDoctor[];
  setDoctors: (doctors: iDoctor[]) => void;
  services: iService[];
  setServices: (services: iService[]) => void;
  wards: IWard[];
  setWards: (wards: IWard[]) => void;
  stages: iStage[];
  setStages: (stages: iStage[]) => void;
  scripts: iScript[];
  setScripts: (scripts: iScript[]) => void;
  allServices: iAllServices;
  setAllServices: (allServices: iAllServices) => void;
}
