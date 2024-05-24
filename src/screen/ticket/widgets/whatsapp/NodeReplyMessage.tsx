import { DownloadOutlined, PictureAsPdfOutlined } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';
import whtsappIcon from '../../../../assets/whtsappIcon.svg';
import whtsappMessageIcon from '../../../../assets/avatar1.svg';
import { Avatar } from '@mui/material';
import useUserStore from '../../../../store/userStore';
type Props = {
  message: any;
};

const NodeReplyMessage = ({ message }: Props) => {
  const { user, setUser } = useUserStore();
  return (
    <>
      <Box display="flex" maxWidth="70%">
        <Box
          my={1}
          marginRight={2}
          p={1}
          bgcolor="#FFF"
          border="1px solid #D4DBE5"
          borderRadius="0.5rem"
        >
          <Typography variant="caption" color="green" fontSize="small">
            System Generated Message
          </Typography>
          <Stack>
            {message.headerType !== 'None' &&
              (message.headerType === 'Image' ? (
                <Box>
                  <img
                    style={{ borderRadius: '3.25px' }}
                    src={message.headerLink}
                    alt={message.diseaseId}
                  />
                </Box>
              ) : message.headerType === 'Video' ? (
                <Box>
                  <video
                    poster="http://87.234.222.77/images/video-fallback.jpg"
                    style={{ borderRadius: '3.25px' }}
                    src={message.headerLink}
                    controls
                    controlsList="nofullscreen nodownload noremoteplayback noplaybackrate foobar"
                  />
                </Box>
              ) : message.headerType === 'Document' ? (
                <Box>
                  <Stack direction="row" justifyContent="space-between">
                    <Box>
                      <PictureAsPdfOutlined />
                      <Typography variant="caption" color="GrayText">
                        PDF Name
                      </Typography>
                    </Box>
                    <IconButton>
                      <DownloadOutlined />
                    </IconButton>
                  </Stack>
                </Box>
              ) : null)}
            <Typography
              my={0.5}
              color="var(--Text-Light-Grey, #080F1A)"
              fontFamily={'Outfit,sans-serif'}
              fontSize={'0.875rem'}
              fontWeight={400}
              paddingTop={1}
            >
              {message.body}
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Typography
                variant="caption"
                color="var(--Text-Light-Grey, #647491)"
                fontFamily={'Outfit,sans-serif'}
                fontSize={'0.625rem'}
                fontWeight={400}
                paddingTop={1}
              >
                {dayjs(message.createdAt).format('DD MMM YYYY hh:mm A')}
              </Typography>
              <Avatar sx={{ fontSize: '8px', bgcolor: 'orange' ,
                              height: '1rem',
                              width: '1rem',
                              margin: '0.3rem',
                              marginTop:'8px'
                            }}>
                                {user?.firstName[0]?.toUpperCase()}
                                {user?.lastName[0]?.toUpperCase()}
               </Avatar>
            </Box>
          </Stack>
        </Box>
        <img
          src={whtsappIcon}
          alt=""
          style={{
            height: '4.5vh',
            marginTop: '0.5rem',
            marginRight: '0.5rem'
          }}
        />
      </Box>
      <Box display="flex" maxWidth="70%">
        <Stack
          mt={1}
          marginRight={2}
          display="flex"
          alignItems="end"
          direction="column"
          spacing={1}
          bgcolor="#FFF"
          border="1px solid #D4DBE5"
          borderRadius="0.5rem"
        >
          {message.replyButton1 && (
            <Box
              color="primary.main"
              p={1}
              bgcolor="#FFF"
              borderRadius="0.5rem"
            >
              {message.replyButton1}
            </Box>
          )}
          {message.replyButton2 && (
            <Box
              color="primary.main"
              p={1}
              bgcolor="#d8fdd3"
              borderRadius="7.5px"
            >
              {message.replyButton2}
            </Box>
          )}
          {message.replyButton3 && (
            <Box
              color="primary.main"
              p={1}
              bgcolor="#d8fdd3"
              borderRadius="7.5px"
            >
              {message.replyButton3}
            </Box>
          )}
        </Stack>
        <img
          src={whtsappIcon}
          alt=""
          style={{
            height: '4.5vh',
            marginTop: '0.5rem',
            marginRight: '0.5rem'
          }}
        />
      </Box>
    </>
  );
};

export default NodeReplyMessage;
