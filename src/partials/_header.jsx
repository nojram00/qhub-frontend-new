import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Navbar, Nav } from 'react-bootstrap';
export default function Header() {
  const navigate = useNavigate();
  return (
    <div>
        <header className='bg-blue-200'>
          <Container className='p-3 flex flex-row justify-between items-baseline'>
            <h1 onClick={ () => navigate('/') } className='cursor-pointer'>Q-HUB</h1>
            <Navbar>
              <Nav className='me-auto'>
                <Nav.Link href='/#prebuilds'><h5>Prebuilds</h5></Nav.Link>
                <Nav.Link href='/#items'><h5>Items</h5></Nav.Link>
                <Nav.Link href='/quote'><h5>Quote Your PC</h5></Nav.Link>
              </Nav>
            </Navbar>
          </Container>
        </header>
    </div>
  )
}
