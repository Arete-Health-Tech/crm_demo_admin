import {
  Box,

  Step,
 
 
  StepLabel,
  Stepper
} from '@mui/material';
import {  useState } from 'react';

// import { makeStyles } from '@material-ui/core/styles';

type Props = {
  stage: string | undefined;
};


const stages = [
  {
    label: 'New Lead',
    subStages: ['Engagement Sent ', "Create Estimate",'Call ', 'Call Summary ', 'Call Notes']
  },
  {
    label: 'Nurturing',
    subStages: ['Engagement Sent ', 'Call ', 'Call Summary ', 'Call Notes']
  },
  {
    label: 'Follow-up ',
    subStages: ['Engagement Sent ', 'Call ', 'Call Summary ', 'Call Notes']
  },
  {
    label: 'Final Call  ',
    subStages: ['Engagement Sent ', 'Call ', 'Call Summary ', 'Call Notes']
  }
];




const StageCard = (props: Props) => {
 
  
         const [activeStep, setActiveStep] = useState(0);
         const [subStageStatus, setSubStageStatus] = useState(
           stages.reduce(
             (status, { subStages }) => ({ ...status, [subStages[0]]: false }),
             {}
           )  
         );
         const [resetSubStages, setResetSubStages] = useState(false);

       const handleStepClick = (step) => () => {
         if (step === 1) {
           // for the "Nurturing" stage
           if (
             !subStageStatus[stages[0].subStages[2]] || // check if the "Call" sub-stage is completed
             !subStageStatus[stages[0].subStages[3]] || // check if the "Call Summary" sub-stage is completed
             !subStageStatus[stages[0].subStages[4]] // check if the "Call Notes" sub-stage is completed
           ) {
             return; // if any of the above sub-stages is not completed, prevent clicking on the "Nurturing" stage
           }
         } else if (step === 2 || step === 3) {
           // for the "Follow-up" and "Final Call" stages
           const prevStage = stages[step - 1];
           const lastSubStage =
             prevStage.subStages[prevStage.subStages.length - 1];
           if (!subStageStatus[lastSubStage]) {
             // check if the last sub-stage of the previous stage is completed
             return; // if not, prevent clicking on the "Follow-up" or "Final Call" stage
           }
         }

         setActiveStep(step);
       };



        
       const handleSubStageComplete = (subStage) => () => {
         const currentStage = stages[activeStep];
         const subStageIndex = currentStage.subStages.indexOf(subStage);
         const isLastSubStage =
           subStageIndex === currentStage.subStages.length - 1;

         if (isLastSubStage) {
           const nextStageIndex = activeStep + 1;
           if (nextStageIndex < stages.length) {
             setActiveStep(nextStageIndex);
             setSubStageStatus(
               stages[nextStageIndex].subStages.reduce(
                 (status, subStage) => ({ ...status, [subStage]: false }),
                 {}
               )
             );
           }
         } else {
           setSubStageStatus({ ...subStageStatus, [subStage]: true });
         }

         // Remove the completed substage from the subStageStatus object
         setSubStageStatus((prevStatus) => ({
           ...prevStatus,
           [subStage]: true
         }));
       };



        
  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Stepper activeStep={activeStep} orientation="horizontal">
          {stages.map(({ label, subStages }, index) => (
            <Step
              key={label}
              onClick={handleStepClick(index)}
              style={{
                width: '25%',
                position: 'static'
              }}
            >
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
                      : 'inherit',
                  position: 'static'
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Box display="flex" alignItems="center">
        {stages.map(({ subStages }, index) => (
          <Box
            key={`sub-stages-${index}`}
            style={{
              width: '50%',
              position: 'static',
              display: activeStep === index ? 'block' : 'none'
            }}
          >
            <Stepper activeStep={0} orientation="horizontal">
              {subStages.map((subStage, subIndex) => (
                <Step key={subStage}>
                  <StepLabel
                    style={{
                      textDecoration: subStageStatus[subStage]
                        ? 'line-through'
                        : 'none',
                      color: subStageStatus[subStage] ? 'red' : 'black',
                      cursor: subStageStatus[subStage] ? 'default' : 'pointer'
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
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default StageCard;
