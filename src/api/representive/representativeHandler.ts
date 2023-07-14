import useReprentativeStore from '../../store/representative';
import { getRepresentative } from './reprentative';

export const getRepresntativesHandler = async () => {
  const { setRepresentative } = useReprentativeStore.getState();
  const representative = await getRepresentative();
  setRepresentative(representative);
  return representative;
};
