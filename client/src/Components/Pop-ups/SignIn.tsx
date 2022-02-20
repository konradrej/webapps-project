import React from 'react';
import { Button } from 'react-bootstrap';
import PopUp from './Pop-up';
import './PopUp.css'

type Props = {
  onClose?: Function
}

export default class SignInPopUp extends React.Component<Props>{

  private signInText: string = "Sign In";
  private registerText: string = "Register";
  private userNameText: string = "Username";
  private userPasswordText: string = "Password";
  private userNamePlaceholder: string = "Enter username";
  private passwordPlaceholder: string = "Enter password";

  state = {
    inputUsername: "",
    inputPassword: ""
  }

  onChangeUserName = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({ inputUsername: e.currentTarget.value });
  };

  onChangePassword = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({ inputPassword: e.currentTarget.value });
  };


  onSignInHandler = () => {
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
              <input type="text" value={this.state.inputUsername} placeholder={this.userNamePlaceholder} onChange={this.onChangeUserName} />
            </div>
            <div className="input-sub-content">
              <h2><b>{this.userPasswordText}</b></h2>
              <input type="password" value={this.state.inputPassword} placeholder={this.passwordPlaceholder} onChange={this.onChangePassword} />
            </div>
            <div className="pop-up-button-container">
              <Button className="pop-up-button" onClick={this.onRegisterHandler}>
                {this.registerText}
              </Button>
              <Button className="pop-up-button" onClick={this.onSignInHandler}>
                {this.signInText}
              </Button>
            </div>
          </div>
        </form>
      </PopUp>
    )
  }
}