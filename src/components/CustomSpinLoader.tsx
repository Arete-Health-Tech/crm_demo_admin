import { Box, CircularProgress } from '@mui/material';

export interface propsTypes {
  open: boolean;
}

 const CustomSpinLoader = (props: propsTypes) => {
  const { open } = props;
  return (
    <>
      {open && (
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            bgcolor: 'rgba(227, 227, 227, 0.45)',
            height: '100%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Box>
            <CircularProgress
              size={100}
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: '46%',
                left: '47%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default CustomSpinLoader;
