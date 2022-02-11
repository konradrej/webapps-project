import React from 'react';
import PopUp from './Pop-up';

export default class SignInPopUp extends React.Component<{}>{

  private signInText : string = "Sign In";
  private registerText : string = "Register";
  private userNameText : string = "Username";
  private userPasswordText : string = "Password";
  private userNamePlaceholder : string ="Enter username";
  private passwordPlaceholder : string ="Enter password";


  onSignInHandler = () => {
    console.log("hej")
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
              <input type="text" placeholder={ this.userNamePlaceholder } />
            </div>
            <div className="input-sub-content">
              <h2><b>{ this.userPasswordText }</b></h2>
              <input type="password" placeholder={ this.passwordPlaceholder }/>
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