import useServiceStore from '../../store/serviceStore';
import { iStage } from '../../types/store/service';
import { createStage, getStages, getSubStages } from './stages';

export const getStagesHandler = async () => {
  const { setStages } = useServiceStore.getState();
  const stages = await getStages();
  setStages(stages);
  return stages;
};

export const getSubStagesHandler = async () => {
  const { setSubStages } = useServiceStore.getState();
  const subStages = await getSubStages();
  setSubStages(subStages);
};

export const createStageHandler = async (stage: iStage) => {
  const { stages, setStages } = useServiceStore.getState();
  const stageAdded = await createStage(stage);
  setStages([...stages, stageAdded]);
};
