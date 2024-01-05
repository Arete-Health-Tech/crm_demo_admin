import { Add, ArrowRight, Cancel, Upload } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNodeListHandler } from '../../api/flow/flowHandler';
import { iNodeLists } from '../../types/store/node';
import { CSVFileParser } from '../../utils/csvFileParser';
import NodeListTable from './widgets/NodeListTable';

type Props = {};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: '1rem',
  borderWidth: 0,
  p: 4
};

const NodeList = (props: Props) => {
  const [invalidCount, setInvalidCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState({
    type: 'success',
    message: ''
  });
  const [filename, setFileName] = useState<File | undefined | null>();
  const [fileData, setFileData] = useState<iNodeLists[]>([]);
  const [isGoToNodeConnector, setIsGoToNodeConnector] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const handleopenModal = () => {
    setIsModalOpen(true);
  };

  const handleFileUpload = async () => {
    if (!filename) {
      setMessage('Please Select a File to upload');
    } else {
      setMessage('Please Wait Parsing CSV file');
      const data = await CSVFileParser(filename);
      setFileData(data);
      setIsModalOpen(false);
    }
  };

  const handleUploadFlowToServer = async () => {
    const shouldGoToConnector = await createNodeListHandler(fileData);
    setErrorMessage({
      ...errorMessage,
      message: 'Node List Added To Server Successfully '
    });
    setIsGoToNodeConnector(shouldGoToConnector);
  };

  return (
    <Box minHeight="90vh">
      <Box my={2} display="flex" justifyContent="space-between">
        <Typography variant="h5" fontWeight={500}>
          Node Lists
        </Typography>
        <Stack direction="row" spacing={3}>
          {fileData.length === 0
            ? !isGoToNodeConnector && (
                <Button onClick={handleopenModal} variant="contained">
                  Bulk Upload
                </Button>
              )
            : !isGoToNodeConnector && (
                <Button
                  onClick={handleUploadFlowToServer}
                  variant="contained"
                  disabled={invalidCount > 0}
                >
                  Upload To Server
                </Button>
              )}

          {isGoToNodeConnector && (
            <Button
              onClick={() => navigate('/flow/connector')}
              endIcon={<ArrowRight />}
            >
              Go To Node Connector
            </Button>
          )}
        </Stack>
      </Box>
      {errorMessage.message.length > 0 && (
        <Alert
          severity={errorMessage.type === 'error' ? 'error' : 'info'}
          sx={{ my: 1, width: '50%' }}
        >
          {errorMessage.message}
        </Alert>
      )}

      <Box
        sx={{
          overflowX: 'scroll',
          '&::-webkit-scrollbar ': {
            display: 'none'
          }
        }}
        bgcolor="white"
        borderRadius={2}
        p={2}
      >
        <Stack width="100vw " direction="row" spacing={2}>
          <Box minWidth="15vw">
            <Typography>Disease</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>Node ID</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>Node Name</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>Header Type</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>Header Link</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>Body</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>Footer</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>Menu Title</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>Section Title</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Title 1</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Description 1</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Id 1</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Title 2</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Description 2</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Id 2</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Title 3 </Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Description 3</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Id 3</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Title 4</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Description 4</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Id 4</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Title 5</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Description 5</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Id 5</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Title 6</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Description 6</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Id 6</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Title 7</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Description 7</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Id 7</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Title 8</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Description 8</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Id 8</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Title 9</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Description 9</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Id 9</Typography>
          </Box>
           <Box minWidth="15vw">
            <Typography>List Title 10</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Description 10</Typography>
          </Box>
          <Box minWidth="15vw">
            <Typography>List Id 10</Typography>
          </Box>
        </Stack>
        {fileData.map((item: iNodeLists, index) => (
          <NodeListTable
            setInvalidCount={setInvalidCount}
            rowData={item}
            updateData={(data) => {
              fileData[index] = data;
            }}
          />
        ))}
        <Button
          onClick={() => {
            setFileData([
              ...fileData,
              {
                disease: '',
                nodeId: '',
                nodeName: '',
                headerType: '',
                headerLink: '',
                body: '',
                footer: '',
                menuTitle: '',
                sectionTitle: '',
                listTitle0: '',
                listDesc0: '',
                listId0: '',
                listTitle1: '',
                listDesc1: '',
                listId1: '',
                listTitle2: '',
                listDesc2: '',
                listId2: '',
                listTitle3: '',
                listDesc3: '',
                listId3: '',
                listTitle4: '',
                listDesc4: '',
                listId4: '',
                listTitle5: '',
                listDesc5: '',
                listId5: '',
                listTitle6: '',
                listDesc6: '',
                listId6: '',
                listTitle7: '',
                listDesc7: '',
                listId7: '',
                listTitle8: '',
                listDesc8: '',
                listId8: '',
                listTitle9: '',
                listDesc9: '',
                listId9: ''
              }
            ]);
          }}
          endIcon={<Add />}
        >
          Add Row
        </Button>
      </Box>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Stack sx={style} spacing={5} direction="column">
          <Box
            sx={{
              border: 'dashed 1px black',
              borderRadius: '1rem',
              position: 'relative',

              background: '#f0f0f0',
              '&:hover': {
                backgroundColor: '#EFFAF5'
              }
            }}
          >
            <Box position="absolute" width="100%" height="100%" p={3}>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Upload />
                <Typography>Bulk Upload Whatsapp Flow </Typography>
              </Box>

              <Typography fontSize="10px" textAlign="center">
                only .csv file is supported
              </Typography>
            </Box>

            <input
              type="file"
              accept=".csv"
              onChange={(e) =>
                setFileName((prev) => {
                  prev = (e.target as HTMLInputElement).files![0];
                  return prev;
                })
              }
              style={{
                width: '100%',
                height: '150px',
                cursor: 'pointer',
                opacity: '0'
              }}
            />

            <Box
              p={1}
              display={`${
                filename === null || filename === undefined ? 'none' : 'flex'
              }`}
              justifyContent="space-between"
              alignItems="center"
              sx={{
                background: '#f5f5f5',
                borderRadius: '15px'
              }}
              margin={2}
            >
              <Typography fontSize={14}>{filename?.name!}</Typography>
              <IconButton
                color="inherit"
                aria-label="delete file"
                component="label"
                onClick={() => {
                  setFileName(null);
                }}
              >
                <Cancel fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          {message.length > 0 && (
            <Alert severity="success" color="info">
              {message}
            </Alert>
          )}

          <Button
            variant="contained"
            color="success"
            onClick={handleFileUpload}
          >
            <Upload />
            Upload
          </Button>
        </Stack>
      </Modal>
    </Box>
  );
};

export default NodeList;
