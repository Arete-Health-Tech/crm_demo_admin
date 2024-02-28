import useServiceStore from '../../store/serviceStore';
import { iScript } from '../../types/store/service';
import { createScript, getSingleScript } from './script';

export const createScriptHandler = async (script: iScript) => {
  const { scripts, setScripts } = useServiceStore.getState();
  const newScriptAdded = await createScript(script);
  setScripts([...scripts, newScriptAdded]);
};

export const getSingleScriptHandler = async (
  serviceId: string,
  stageId: string
) => {
  return await getSingleScript(serviceId, stageId);
};
