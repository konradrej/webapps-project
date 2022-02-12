import React from 'react';
import PopUp from './Pop-up';

export default class SignInPopUp extends React.Component<{}>{

  private signInText : string = "Sign In";
  private registerText : string = "Register";
  private userNameText : string = "Username";
  private userPasswordText : string = "Password";
  private userNamePlaceholder : string ="Enter username";
  private passwordPlaceholder : string ="Enter password";

  state= {
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
    console.log("hej")
  }

  render(){
    return(
      <PopUp>
        <form className="form-pop-up">
          <div className="input-content">  
            <div className="input-sub-content">
              <h2><b>{ this.userNameText }</b></h2>
              <input type="text" value={ this.state.inputUsername } placeholder={ this.userNamePlaceholder } onChange={ this.onChangeUserName } />
            </div>
            <div className="input-sub-content">
              <h2><b>{ this.userPasswordText }</b></h2>
              <input type="password" value={ this.state.inputPassword } placeholder={ this.passwordPlaceholder } onChange={ this.onChangePassword }/>
            </div>
            <div className="pop-up-button-container">
              <button className="pop-up-button" onClick={ this.onRegisterHandler }>
                { this.registerText }
              </button>
              <button className="pop-up-button" onClick={ this.onSignInHandler }>
              { this.signInText }
              </button>
            </div>
          </div>
        </form>
      </PopUp>
    )
  }
}