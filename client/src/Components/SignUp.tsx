import React from 'react';
import { Button } from 'react-bootstrap';
import PopUp from './Pop-up';
import axios, {AxiosResponse} from 'axios';


type Props= {
  onClose?: Function,
}

export default class SignUpPopUp extends React.Component<Props>{

  private registerText : string = "Register";
  private goBackText : string = "Go back";
  private userNameText : string = "Username";
  private userPasswordText : string = "Password";
  private userEmailText : string = "E-mail";
  private userNamePlaceholder : string ="Enter username";
  private passwordPlaceholder : string ="Enter password";
  private emailPlaceholder : string = "Enter e-mail";

  state = {
    inputUserName: "",
    inputPassword: "",
    inputEmail: "",
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

  onGoBackHandler = () => {
  }

  onRegisterHandler = async () => {
  }

  render(){
    return(
      <PopUp onClose={this.props.onClose}>
        <form className="form-pop-up">
          <div className="input-content">  
            <div className="input-sub-content">
              <h2><b>{ this.userNameText }</b></h2>
              <input type="text" value={ this.state.inputUserName } placeholder={ this.userNamePlaceholder } onChange={ this.onChangeUserName }  />
            </div>
            <div className="input-sub-content">
              <h2><b>{ this.userPasswordText }</b></h2>
              <input type="password" value={ this.state.inputPassword } placeholder={ this.passwordPlaceholder } onChange={ this.onChangePassword }/>
            </div>
            <div className="input-sub-content">
              <h2><b>{ this.userEmailText }</b></h2>
              <input type="text" value={ this.state.inputEmail } placeholder={ this.emailPlaceholder } onChange={ this.onChangeEmail }/>
            </div>
            <div className="pop-up-button-container">
              <Button className="pop-up-button" onClick={ this.onGoBackHandler }>
                { this.goBackText }
              </Button>
              <Button className="pop-up-button" onClick={ this.onRegisterHandler }>
                { this.registerText }
              </Button>
            </div>
          </div>
        </form>
      </PopUp>
    )
  }
}