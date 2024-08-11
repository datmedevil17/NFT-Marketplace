import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import market from "../assets/market.png"
import {Navbar , Nav, Button, Container} from "react-bootstrap"


const Navigation = ({connectWallet, account}) => {
    useEffect(()=>{
        connectWallet()
    })
  return (
    <Navbar className='bg-dark'>
    <Container>
                <Navbar.Brand href="" style={{color:"white"}}>
                    <img src={market} width="40" height="40" className="" alt="" />
                    &nbsp; DApp NFT Marketplace
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/" style={{color:"white"}}>Home</Nav.Link>
                        <Nav.Link as={Link} to="/create" style={{color:"white"}}>Create</Nav.Link>
                        <Nav.Link as={Link} to="/my-listed-items" style={{color:"white"}}>My Listed Items</Nav.Link>
                        <Nav.Link as={Link} to="/my-purchases" style={{color:"white"}}>My Purchases</Nav.Link>
                    </Nav>
                    <Nav>
                        {account ? (
                            <Nav.Link
                                href={`https://etherscan.io/address/${account}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button nav-button btn-sm mx-4">
                                <Button variant="outline-light">
                                    {account.slice(0, 5) + '...' + account.slice(38, 42)}
                                </Button>

                            </Nav.Link>
                        ) : (
                            <Button onClick={connectWallet} variant="outline-dark">Connect Wallet</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
  )
}

export default Navigation
