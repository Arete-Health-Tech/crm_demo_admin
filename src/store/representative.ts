import { create } from 'zustand';
import { iRepresntative } from '../types/store/reprentative';

const useReprentativeStore = create<iRepresntative>((set) => ({
  representative: [],
  setRepresentative: (representative) => set({ representative })
}));

export default useReprentativeStore;
