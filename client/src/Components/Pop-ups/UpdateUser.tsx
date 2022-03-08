import React from 'react';
import {Button} from 'react-bootstrap';
import PopUp from './Pop-up';
import './PopUp.css'
import {AuthContext} from '../../AuthContext';
import EventBus from "../../Api/EventBus";
import {updateCurrentUser} from "../../Api/Auth";

type Props = {
  onClose: Function,
  description: string,
  profileImageUrl: string,
}


export default class UpdateUserPopup extends React.Component<Props> {

  private popUpTitle: string = "Edit Profile";
  private cancelText: string = "Cancel"
  private updateText: string = "Update User";
  private titleImageUrl: string = "New Profile Image";
  private placeholderImageUrl: string = "New Image URL..."
  private titleDescription: string = "New description";
  private placeholderDescription: string = "New Description..."

  constructor(props: Props) {
    super(props);

    this.state.inputImageUrl = props.profileImageUrl;
    this.state.inputDescription = props.description;
  }

  state = {
    inputImageUrl: "",
    inputDescription: "",
    message: ""
  }

  onChangeImageUrl = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({inputImageUrl: e.currentTarget.value});
  };

  onChangeDescription = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({inputDescription: e.currentTarget.value});
  };

  onUpdateHandler = (currentUser?: number) => {
    this.setState({message: ""})
    if (currentUser) {
      let updateObj: any = {};

      if (this.props.profileImageUrl != this.state.inputImageUrl)
        updateObj["imageUrl"] = this.state.inputImageUrl

      if (this.props.description != this.state.inputDescription)
        updateObj["description"] = this.state.inputDescription

      if (Object.keys(updateObj).length < 1) {
        this.setState({message: "Change either image or description"})
        return
      }

      updateCurrentUser(updateObj)
          .then(() => {
            EventBus.trigger("REFRESH_POSTS", null);
            this.props.onClose()
          })
    } else {
      this.setState({message: "Could not update user"})
    }
  }

  render() {
    return (
        <PopUp onClose={this.props.onClose}>
          <form className="form-pop-up">
            <h2><b>{this.popUpTitle}</b></h2>
            <div className="input-content">
              <div className="input-sub-content">
                <h4><b>{this.titleImageUrl}</b></h4>
                <input
                    type="text"
                    value={this.state.inputImageUrl}
                    onChange={this.onChangeImageUrl}
                    placeholder={this.placeholderImageUrl}
                    data-testid="title-input"/>
              </div>
              <div className="input-sub-content">
                <h4><b>{this.titleDescription}</b></h4>
                <input
                    type="text"
                    value={this.state.inputDescription}
                    onChange={this.onChangeDescription}
                    placeholder={this.placeholderDescription}
                    data-testid="description-input"/>
              </div>
              <div className="pop-up-button-container">
                <Button className="pop-up-button" onClick={() => this.props.onClose()}>{this.cancelText}</Button>
                <AuthContext.Consumer>
                  {context => (
                      <>
                        <Button className="pop-up-button"
                                onClick={() => this.onUpdateHandler.bind(this)(context.currentUser?.id)}>{this.updateText}</Button>
                      </>
                  )}
                </AuthContext.Consumer>
              </div>
              {
                this.state.message.length > 0 ?
                    <div className="alert alert-danger">
                      {this.state.message}
                    </div>
                    : this.state.message
              }
            </div>
          </form>
        </PopUp>
    )
  }
}