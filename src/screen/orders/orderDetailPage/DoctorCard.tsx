import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { colors } from '@mui/material';


const DoctorCard = () => {
    const theme = useTheme();

    return (

        <Box
            sx={{
                width: 750,
            }}
        >
            <Card sx={{ display: 'flex', flexDirection: 'row', padding: '12px 17px', borderRadius: '15px' }}>

                <Box sx={{ display: 'flex', flexDirection: 'coloumn' }}>

                    <CardContent sx={{ flex: '1 0 auto', wordSpacing: '2px' }}>

                        <Typography component="div" variant="h6">
                            <span style={{ color: "grey", fontSize: '19px' }}>Doctor Name:</span> <span style={{ color: "black", fontSize: '19px', fontWeight: 'bold' }}>Dr Emily Smith, MD</span>
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            <span style={{ color: "grey", fontSize: '15px' }}>License Number:</span> <span style={{ color: "black", fontSize: '15px' }}>1234567890 Experies: 12/31/2025</span>
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            <span style={{ color: "grey", fontSize: '15px' }}>DEA Registration Number:</span> <span style={{ color: "black", fontSize: '15px' }}>AS12345678</span>
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            <span style={{ color: "grey", fontSize: '15px' }}>NPI:</span> <span style={{ color: "black", fontSize: '15px' }}>973238232</span>
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            <span style={{ color: "grey", fontSize: '15px' }}>Mobile Number:</span><span style={{ color: "black", fontSize: '15px' }}> 786422232</span>
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            <span style={{ color: "grey", fontSize: '15px' }}>Email:</span> <span style={{ color: "black", fontSize: '15px' }}> Nithya234@gmail.com</span>
                        </Typography>
                    </CardContent>
                </Box>

            </Card>
        </Box>


    );
}

export default DoctorCard;