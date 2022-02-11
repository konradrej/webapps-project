import React from 'react';
import PopUp from './Pop-up';

export default class SignUpPopUp extends React.Component<{}>{

  private registerText : string = "Register";
  private goBackText : string = "Go back";
  private userNameText : string = "Username";
  private userPasswordText : string = "Password";
  private userEmailText : string = "E-mail";
  private userNamePlaceholder : string ="Enter username";
  private passwordPlaceholder : string ="Enter password";
  private emailPlaceholder : string = "Enter e-mail";

  onGoBackHandler = () => {
    console.log("hej3")
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
            <div className="input-sub-content">
              <h2><b>{ this.userEmailText }</b></h2>
              <input type="text" placeholder={ this.emailPlaceholder }/>
            </div>
            <div className="pop-up-button-container">
              <button className="pop-up-button" onClick={ this.onGoBackHandler }>
                { this.goBackText }
              </button>
              <button className="pop-up-button" onClick={ this.onRegisterHandler }>
                { this.registerText }
              </button>
            </div>
          </div>
        </form>
      </PopUp>
    )
  }
}