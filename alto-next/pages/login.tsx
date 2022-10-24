import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";



const Login = () => {
    const router = useRouter();
    const { logIn } = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const submit = async () => {
        try {
            await logIn(email, password);
          router.push("/");
        } catch (error: any) {
          console.log(error.message);
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
                        onChange={(e) => {setPassword(e.target.value)}}
                    />
                </div>
                <Button 
                    variant="contained"
                    fullWidth
                    onClick={async () => {
                        await submit()
                    }}
                >
                    Login
                </Button>
                <br/>
                <br/>
                <Button variant= 'outlined'
                    fullWidth
                    onClick={() => {
                        router.push("/signup");
                    }}
                >Sign Up</Button>
            </form>
        </div>
    );
};


export default Login
