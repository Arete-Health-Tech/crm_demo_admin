import { Box, MenuItem, Select, Stack } from '@mui/material';
import React, { useState } from 'react';
import { iNodeRepliesFlow } from '../../../types/store/node';
import InputField from './InputField';

type Props = {
  setInvalidCount: any;
  rowData: iNodeRepliesFlow;
  updateData: (data: iNodeRepliesFlow) => void;
};

const NodeRepliesTable = ({ rowData, updateData, setInvalidCount }: Props) => {
  const [data, setData] = useState(rowData);

  const maxLength = (value: string, min: number, max: number) => {
    if (!value) {
      value = '';
    }
    return value.length >= min && value.length <= max;
  };

  const onChangeTextField = (e: any) => {
    setData((prev) => {
      const key: string = e.target.name;
      const value: string = e.target.value;
      const updatedData = { ...prev, [key]: value };
      updateData(updatedData);
      return updatedData;
    });
  };
  return (
    <Stack my={1} width="100vw " direction="row" spacing={2}>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="diseaseId"
          onChange={onChangeTextField}
          value={data.diseaseId}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 1, 50)}
          errorMessage={'Disease Id Should be Between 1-50'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="nodeId"
          onChange={onChangeTextField}
          value={data.nodeId}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 1, 50)}
          errorMessage={'Node Id should be between 1-50'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="nodeName"
          onChange={onChangeTextField}
          value={data.nodeName}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 1, 50)}
          errorMessage={'Node Name should be between 1-50'}
        />
      </Box>
      <Box minWidth="15vw">
        <Select
          fullWidth
          size="small"
          name="headerType"
          onChange={onChangeTextField}
          value={data.headerType}
        >
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="Image">Image</MenuItem>
          <MenuItem value="Video">Video</MenuItem>
          <MenuItem value="Document">Document</MenuItem>
        </Select>
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="headerLink"
          onChange={onChangeTextField}
          value={data.headerLink}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 1, 2048)}
          errorMessage={'Header Link  should be "None" or between 1-2048npm'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="body"
          onChange={onChangeTextField}
          value={data.body}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 1, 1024)}
          errorMessage={'Body should be between 1-1024'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="footer"
          onChange={onChangeTextField}
          value={data.footer}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 100)}
          errorMessage={'Footer should be between 0-100'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="replyButton1"
          onChange={onChangeTextField}
          value={data.replyButton1}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 50)}
          errorMessage={'Reply Button 1 should be between 0-50'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="replyButtonId1"
          onChange={onChangeTextField}
          value={data.replyButtonId1}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 50)}
          errorMessage={'Reply Button Id 1 should be between 0-50'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="replyButton2"
          onChange={onChangeTextField}
          value={data.replyButton2}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 50)}
          errorMessage={'Reply Button 2 should be between 0-50'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="replyButtonId2"
          onChange={onChangeTextField}
          value={data.replyButtonId2}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 50)}
          errorMessage={'Reply Button Id 2 should be between 0-50'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="replyButton3"
          onChange={onChangeTextField}
          value={data.replyButton3}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 50)}
          errorMessage={'Reply Button 3 should be between 0-50'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="replyButtonId3"
          onChange={onChangeTextField}
          value={data.replyButtonId3}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 50)}
          errorMessage={'Reply Button Id 3 should be between 0-50'}
        />
      </Box>
    </Stack>
  );
};

export default NodeRepliesTable;
