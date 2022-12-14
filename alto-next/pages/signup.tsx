import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { Snackbar, Stack, Typography } from "@mui/material";

const SignUp = () => {
    const router = useRouter();
    const { signUp } = useAuth();
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = async  () => {  
        try {
            await signUp(email, password);
            router.push("/");
        } catch (error: any) {
            console.log(error.message);
            setMessage(error.message);
            setShowMessage(true)
            setEmail('');
            setPassword('');
        } 
    };


    return (
        <div className="App" 
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}

        >   
            <Snackbar
                open={showMessage}
                autoHideDuration={6000}
                onClose={() => setShowMessage(false)}
                message={message}
            /> 
        
            <Stack spacing={2}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Sign Up
                </Typography>
                <form className="form">
                    <div style={{
                        width: '400px',
                        padding: '5px',
                    }}>
                        <TextField
                            required
                            name='email'
                            id="outlined-required"
                            label="Email"
                            fullWidth
                            value={email}
                            onChange={(e) => {setEmail(e.target.value)}}
                        />
                    </div>
                    <div style={{
                        width: '400px',
                        padding: '5px',
                    }}>
                        <TextField
                            name='password'
                            label="Password"
                            type={'password'}
                            fullWidth
                            value={password}
                            onChange={(e) => {setPassword(e.target.value)}}
                        />
                    </div>
                    <Button 
                        variant="contained"
                        fullWidth
                        onClick={async () => {
                            await handleSubmit();
                        }}
                    >
                        Sign Up
                    </Button>
                    <br/>
                    <br/>
                    <Button variant= 'outlined'
                        fullWidth
                        onClick={() => {
                            router.push("/login");
                        }}
                    >
                        Log In
                    </Button>
                </form>
            </Stack>
        </div>
    );
};


export default SignUp
