import { Modal } from '@mui/material'
import React from 'react'
import useTicketStore from '../../../../store/ticketStore';
import MessagingWidget from './WhatsappWidget';
import { useParams } from 'react-router-dom';

const ExpandedModal = () => {
    const { setWhtsappExpanded, whtsappExpanded } = useTicketStore();
    const {ticketID}=useParams();

    return (
        <>
            <Modal
                open={whtsappExpanded}
                // onClose={() => setWhtsappExpanded(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <MessagingWidget ticketId={ticketID}/>
            </Modal>
        </>
    )
}

export default ExpandedModal
