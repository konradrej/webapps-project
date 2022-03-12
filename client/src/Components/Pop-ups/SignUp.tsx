import React from 'react';
import { Button } from 'react-bootstrap';
import PopUp from './Pop-up';
import './PopUp.css'
import { AuthContext } from "../../AuthContext";

type Props = {
  onClose: Function,
}

export default class SignUpPopUp extends React.Component<Props> {

  private registerText: string = "Register";
  private goBackText: string = "Go back";
  private userNameText: string = "Username";
  private userPasswordText: string = "Password";
  private userEmailText: string = "E-mail";
  private userNamePlaceholder: string = "Enter username";
  private passwordPlaceholder: string = "Enter password";
  private emailPlaceholder: string = "Enter e-mail";

  state = {
    inputUserName: "",
    inputPassword: "",
    inputEmail: "",
    errorMsg: "",
  }

  onChangeUserName = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({ inputUserName: e.currentTarget.value });
  };

  onChangePassword = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({ inputPassword: e.currentTarget.value });
  };

  onChangeEmail = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({ inputEmail: e.currentTarget.value });
  };

  onRegisterHandler = (register: (username: string, password: string, email: string) => Promise<boolean>) => {
    this.setState({ errorMsg: "" })
    register(this.state.inputUserName,
      this.state.inputPassword,
      this.state.inputEmail
    )
      .then((bool) => {
        if (bool)
          this.props.onClose()
      })
      .catch((err) => {
        if (err.response?.data.reason) {
          this.setState({ errorMsg: err.response.data.reason })
        }
      })
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
                value={this.state.inputUserName}
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
            <div className="input-sub-content">
              <h2><b>{this.userEmailText}</b></h2>
              <input
                type="email"
                value={this.state.inputEmail}
                placeholder={this.emailPlaceholder}
                onChange={this.onChangeEmail}
                data-testid="email-input" />
            </div>
            {this.state.errorMsg.length > 0 ?
              <div className="alert alert-danger">
                {this.state.errorMsg}
              </div>
              : this.state.errorMsg
            }
            <div className="pop-up-button-container">
              <Button
                className="pop-up-button"
                onClick={this.props.onClose()}>
                {this.goBackText}
              </Button>
              <AuthContext.Consumer>
                {context => (
                  <React.Fragment>
                    <Button
                      className="pop-up-button"
                      data-id="submit-button"
                      onClick={() => this.onRegisterHandler.bind(this)(context.register)}>
                      {this.registerText}
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