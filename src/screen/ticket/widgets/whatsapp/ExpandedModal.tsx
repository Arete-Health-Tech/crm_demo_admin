import { Modal } from '@mui/material'
import React from 'react'
import useTicketStore from '../../../../store/ticketStore';
import MessagingWidget from './WhatsappWidget';

const ExpandedModal = () => {
    const { setWhtsappExpanded, whtsappExpanded } = useTicketStore();

    return (
        <>
            <Modal
                open={whtsappExpanded}
                // onClose={() => setWhtsappExpanded(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <MessagingWidget />
            </Modal>
        </>
    )
}

export default ExpandedModal
