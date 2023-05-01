import {
  Box,
  Button,
  Step,
  StepContent,
  StepIcon,
  StepLabel,
  Stepper
} from '@mui/material';
import { useEffect, useState } from 'react';
import useServiceStore from '../../../store/serviceStore';
import { iStage } from '../../../types/store/service';
import { GridCheckCircleIcon } from '@mui/x-data-grid';
import { makeStyles } from '@mui/material';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
// import { makeStyles } from '@material-ui/core/styles';

type Props = {
  stage: string | undefined;
};


const stages = [
  {
    label: 'New Lead',
    subStages: ['Call', 'Engagement', 'ABC DEF']
  },
  {
    label: 'Nurturing',
    subStages: ['Call', 'Engagement', 'ABC DEF']
  },
  {
    label: 'Orientation',
    subStages: ['Call', 'Engagement', 'ABC DEF']
  },
  {
    label: 'Win ',
    subStages: ['Call', 'Engagement', 'ABC DEF']
  }
];




const StageCard = (props: Props) => {
  // const { stages } = useServiceStore();
  // const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);

  // const getCurrentStage = () => {
  //   const index = stages.findIndex((stage) => stage._id === props.stage);   
  //   console.log(index);
  //   setCurrentStageIndex(index);
  // };
  // useEffect(() => {
  //   getCurrentStage();
  // }, [props.stage]);
  
         const [activeStep, setActiveStep] = useState(0);
         const [subStageStatus, setSubStageStatus] = useState(
           stages.reduce(
             (status, { subStages }) => ({ ...status, [subStages[0]]: false }),
             {}
           )
         );
         const [resetSubStages, setResetSubStages] = useState(false);

         const handleStepClick = (step) => () => {
           if (
             step === 1 &&
             !subStageStatus[stages[0].subStages[2]] &&
             activeStep !== 2 &&
             activeStep !== 3
           ) {
             return;
           }
           if (
             step === 1 &&
             Object.values(subStageStatus).every(Boolean) &&
             activeStep !== 2 &&
             activeStep !== 3
           ) {
             setSubStageStatus(
               stages[0].subStages.reduce(
                 (status, subStage) => ({ ...status, [subStage]: false }),
                 {}
               )
             );
             setResetSubStages(true);
           } else {
             setResetSubStages(false);
           }
           setActiveStep(step);
         };

         const handleSubStageComplete = (subStage) => () => {
           setSubStageStatus({ ...subStageStatus, [subStage]: true });
         };
        
  return (
    // <Box>
    //   <Stepper activeStep={currentStageIndex} alternativeLabel>
    //     {stages.map(
    //       (label: iStage, index) =>
    //         label.parent === null && (
    //           <Step key={label._id}>
    //             <StepLabel>{label.name}</StepLabel>
    //           </Step>
    //         )
    //     )}
    //   </Stepper>
    // </Box>
    <div>
      <Stepper activeStep={activeStep} orientation="horizontal">
        {stages.map(({ label, subStages }, index) => (
          <Step key={label} onClick={handleStepClick(index)}>
            <StepLabel
              style={{
                cursor:
                  (index === 0 &&
                    (Object.values(subStageStatus).every(Boolean) ||
                      resetSubStages)) ||
                  index === activeStep
                    ? 'pointer'
                    : 'default',
                fontWeight: activeStep === index ? 'bold' : 'normal',
                color:
                  (index === 0 &&
                    (Object.values(subStageStatus).every(Boolean) ||
                      resetSubStages)) ||
                  index === activeStep
                    ? '#2196f3'
                    : 'inherit'
              }}
            >
              {label}
            </StepLabel>
            {activeStep === index && (
              <StepContent>
                <Stepper activeStep={0} orientation="horizontal">
                  {subStages.map((subStage, subIndex) => (
                    <Step key={subStage}>
                      <StepLabel
                        style={{
                          textDecoration: subStageStatus[subStage]
                            ? 'line-through'
                            : 'none',
                          cursor: subStageStatus[subStage]
                            ? 'default'
                            : 'pointer'
                        }}
                        onClick={
                          subStageStatus[subStage]
                            ? undefined
                            : handleSubStageComplete(subStage)
                        }
                      >
                        {subStage}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </StepContent>
            )}
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default StageCard;
