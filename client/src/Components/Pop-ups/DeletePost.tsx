import React from 'react';
import { Button } from 'react-bootstrap';
import PopUp from './Pop-up';
import './PopUp.css'
import { AuthContext } from '../../AuthContext';
import { deletePost } from '../../Api/Posts';

type Props = {
  onClose: Function,
  postId: number
}

export default class DeletePostPopup extends React.Component<Props>{

  private deleteMessage: string = "Are you sure you want to delete this post?";
  private cancelText: string = "Cancel"
  private confirmText: string = "Confirm";

  state = {
    message: ""
  }

  onDeleteHandler = (currentUser?: number) => {
    this.setState({ errorMsg: "" })
    if (currentUser) {
      deletePost(this.props.postId, currentUser)
        .then((res) => {
          this.setState({ message: res });
        })
    }
    else {
      this.setState({ message: "You must be logged in" })
    }
  }

  render() {
    return (
      <PopUp onClose={this.props.onClose}>
        <div>
          <h4><b>{this.deleteMessage}</b></h4>
          <Button className="pop-up-button" onClick={() => this.props.onClose()}>{this.cancelText}</Button>
          <AuthContext.Consumer>
            {context => (
              <>
                <Button className="pop-up-button" onClick={() => this.onDeleteHandler.bind(this)(context.currentUser?.id)}>{this.confirmText}</Button>
              </>
            )}
          </AuthContext.Consumer>
          {
            this.state.message.length > 0 ?
              <div className="alert alert-danger">
                {this.state.message}
              </div>
              : this.state.message
          }
        </div>
      </PopUp>
    )
  }
}