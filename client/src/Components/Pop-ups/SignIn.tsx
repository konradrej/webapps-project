import React from 'react';
import { Button } from 'react-bootstrap';
import PopUp from './Pop-up';
import './PopUp.css'
import { AuthContext } from "../../AuthContext";

type Props = {
  onClose: Function
}

export default class SignInPopUp extends React.Component<Props> {

  private signInText: string = "Sign In";
  private userNameText: string = "Username";
  private userPasswordText: string = "Password";
  private userNamePlaceholder: string = "Enter username";
  private passwordPlaceholder: string = "Enter password";

  state = {
    inputUsername: "",
    inputPassword: "",
    errorMsg: ""
  }

  onChangeUserName = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({ inputUsername: e.currentTarget.value });
  };

  onChangePassword = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({ inputPassword: e.currentTarget.value });
  };


  onSignInHandler = (login: (username: string, password: string) => Promise<boolean>) => {
    if (this.state.inputUsername.length > 0 && this.state.inputPassword.length > 0) {
      this.setState({ errorMsg: "" })
      login(this.state.inputUsername, this.state.inputPassword)
        .then((bool) => {
          if (bool)
            this.props.onClose();
        })
        .catch((err) => {
          if (err.response?.data.reason) {
            this.setState({ errorMsg: err.response.data.reason })
          }
        })
    } else {
      this.setState({ errorMsg: "Input cannot be empty" })
    }
  }

  onRegisterHandler = () => {
  }

  render() {
    return (
      <PopUp onClose={this.props.onClose}>
        <form className="form-pop-up">
          <div className="input-content">
            <div className="input-sub-content">
              <h2><b>{this.userNameText}</b></h2>
              <input
                type="text"
                value={this.state.inputUsername}
                placeholder={this.userNamePlaceholder}
                onChange={this.onChangeUserName}
                data-testid="username-input" />
            </div>
            <div className="input-sub-content">
              <h2><b>{this.userPasswordText}</b></h2>
              <input
                type="password"
                value={this.state.inputPassword}
                placeholder={this.passwordPlaceholder}
                onChange={this.onChangePassword}
                data-testid="password-input" />
            </div>
            {this.state.errorMsg.length > 0 ?
              <div className="alert alert-danger">
                {this.state.errorMsg}
              </div>
              : this.state.errorMsg
            }
            <div className="pop-up-button-container">
              <AuthContext.Consumer>
                {context => (
                  <React.Fragment>
                    <Button
                      className="pop-up-button"
                      data-id="submit-button"
                      onClick={() => this.onSignInHandler.bind(this)(context.login)}>
                      {this.signInText}
                    </Button>
                  </React.Fragment>
                )}
              </AuthContext.Consumer>
            </div>
          </div>
        </form>
      </PopUp>
    )
  }
}