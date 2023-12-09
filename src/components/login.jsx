import React, { useState } from 'react'
import { Card, Form, Input, Container, Button, Spinner } from 'react-bootstrap'
import http from '../axios_config/axios.config';
import swal from 'sweetalert';
// import { Button } from 'primereact/button';

export default function Login() {

    const [credentials, setCredentials] = useState({
        name: '',
        password: ''
    });

    const [loggingIn, toggleLoggingIn] = useState(false);

    const login = async () => {
        toggleLoggingIn(true);
        await http.post('/api/login', credentials).then((login) => {
          console.log(login);
          localStorage.setItem('token', login.data.token);
          toggleLoggingIn(false);
          swal({
            title: "Success!",
            text: 'You are logged in. Welcome to Q-HUB!',
            icon: "success"
          })
        }).catch((err) => {
            toggleLoggingIn(false);
            swal({
                title: "Login Failed!",
                text: 'Invalid Credentials. Please try again later.',
                icon: "error"
              })
          console.log(err);
        })
    }

  return (
    <div className='min-h-screen'>
        {loggingIn ? (
            <Spinner animation="border" role="status" className={`fixed top-1/2 left-1/2 translate-center hidden`}>
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        ) : (
            <></>
        )}
        <Container>
        <Card className='my-20' >
            <Card.Header>
                <h1 className='text-center'>Please Login To Continue</h1>
            </Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>
                            Username
                        </Form.Label>
                        <Form.Control value={credentials.name} onChange={(e) => setCredentials((prev) => ({...prev, name:e.target.value}))}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>
                            Password
                        </Form.Label>
                        <Form.Control value={credentials.password} type='password' onChange={(e) => setCredentials((prev) => ({...prev, password:e.target.value}))}/>
                    </Form.Group>
                </Form>
            </Card.Body>
            <Card.Footer>
                <Button onClick={login}>Login</Button>
            </Card.Footer>
        </Card>
        </Container>
    </div>
  )
}
