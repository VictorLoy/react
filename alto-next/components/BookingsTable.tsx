import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import CreateEditModal from './CreateEditModal';
import { firestore } from '../firebase/clientApp';
import { collection, doc, DocumentData, getDocs, limit, query, QueryDocumentSnapshot, where } from 'firebase/firestore';
import CircularProgress from '@mui/material/CircularProgress';
import fromUnixTime from 'date-fns/fromUnixTime';
import { format } from 'date-fns'
import { deleteDoc } from "firebase/firestore";


export interface IBooking{
    seeker: string;
    giver: string;
    date: Date;
    amount: number;
}


const BookingsTable = () => {
    const [showCreate, setShowCreate] = useState<boolean>(false);
    const [loading,setLoading] = useState<boolean>(true);
    const [bookings ,setBookings] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<IBooking>();
    const [docId, setDocId] = useState<string>();
    const bookingsCollection = collection(firestore,'bookings');

    const getBookings = async () => { 
        const bookingsQuery = query(bookingsCollection);
        const querySnapshot = await getDocs(bookingsQuery);
        
        const result: QueryDocumentSnapshot<DocumentData>[] = [];
        querySnapshot.forEach((snapshot) => {
            result.push(snapshot);
        });
        setBookings(result);
    };

    const deleteBooking = async (documentId:string) => {
        const bookingref= doc(firestore,`bookings/${documentId}`);
        await deleteDoc(bookingref);
        getBookings();
    }

    const editBooking = (idx: number) => {
        const selected = bookings[idx];
        const editBooking = {
            seeker: selected.get('seeker'),
            giver: selected.get('giver'),
            date: fromUnixTime(selected.get('date')),
            amount: selected.get('amount'),
        }
        setDocId(selected.id)
        setSelectedBooking(editBooking);
        setShowCreate(true);
    }

     
     useEffect( () => {
        getBookings();
        setTimeout( () => {
          setLoading(false);
        },2000)
     // eslint-disable-next-line react-hooks/exhaustive-deps
     },[]);

  return (
    <div>
        <CreateEditModal 
            open={showCreate} 
            onClose={() => {
                setDocId(undefined)
                setSelectedBooking(undefined);
                setShowCreate(!showCreate);
                getBookings();
            }}
            selectedBooking={selectedBooking} 
            documentId={docId}       
        />
        <div style={{
            float: 'right',
            padding: '5px',
        }}>
            <Button
                variant='outlined'
                onClick={() => setShowCreate(!showCreate)}
            >
                Create
            </Button>
        </div>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="caption table">
            <TableHead>
            <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="center">Giver</TableCell>
                <TableCell align="center">Seeker</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Total Amount</TableCell>
                <TableCell align="center">Action</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>

            { loading && (
                <CircularProgress />
            )}
            { !loading && (
                <>
                    {bookings.map((row, idx) => (
                        <TableRow key={idx}>
                        <TableCell component="th" scope="row">
                            {row.id}
                        </TableCell>
                        <TableCell align="center">{row.get('giver')}</TableCell>
                        <TableCell align="center">{row.get('seeker')}</TableCell>
                        <TableCell align="center">{format(fromUnixTime(row.get('date')),'PPPP')}</TableCell>
                        <TableCell align="center">{row.get('amount')}</TableCell>
                        <TableCell align="center">
                            <Button
                                onClick={() => {
                                    editBooking(idx);
                                }}
                            >
                                Edit</Button> 
                                |  
                                <Button
                                    onClick={() => deleteBooking(row.id)}
                                >Delete</Button> 
                            </TableCell>
                        </TableRow>
                    ))}
                </>
                )}
            </TableBody>
        </Table>
        </TableContainer>
    </div>
  );
}

export default BookingsTable;
