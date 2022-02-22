import React, { Component } from 'react'
import { Container, Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap'
import SignUpPopUp from './Pop-ups/SignUp'
import SignInPopUp from './Pop-ups/SignIn'
import CreatePostPopUp from './Pop-ups/CreatePost'
import './tempcss.css'
import { Link } from 'react-router-dom'

export default class Header extends Component {

  popUpState = {
    signIn: false,
    signUp: false,
    createPost: false,
  }

  onClickSignIn = () => {
    this.popUpState.signIn = !this.popUpState.signIn
    this.forceUpdate();
  }

  onClickSignUp = () => {
    this.popUpState.signUp = !this.popUpState.signUp
    this.forceUpdate();
  }

  onClickCreatePost = () => {
    this.popUpState.createPost = !this.popUpState.createPost
    this.forceUpdate();
  }

  render() {
    return (
      <div>
        {(this.popUpState.signIn) ? <SignInPopUp onClose={this.onClickSignIn.bind(this)} /> : null}
        {(this.popUpState.signUp) ? <SignUpPopUp onClose={this.onClickSignUp.bind(this)} /> : null}
        {(this.popUpState.createPost) ? <CreatePostPopUp onClose={this.onClickCreatePost.bind(this)} /> : null}

        <Navbar className='color-nav' variant="dark" expand="md">
          <Container className='header-components'>
            <Link to="/" className="navbar-brand-link"><Navbar.Brand>Navbar</Navbar.Brand></Link>
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
                <Button onClick={this.onClickSignIn.bind(this)} className="me-2"
                  variant="outline-success">Login</Button>
                <Button onClick={this.onClickSignUp.bind(this)} className="me-2"
                  variant="outline-success">Sign-Up</Button>
                <Button onClick={this.onClickCreatePost.bind(this)} className="me-2"
                  variant="outline-success">Create Post</Button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    )
  }
}
