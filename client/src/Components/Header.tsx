import { useEffect, useState } from "react";
import { Container, Nav, Navbar, Form, FormControl, Button } from "react-bootstrap";
import SignUpPopUp from "./Pop-ups/SignUp";
import SignInPopUp from "./Pop-ups/SignIn";
import CreatePostPopUp from "./Pop-ups/CreatePost";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import "./tempcss.css";

const Header = () => {
  const navigate = useNavigate();

  const [signIn, setSignIn] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [createPost, setCreatePost] = useState(false);

  const [submit, setSubmit] = useState(false);
  const [inputSearch, setInputSearch] = useState("");

  useEffect(() => {
    if(submit){
      setSubmit(false);

      if(inputSearch)
        navigate("/search?search=" + inputSearch);
    }
  }, [submit])

  return (
    <>
      {(signIn) ? <SignInPopUp onClose={() => setSignIn(false)} /> : null}
      {(signUp) ? <SignUpPopUp onClose={() => setSignUp(false)} /> : null}
      {(createPost) ? <CreatePostPopUp onClose={() => setCreatePost(false)} /> : null}

      <Navbar className="color-nav" variant="dark" expand="md">
        <Container className="header-components">
          <Link to="/" className="navbar-brand-link"><Navbar.Brand>Navbar</Navbar.Brand></Link>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Form className="d-flex pt-3 pt-md-0" onSubmit={(e) => {e.preventDefault(); setSubmit(true);}}>
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                name="search"
                value={inputSearch}
                onChange={(e) => {setInputSearch(e.currentTarget.value)}}
              />
              <Button className="me-2"
                variant="outline-success" type="submit">Search</Button>
            </Form>
            <Nav className="ms-auto my-2 my-lg-0">
              <AuthContext.Consumer>
                {context => (
                  <>
                    {!context.currentUser ?
                      <>
                        <Button onClick={() => setSignIn(true)} className="me-2" variant="outline-success">Login</Button>
                        <Button onClick={() => setSignUp(true)} className="me-2" variant="outline-success">Sign-Up</Button>
                      </>
                      :
                      <>
                        <Link className="me-2 btn btn-outline-success" to={"/profile/" + context.currentUser.id}>Profile</Link>
                        <Button onClick={() => setCreatePost(true)} className="me-2" variant="outline-primary">Create Post</Button>
                        <Button onClick={context.logout} className="me-2" variant="outline-danger">Logout</Button>
                      </>
                    }
                  </>
                )}
              </AuthContext.Consumer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default Header;