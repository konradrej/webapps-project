import React from 'react';
import {Button} from 'react-bootstrap';
import PopUp from './Pop-up';
import './PopUp.css'
import {updatePost} from '../../Api/Posts';
import EventBus from "../../Api/EventBus";

type Props = {
  onClose: Function,
  postId: number
}

export default class UpdatePostPopUp extends React.Component<Props> {

  private popUpTitle: string = "Edit this post";
  private cancelText: string = "Cancel"
  private updateText: string = "Update post";
  private userPostTitle: string = "New title";
  private userDescription: string = "New description";
  private titlePlaceholder: string = "Add your title";
  private descriptionPlaceholder: string = "Tell everyone what your picture is about";

  state = {
    inputPostTitle: "",
    inputPostDescription: "",
    message: ""
  }

  onChangePostTitle = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({inputPostTitle: e.currentTarget.value});
  };

  onChangeDescription = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({inputPostDescription: e.currentTarget.value});
  };

  onUpdateHandler = () => {
    this.setState({errorMsg: ""})
    updatePost(this.props.postId, this.state.inputPostTitle, this.state.inputPostDescription)
        .then(() => {
          EventBus.trigger("REFRESH_POSTS", null);
          this.props.onClose()
        })
        .catch((error) => this.setState({message: error.message}))
  }

  render() {
    return (
        <PopUp onClose={this.props.onClose}>
          <form className="form-pop-up">
            <h2><b>{this.popUpTitle}</b></h2>
            <div className="input-content">
              <div className="input-sub-content">
                <h4><b>{this.userPostTitle}</b></h4>
                <input
                    type="text"
                    value={this.state.inputPostTitle}
                    placeholder={this.titlePlaceholder}
                    onChange={this.onChangePostTitle}
                    data-testid="title-input"/>
              </div>
              <div className="input-sub-content">
                <h4><b>{this.userDescription}</b></h4>
                <input
                    type="text"
                    value={this.state.inputPostDescription}
                    placeholder={this.descriptionPlaceholder}
                    onChange={this.onChangeDescription}
                    data-testid="description-input"/>
              </div>
              <div className="pop-up-button-container">
                <Button className="pop-up-button" onClick={() => this.props.onClose()}>{this.cancelText}</Button>
                <Button className="pop-up-button"
                        onClick={() => this.onUpdateHandler.bind(this)()}
                        data-testid="submit-button">{this.updateText}</Button>
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