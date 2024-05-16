import { ContactSupportOutlined } from '@mui/icons-material';
import { Box, Chip, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import useServiceStore from '../../../store/serviceStore';
import { iDepartment } from '../../../types/store/service';
import avatar1 from '../../../assets/avatar1.svg'
import styles from './Qurey.module.css';

type Props = {
  id: string;
  subject: string;
  departmentId: string;
  createdAt: {
    seconds: number;
  };
  onClick: any;
};

const QueryFetched = (props: Props) => {
  const { departments } = useServiceStore();

  const departmentSetter = (departmentId: string) => {
    return departments.find(
      (department: iDepartment) => department._id === departmentId
    )?.name;
  };

  return (
    <>
      <Stack
        spacing={0.5}
        direction="column"
        marginLeft={"1rem"}
        p={1}
        borderRadius={'0.5rem'}
        width={"100%"}
        bgcolor="#f1f5f7"
        onClick={props.onClick}
      >
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          {/* <ContactSupportOutlined /> */}
          <Box fontWeight={500}>{props.subject}</Box>
          <Box className={styles.Resolve}>Resolve</Box>
          {/* <Box className={styles.Open}>Open</Box> */}
        </Box>
        <Stack>
          {/* <ContactSupportOutlined /> */}
          <Typography className={styles.doc_dep}>DoctorName</Typography>
        </Stack>
        <Stack>
          {props.departmentId && (
            <Typography className={styles.doc_dep}>{departmentSetter(props.departmentId)}</Typography>
          )}
        </Stack>
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography className={styles.date}>
            {dayjs(props.createdAt.seconds * 1000).format(
              'DD MMM YYYY hh:mm A'
            )}
          </Typography>
          <Box
            className={styles.notesImage}
            height={'1.25rem'}
            width={'1.25rem'}
          >
            <img src={avatar1} alt="" />
          </Box>
        </Box>
      </Stack>
    </>
  );
};

export default QueryFetched;
