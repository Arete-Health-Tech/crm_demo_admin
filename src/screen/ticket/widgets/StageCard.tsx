import { Box, MenuItem, Select, Step, StepLabel, Stepper } from '@mui/material';
import { useEffect, useState } from 'react';
import useServiceStore from '../../../store/serviceStore';
import { iStage, iSubStage } from '../../../types/store/service';
import { iTicket } from '../../../types/store/ticket';
import { updateTicketData } from '../../../api/ticket/ticket';

type Props = {
  currentTicket: iTicket | undefined;
  setTicketUpdateFlag: any;
};

const StageCard = (props: Props) => {
  const { stages, subStages } = useServiceStore();
  const [validStageList, setValidStageList] = useState<iStage[] | []>([]);
  const [validSubStageList, setValidSubStageList] = useState<iSubStage[] | []>(
    []
  );
  const { currentTicket, setTicketUpdateFlag } = props;

  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<any>({});
  const [changeStageName, setChangeStageName] = useState<string>('');
  const [nextStage, setNextStage] = useState<string>('');
  // const getCurrentStage = () => {
  //   const index = stages.findIndex(
  //     (stage) => stage._id === currentTicket?.stage
  //   );
  //   console.log(index);
  //   setCurrentStageIndex(index);
  // };

  // useEffect(()=>{
  //   getCurrentStage();
  // },[])

  useEffect(() => {
    if (currentTicket && stages.length > 0 && subStages.length > 0) {
      const stageDetail: any = stages?.find(
        ({ _id }) => currentTicket.stage === _id
      );
      setValidStageList(stages?.slice(stageDetail?.code - 1));
      setValidSubStageList(
        stageDetail?.child?.map((id) => subStages[id - 1]) || []
      );
      const stageName = stageDetail?.name || '';
      setChangeStageName(stageName);
      setCurrentStage(stageDetail);
      setNextStage('');
      if (
        currentTicket?.subStageCode?.code === stageDetail?.child?.length &&
        stageDetail?.code <= 5
      ) {
        const nextStageIndex = stageDetail?.code;
        setNextStage(stages[nextStageIndex]?.name || '');
      }
    }
  }, [currentTicket, stages, subStages, changeStageName]);

  const handleStages = (e: any) => {
    console.log('selected', e.target.value);
    setChangeStageName(e.target.value);
    const payload = {
      stageCode: currentStage?.code + 1,
      subStageCode: {
        active: true,
        code: 1
      },
      ticket: currentTicket?._id
    };
    updateTicketData(payload);

    setTimeout(() => setTicketUpdateFlag(payload), 800);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box>
        <Select
          size="small"
          name="stages"
          onChange={handleStages}
          value={changeStageName || ''}
          sx={{ height: '35px' }}
        >
          {validStageList?.map(({ name, parent, code }: iStage, index) => {
            return (
              parent === null && (
                <MenuItem
                  value={name}
                  disabled={![changeStageName, nextStage].includes(name)}
                >
                  {name}
                </MenuItem>
              )
            );
          })}
        </Select>
      </Box>
      <Stepper
        activeStep={currentTicket?.subStageCode?.code || 0}
        alternativeLabel
        sx={{ height: '50px', marginTop: '10px' }}
      >
        {validSubStageList?.map((label: iSubStage, index) => (
          <Step key={label._id}>
            <StepLabel>{label.name}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
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