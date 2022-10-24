import { Button, Snackbar, Stack, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal"
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { doc } from 'firebase/firestore';
import { setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/clientApp';
import getUnixTime from "date-fns/getUnixTime"
import { IBooking } from "./BookingsTable";
import {updateDoc} from "@firebase/firestore";

interface IProps{
    open: boolean;
    onClose: () => void;
    selectedBooking?: IBooking;
    documentId?: string;

}


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const CreateEditModal = ({ open, onClose, selectedBooking, documentId }: IProps) => {
    console.log('Selected prop ', selectedBooking);
    const [booking, setBooking]  = useState<IBooking>({
        seeker:  selectedBooking ? selectedBooking.seeker : '',
        giver: selectedBooking ? selectedBooking.giver : '',
        date:  selectedBooking ? selectedBooking.date : new Date(),
        amount:  selectedBooking ? selectedBooking.amount : 0,
    });
    console.log("The booking ", booking)
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);

    const formatDate = (date: Date) => {
        return date.toISOString().substring(0,10)
    }

    const updateBooking = async () => { 

        const bookingRef = doc(firestore,`bookings/${documentId}`);
        const updatedData = {
            seeker: booking.seeker,
            giver: booking.giver,
            date: getUnixTime(booking.date),
            amount: booking.amount,
        };

        console.log('Updated data', updatedData);
        await updateDoc(bookingRef, {
            seeker: booking.seeker,
            giver: booking.giver,
            date: getUnixTime(booking.date),
            amount: booking.amount, 
        });
        clear();
        onClose();
     }

    const saveBooking = async () =>{
        const bookingRef = doc(firestore, `bookings/${Date.now()}`);
        const bookingData = {
            id: String(Date.now()),
            seeker: booking.seeker,
            giver: booking.giver,
            date: getUnixTime(booking.date),
            amount: booking.amount,
        };

        try {
          await setDoc(bookingRef, bookingData);
          setMessage("Booking added successfully");
          setShowMessage(true);
          clear();
          onClose();
        } catch (error) {
            setMessage("An error occurred while adding todo");
            setShowMessage(true)
        }
    }

    const clear = () =>{
        setBooking({
            seeker: '',
            giver: '',
            date: new Date(),
            amount: 0,
        })
    }

    return (
        <>
            <Snackbar
                open={showMessage}
                autoHideDuration={6000}
                onClose={() => setShowMessage(false)}
                message={message}
            />
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                
                >
                <Box sx={style}>
                    <Stack spacing={2}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            {documentId ?'Edit' : 'Create'} Booking
                        </Typography>
                        <div style={{
                            display: 'block',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: ''

                        }}>
                            <Stack spacing={2}>
                                <TextField
                                    required
                                    label="Seeker"
                                    fullWidth
                                    style={{
                                        padding: '5px',
                                    }}
                                    defaultValue={selectedBooking ? selectedBooking.seeker : ''}
                                    onChange={(e) => {setBooking(prev => ({...prev, seeker: e.target.value}) )}}
                                />
                                <TextField
                                    label="Giver"
                                    fullWidth
                                    required
                                    style={{
                                        padding: '5px',
                                    }}
                                    defaultValue={selectedBooking ? selectedBooking.giver : ''}
                                    onChange={(e) => {setBooking(prev => ({...prev, giver: e.target.value}) )}}
                                />
                                <TextField
                                    id="date"
                                    label="Date"
                                    type="date"
                                    defaultValue={formatDate(selectedBooking ? selectedBooking.date : new Date())}
                                    sx={{ width: 220 }}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    onChange={(e) => {setBooking(prev => ({...prev, date: new Date(e.target.value)}) )}}
                                />
                                <TextField
                                    label="Total Amount"
                                    fullWidth
                                    required
                                    defaultValue={ selectedBooking ? selectedBooking.amount : 0}
                                    style={{
                                        padding: '5px',
                                    }}
                                    type='number'
                                    onChange={(e) => { setBooking(prev => ({...prev, amount: parseFloat(e.target.value)}) )}}
                                />
                            </Stack>
                        </div>
                        <Stack direction="row" spacing={2}>
                            <Button
                                variant='outlined'
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
        
                            <Button
                                variant='contained'
                                onClick={() => 
                                    documentId ? updateBooking() : saveBooking()
                                }
                            >
                                {documentId? 'Update' :'Save'}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Modal>
        </>
    )
    
};

export default CreateEditModal;

