/**
 * Popup for confirming deletion of post.
 */

import React from 'react';
import { Button } from 'react-bootstrap';
import PopUp from './Pop-up';
import './PopUp.css'
import { AuthContext } from '../../AuthContext';
import { deletePost } from '../../Api/Posts';
import EventBus from "../../Api/EventBus";

type Props = {
  onClose: Function,
  postId: number
}

export default class DeletePostPopup extends React.Component<Props> {

  private deleteMessage: string = "Are you sure you want to delete this post?";
  private cancelText: string = "Cancel"
  private confirmText: string = "Confirm";

  state = {
    message: ""
  }

  onDeleteHandler = () => {
    this.setState({ errorMsg: "" })
    deletePost(this.props.postId)
      .then(() => {
        EventBus.trigger("REFRESH_POSTS", null);
        this.props.onClose()
      })
      .catch((error) => this.setState({ message: error.message }))
  }

  render() {
    return (
      <PopUp onClose={this.props.onClose}>
        <div>
          <h4><b>{this.deleteMessage}</b></h4>
          <Button
            className="pop-up-button"
            data-testid="cancel-button"
            onClick={() => this.props.onClose()}>{this.cancelText}</Button>
          <AuthContext.Consumer>
            {context => (
              <>
                <Button className="pop-up-button"
                  data-testid="submit-button"
                  onClick={() => this.onDeleteHandler.bind(this)()}>{this.confirmText}
                </Button>
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