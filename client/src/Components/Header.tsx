import React, { Component } from 'react'
import { Container, Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap'

export default class Header extends Component {
  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark" expand="md">
          <Container fluid>
            <Navbar.Brand href="#">Navbar</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Form className="d-flex">
                <FormControl
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-success">Search</Button>
              </Form>
              <Nav
                className="me-auto my-2 my-lg-0"
              >
                <Nav.Link href="#action1">Login</Nav.Link>
                <Nav.Link href="#action1">Sign up</Nav.Link>

              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    )
  }
}
