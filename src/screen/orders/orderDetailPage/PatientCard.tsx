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
import { Stack, colors } from '@mui/material';
import useTicketStore from '../../../store/ticketStore';
import { iTicket } from '../../../types/store/ticket';


const PatientCard = (props) => {


    const {
        tickets,
        filterTickets,
        setPageNumber,
    } = useTicketStore();

    const [patientTicket, setPatientTicket] = React.useState<iTicket[]>();
    const theme = useTheme();
    const { ticketId } = props;


    React.useEffect(() => {
        console.log(tickets, "tickets in patient card---");
        const filteredTickets = tickets.filter(item => item._id === ticketId);
        setPatientTicket(filteredTickets);
        console.log(filteredTickets, "filter tickets in patient card---");
    }, []);

    console.log("ticked id in patiend card", ticketId);
    console.log("ticket data of patient", patientTicket);


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
                            <span style={{ color: "grey", fontSize: '19px' }}>Patient Name:</span>  <span style={{ color: "black", fontSize: '19px', fontWeight: "bold" }}>Nithya JayKumar</span>
                        </Typography>

                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            <span style={{ color: "grey", fontSize: '15px' }}>Order Id:</span>  <span style={{ color: "black", fontSize: '15px' }}>957832</span>
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            <span style={{ color: "grey", fontSize: '15px' }}>Gender:</span> <span style={{ color: "black", fontSize: '15px' }}> Male</span>
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            <span style={{ color: "grey", fontSize: '15px' }}>Age:</span> <span style={{ color: "black", fontSize: '15px' }}> 24</span>
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            <span style={{ color: "grey", fontSize: '15px' }}>Mobile Number:</span>  <span style={{ color: "black", fontSize: '15px' }}>786422232</span>
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            <span style={{ color: "grey", fontSize: '15px' }}>Email:</span>  <span style={{ color: "black", fontSize: '15px' }}>Nithya234@gmail.com</span>
                        </Typography>


                    </CardContent>
                </Box>

            </Card>
        </Box>


    );
}

export default PatientCard;