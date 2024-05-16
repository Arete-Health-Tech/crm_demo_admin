import { Modal } from '@mui/material';
import React from 'react'
import useTicketStore from '../../../../store/ticketStore';
import SmsWidget from './SmsWidget';

const ExpandedSmsModal = () => {
    const { smsModal } = useTicketStore();
    return (
        <>
            <Modal
                open={smsModal}
                // onClose={() => setWhtsappExpanded(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <SmsWidget />
            </Modal>
        </>
    )
}

export default ExpandedSmsModal
