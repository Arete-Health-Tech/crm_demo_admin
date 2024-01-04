import { Box, MenuItem, Select, Stack } from '@mui/material';
import React, { useState } from 'react';
import { iNodeLists } from '../../../types/store/node';
import InputField from './InputField';

type Props = {
  setInvalidCount: any;
  rowData: iNodeLists;
  updateData: (data: iNodeLists) => void;
};

const NodeListTable = ({ rowData, updateData, setInvalidCount }: Props) => {
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
          name="disease"
          onChange={onChangeTextField}
          value={data.disease}
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
          validator={(value) => maxLength(value, 1, 100)}
          errorMessage={'Node Id should be between 1-100'}
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
          errorMessage={'Header Link  should be "None" or between 1-50'}
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
          validator={(value) => maxLength(value, 0, 60)}
          errorMessage={'Footer should be between 0-60'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="menuTitle"
          onChange={onChangeTextField}
          value={data.menuTitle}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 1, 20)}
          errorMessage={'Menu title should be between 1-20'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="sectionTitle"
          onChange={onChangeTextField}
          value={data.sectionTitle}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 1, 20)}
          errorMessage={'Footer should be between 1-20'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listTitle0"
          onChange={onChangeTextField}
          value={data.listTitle0}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 24)}
          errorMessage={'List Title should be between 0-24'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listDesc0"
          onChange={onChangeTextField}
          value={data.listDesc0}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 72)}
          errorMessage={'List Item should be between 0-72'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listId0"
          onChange={onChangeTextField}
          value={data.listId0}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 200)}
          errorMessage={'List Id should be between 0-200'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listTitle1"
          onChange={onChangeTextField}
          value={data.listTitle1}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 24)}
          errorMessage={'List Title should be between 0-24'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listDesc1"
          onChange={onChangeTextField}
          value={data.listDesc1}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 72)}
          errorMessage={'List Item should be between 0-72'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listId1"
          onChange={onChangeTextField}
          value={data.listId1}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 200)}
          errorMessage={'List Id should be between 0-200'}
        />
      </Box>{' '}
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listTitle2"
          onChange={onChangeTextField}
          value={data.listTitle2}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 24)}
          errorMessage={'List Title should be between 0-24'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listDesc2"
          onChange={onChangeTextField}
          value={data.listDesc2}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 72)}
          errorMessage={'List Item should be between 0-72'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listId2"
          onChange={onChangeTextField}
          value={data.listId2}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 200)}
          errorMessage={'List Id should be between 0-200'}
        />
      </Box>{' '}
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listTitle3"
          onChange={onChangeTextField}
          value={data.listTitle3}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 24)}
          errorMessage={'List Title should be between 0-24'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listDesc3"
          onChange={onChangeTextField}
          value={data.listDesc3}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 72)}
          errorMessage={'List Item should be between 0-72'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listId3"
          onChange={onChangeTextField}
          value={data.listId3}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 200)}
          errorMessage={'List Id should be between 0-200'}
        />
      </Box>{' '}
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listTitle4"
          onChange={onChangeTextField}
          value={data.listTitle4}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 24)}
          errorMessage={'List Title should be between 0-24'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listDesc4"
          onChange={onChangeTextField}
          value={data.listDesc4}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 72)}
          errorMessage={'List Item should be between 0-72'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listId4"
          onChange={onChangeTextField}
          value={data.listId4}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 200)}
          errorMessage={'List Id should be between 0-200'}
        />
      </Box>{' '}
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listTitle5"
          onChange={onChangeTextField}
          value={data.listTitle5}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 24)}
          errorMessage={'List Title should be between 0-24'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listDesc5"
          onChange={onChangeTextField}
          value={data.listDesc5}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 72)}
          errorMessage={'List Item should be between 0-72'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listId5"
          onChange={onChangeTextField}
          value={data.listId5}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 200)}
          errorMessage={'List Id should be between 0-200'}
        />
      </Box>{' '}
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listTitle6"
          onChange={onChangeTextField}
          value={data.listTitle6}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 24)}
          errorMessage={'List Title should be between 0-24'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listDesc6"
          onChange={onChangeTextField}
          value={data.listDesc6}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 72)}
          errorMessage={'List Item should be between 0-72'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listId6"
          onChange={onChangeTextField}
          value={data.listId6}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 200)}
          errorMessage={'List Id should be between 0-200'}
        />
      </Box>{' '}
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listTitle7 "
          onChange={onChangeTextField}
          value={data.listTitle7}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 24)}
          errorMessage={'List Title should be between 0-24'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listDesc7"
          onChange={onChangeTextField}
          value={data.listDesc7}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 72)}
          errorMessage={'List Item should be between 0-72'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listId7"
          onChange={onChangeTextField}
          value={data.listId7}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 200)}
          errorMessage={'List Id should be between 0-200'}
        />
      </Box>{' '}
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listTitle8"
          onChange={onChangeTextField}
          value={data.listTitle8}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 24)}
          errorMessage={'List Title should be between 0-24'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listDesc8"
          onChange={onChangeTextField}
          value={data.listDesc8}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 72)}
          errorMessage={'List Item should be between 0-72'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listId8"
          onChange={onChangeTextField}
          value={data.listId8}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 200)}
          errorMessage={'List Id should be between 0-200'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listTitle9"
          onChange={onChangeTextField}
          value={data.listTitle9}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 24)}
          errorMessage={'List Title should be between 0-24'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listDesc9"
          onChange={onChangeTextField}
          value={data.listDesc9}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 72)}
          errorMessage={'List Item should be between 0-72'}
        />
      </Box>
      <Box minWidth="15vw">
        <InputField
          setInvalidCount={setInvalidCount}
          name="listId9"
          onChange={onChangeTextField}
          value={data.listId9}
          placeholder="AAP121"
          size="small"
          validator={(value) => maxLength(value, 0, 200)}
          errorMessage={'List Id should be between 0-200'}
        />
      </Box>
    </Stack>
  );
};

export default NodeListTable;
