import React, { Component } from 'react'
import { Container, Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap'
import SignUpPopUp from './Pop-ups/SignUp'
import SignInPopUp from './Pop-ups/SignIn'
import './tempcss.css'
import {AuthContext} from "../AuthContext";
import { Link } from 'react-router-dom'

export default class Header extends Component {

  popUpState = {
    signIn: false,
    signUp: false,
  }

  onClickSignIn = () => {
    this.popUpState.signIn = !this.popUpState.signIn
    this.forceUpdate();
  }

  onClickSignUp = () => {
    this.popUpState.signUp = !this.popUpState.signUp
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        {(this.popUpState.signIn) ? <SignInPopUp onClose={this.onClickSignIn.bind(this)}/> : null}
        {(this.popUpState.signUp) ? <SignUpPopUp onClose={this.onClickSignUp.bind(this)}/> : null}
        <Navbar className='color-nav' variant="dark" expand="md">
          <Container className='header-components'>
            <Navbar.Brand href="#">Navbar</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Form className="d-flex pt-3 pt-md-0">
                <FormControl
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
                <Button className="me-2"
                  variant="outline-success">Search</Button>
              </Form>
              <Nav
                className="ms-auto my-2 my-lg-0"
              >
                <AuthContext.Consumer>
                  {context => (
                      <React.Fragment>
                        {!context.currentUser ?
                            <React.Fragment>
                              <Button onClick={this.onClickSignIn.bind(this)} className="me-2"
                                      variant="outline-success">Login</Button>
                              <Button onClick={this.onClickSignUp.bind(this)} className="me-2"
                                      variant="outline-success">Sign-Up</Button>
                            </React.Fragment>
                            :
                            <React.Fragment>
                              <Link className="me-2 btn btn-outline-success" to={"/profile/"+context.currentUser.id}>Profile</Link>
                              <Button onClick={context.logout} className="me-2"
                                      variant="outline-danger">Logout</Button>
                            </React.Fragment>
                        }
                      </React.Fragment>
                  )}
                </AuthContext.Consumer>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    )
  }
}
