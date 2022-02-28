import React from 'react';
import PopUp from './Pop-up';
import 'bootstrap/dist/css/bootstrap.min.css'
import './PopUp.css'
import { Button } from 'react-bootstrap';
import UpdatePostPopUp from './UpdatePost';
import DeletePostPopup from './DeletePost';
import { AuthContext } from '../../AuthContext';

type Props = {
  postId: number,
  postImageURL: string,
  postTitle: string,
  userImage: string,
  userName: string,
  userId: number,
  postDate: string,
  postDescription: string,
  onClose?: Function
}

export default class CardDetailsPopUp extends React.Component<Props>{

  private descriptionText: string = "Description: "
  private createdAtText: string = "Created at: "

  state = {
    updateState: false,
    deleteState: false,
    errorMsg: ""
  }

  onCloseUpdate = () => {
    this.setState({updateState: false})
  }

  onCloseDelete = () => {
    this.setState({deleteState: false})
  }

  render() {
    return (
      <PopUp onClose={this.props.onClose}>
        <div className="post-content">
          <img className="post-image" src={this.props.postImageURL} alt="Image not rendered" />
          <div className='post-info'>
            <div>
              <h4>{this.props.postTitle}</h4>
              <div className="post-user-info">
                <img className="post-user-profile" src={this.props.userImage} alt="profile" />
                <h6 className="username"><b>{this.props.userName} </b></h6>
              </div>
              <h5>{this.createdAtText} </h5>
              <p>{this.props.postDate}</p>
              <h5>{this.descriptionText}</h5>
              <p>{this.props.postDescription}</p>
            </div>
            <div className='pop-up-button-container'>
              {(this.state.updateState) ? <UpdatePostPopUp onClose={this.onCloseUpdate} postId={this.props.postId}/> : null}
              {(this.state.deleteState) ? <DeletePostPopup onClose={this.onCloseDelete} postId={this.props.postId}/> : null}
              <AuthContext.Consumer>
                {(context) =>(
                  (context.currentUser?.id === this.props.userId )?
                    <>              
                      <Button variant="outline-primary" onClick={() => this.setState({updateState: true})}>Edit</Button>
                      <Button variant="outline-danger" onClick={() => this.setState({deleteState: true})}>Delete</Button>
                    </> :
                    null
                )}
              </AuthContext.Consumer>
            </div>
          </div>
        </div>
      </PopUp>
    )
  }
}