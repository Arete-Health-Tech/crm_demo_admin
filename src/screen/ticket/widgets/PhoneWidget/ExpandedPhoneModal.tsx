import { Modal } from '@mui/material';
import React from 'react'
import useTicketStore from '../../../../store/ticketStore';
import PhoneWidget from './PhoneWidget';

const ExpandedPhoneModal = () => {
    const { phoneModal } = useTicketStore();
    return (
        <>
            <Modal
                open={phoneModal}
                // onClose={() => setWhtsappExpanded(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <PhoneWidget />
            </Modal>
        </>
    )
}

export default ExpandedPhoneModal
