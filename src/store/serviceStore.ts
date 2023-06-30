import { create } from 'zustand';
import { iServiceStore } from '../types/store/service';
const useServiceStore = create<iServiceStore>((set, get) => ({
  departments: [],
  setDepartments: (departments) => set({ departments }),
  doctors: [],
  setDoctors: (doctors) => {
    set({ doctors });
  },
  allServices: {
    services: [],
    total: 0
  },
  setAllServices: (allServices) => {
    set({ allServices });
  },
  services: [],
  setServices: (services) => {
    set({ services });
  },
  serviceTags: [],
  setServiceTags: (serviceTags) => {
    set({ serviceTags });
  },
  wards: [],
  setWards: (wards) => {
    set({ wards });
  },
  stages: [],
  setStages: (stages) => {
    set({ stages });
  },
  subStages: [],
  setSubStages: (subStages) => {
    set({ subStages });
  },
  scripts: [],
  setScripts: (scripts) => {
    set({ scripts });
  }
}));

export default useServiceStore;
