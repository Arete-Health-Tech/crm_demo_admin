import { Close, FormatListBulletedOutlined } from '@mui/icons-material';
import { Box, Divider, Radio, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { iNodeListsMesaage } from '../../../../types/store/node';

type Props = {
  message: any;
};

const NodeListMessage = ({ message }: Props) => {
  const [isListOpen, setIsListOpen] = useState(false);

  const handleList = () => {
    setIsListOpen((prev) => !prev);
  };
  return (
    <>
      <Box
        my={1}
        maxWidth="70%"
        p={1}
        bgcolor="#d8fdd3"
        borderRadius="7.5px 7.5px 0px 7.5px"
      >
        <Typography variant="caption" color="green" fontSize="small">
          System Generated Message
        </Typography>
        <Stack>
          {message.body}
          {message.footer && (
            <Typography variant="caption" color="GrayText">
              {message.footer}
            </Typography>
          )}
          <Box display="flex" justifyContent="flex-end">
            <Typography variant="caption" fontSize="0.7rem" color="GrayText">
              {dayjs(message.createdAt).format('DD MMM YYYY hh:mm A')}
            </Typography>
          </Box>
        </Stack>
        <Stack
          spacing={0.8}
          borderTop={0.5}
          py={1}
          justifyContent="center"
          direction="row"
          borderColor="lightgray"
          color="primary.main"
          onClick={handleList}
        >
          <FormatListBulletedOutlined />
          <Typography>{message.menuTitle}</Typography>
        </Stack>
      </Box>

      {isListOpen && (
        <Box
        
          zIndex={9}
          width="100%"
          right={0}
          left={0}
          bgcolor="#f5f5f5"
          position="absolute"
          bottom={0}
          height="50vh"
          border="1px solid lightgray"
          borderRadius="7.5px 7.5px 0px 0px"
          sx={{
            backdropFilter: 'blur(8px)',
            overflowY: 'scroll',
            '&::-webkit-scrollbar ': {
              display: 'none'
            },
            transition: 'linear',
            transitionDuration: '1000ms',
            transitionDelay: '300ms'
          }}
        >
          <Stack
            position="sticky"
            top={0}
            direction="row"
            bgcolor="GrayText"
            p={1}
            width="100%"
            spacing={2}
            borderRadius="7.5px 7.5px 0px 0px"
          >
            <Close onClick={handleList} fontSize="small" />
            <Typography
              textAlign="center"
              color="white"
              variant="subtitle1"
              fontWeight={500}
            >
              {message.menuTitle}
            </Typography>
          </Stack>

          <Stack direction="column">
            {message.listTitle0 && (
              <Box p={1}>
                <Typography variant="subtitle1">
                  {message.listTitle0}
                </Typography>
                <Typography variant="caption">{message.listDesc0}</Typography>
                <Divider />
              </Box>
            )}
            {message.listTitle1 && (
              <Box p={1}>
                <Typography variant="subtitle1">
                  {message.listTitle1}
                </Typography>
                <Typography variant="caption">{message.listDesc1}</Typography>
                <Divider />
              </Box>
            )}{' '}
            {message.listTitle2 && (
              <Box p={1}>
                <Typography variant="subtitle1">
                  {message.listTitle2}
                </Typography>
                <Typography variant="caption">{message.listDesc2}</Typography>
                <Divider />
              </Box>
            )}{' '}
            {message.listTitle3 && (
              <Box p={1}>
                <Typography variant="subtitle1">
                  {message.listTitle3}
                </Typography>
                <Typography variant="caption">{message.listDesc3}</Typography>
                <Divider />
              </Box>
            )}{' '}
            {message.listTitle4 && (
              <Box p={1}>
                <Typography variant="subtitle1">
                  {message.listTitle4}
                </Typography>
                <Typography variant="caption">{message.listDesc4}</Typography>
                <Divider />
              </Box>
            )}{' '}
            {message.listTitle5 && (
              <Box p={1}>
                <Typography variant="subtitle1">
                  {message.listTitle5}
                </Typography>
                <Typography variant="caption">{message.listDesc5}</Typography>
                <Divider />
              </Box>
            )}{' '}
            {message.listTitle6 && (
              <Box p={1}>
                <Typography variant="subtitle1">
                  {message.listTitle6}
                </Typography>
                <Typography variant="caption">{message.listDesc6}</Typography>
                <Divider />
              </Box>
            )}{' '}
            {message.listTitle7 && (
              <Box p={1}>
                <Typography variant="subtitle1">
                  {message.listTitle7}
                </Typography>
                <Typography variant="caption">{message.listDesc7}</Typography>
                <Divider />
              </Box>
            )}{' '}
            {message.listTitle8 && (
              <Box p={1}>
                <Typography variant="subtitle1">
                  {message.listTitle8}
                </Typography>
                <Typography variant="caption">{message.listDesc8}</Typography>
                <Divider />
              </Box>
            )}{' '}
            {message.listTitle9 && (
              <Box p={1}>
                <Typography variant="subtitle1">
                  {message.listTitle9}
                </Typography>
                <Typography variant="caption">{message.listDesc9}</Typography>
              </Box>
            )}
          </Stack>
        </Box>
      )}
    </>
  );
};

export default NodeListMessage;
