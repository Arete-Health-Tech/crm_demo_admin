import { Box, Paper, Step, StepConnector, StepContent, StepLabel, Stepper } from '@mui/material';
import { useEffect, useState } from 'react';
import useServiceStore from '../../../store/serviceStore';
import { iStage } from '../../../types/store/service';
type Props = {
  stage: string | undefined;
};

const StageCard = (props: Props) => {
  const { stages } = useServiceStore();
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [selectedData, setSelectedData] = useState("");

  const getCurrentStage = () => {
    const index = stages.findIndex((stage) => stage._id === props.stage);
    console.log(index);
    setCurrentStageIndex(index);
  };
  useEffect(() => {
    getCurrentStage();
  }, [props.stage]);
  console.log(stages)
  const HandleClick = (e: any) => {
    setSelectedData(e)
  }
  
  return (
    <Box>
      <Stepper activeStep={currentStageIndex} alternativeLabel>
        {stages.map(
          (label: iStage, index) =>
            label.parent === null && (
              <Step key={label._id}>
                <StepLabel onClick={() => HandleClick(label._id)}>{label.name}</StepLabel>
                {selectedData === label._id ? label.children.map((item, index) => {
                  const childId = `${label._id}-${item._id}`;
                  console.log(item.name)
                  return (
                    <>
                      <Box>
                        <Stepper alternativeLabel>

                          <Step key={childId}>
                            <StepLabel key={index}>
                              {item.name}
                            </StepLabel>
                          </Step >
                        </Stepper>
                      </Box>
                    </>

                  )
                })
                  : ""}
              </Step>

            )


        )}
      </Stepper>

    </Box >
  );
};

export default StageCard;
// const StageCard = (props: Props) => {
//   const { stages } = useServiceStore();
//   const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);

//   const getCurrentStage = () => {
//     const index = stages.findIndex((stage) => stage._id === props.stage);
//     setCurrentStageIndex(index);
//   };

//    const stagesLevel= stages.map((label ) =>{
//     return (label)
//    } )
// console.log(stagesLevel);

//   useEffect(() => {
//     getCurrentStage();
//   }, [props.stage]);

//   const parentStageId = '6447bb8c554bff9e9eacc3a3'; // The ID of the parent stage
// const parentStage = stages.find((stage) => stage._id === parentStageId);

// console.log(parentStage,"substages");
// console.log(stages.filter((stage) => stage.parent === parentStageId));


//   return (
//     <Box>
//       <Stepper activeStep={currentStageIndex} alternativeLabel>
//         {stages.map(
//           (label: iStage, index) =>
//             label.parent === null && (
//               <Step key={label._id}>      
//                 <StepLabel>{label.name}</StepLabel>
               
//               </Step>
              
//             )
//         )}
//       </Stepper>
    
      
      
    



// <Stepper activeStep={currentStageIndex} alternativeLabel>
//   {stages.map((label: iStage, index) => {
//     if (label.parent === null) {
//       const subStages = stages.filter((childLabel: iStage) => childLabel.parent?.toString() === label._id);
//       return (
//         <Step key={label._id}>
//           <StepLabel>{label.name}</StepLabel>
//           <StepContent>
//             <div style={{ display: 'flex'}}>
//               {subStages.map((subStage: iStage) => (
//                 <Step key={subStage._id}  >
//                   <StepLabel className="substage-label" style={{ flexDirection:"row",}} >{subStage.name}</StepLabel>
//                 </Step>
//               ))}
//             </div>
//           </StepContent>
//         </Step>
//       );
//     }
//   })}
// </Stepper>



//     </Box>

//   );

// };

// export default StageCard;