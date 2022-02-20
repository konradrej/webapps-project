import React from 'react';
import PopUp from './Pop-up';
import 'bootstrap/dist/css/bootstrap.min.css'
import './PopUp.css'
type Props = {
  postImageURL: string,
  postTitle: string,
  userImage : string,
  userName : string, 
  postDate : string,
  postDescription : string,
  onClose?: Function
}

export default class CardDetailsPopUp extends React.Component<Props>{

  private descriptionText: string = "Description: "
  private createdAtText: string = "Created at: "

  // TODO onclick userProfile

  render(){
    return(
      <PopUp onClose={this.props.onClose}>
        <div className="post-content">
          <img className="post-image"src= {this.props.postImageURL} alt="Image not rendered"/>
          <div className='post-info'>
          <h4>{ this.props.postTitle }</h4>
          <div className="post-user-info">
            <img className ="post-user-profile" src={this.props.userImage} alt="profile" />
            <h6 className="username"><b>{ this.props.userName} </b></h6>
          </div>
          <h5>{ this.createdAtText } </h5>
          <p>{ this.props.postDate }</p>
          <h5>{ this.descriptionText }</h5>
          <p>{ this.props.postDescription }</p>
          </div>
        </div>
      </PopUp>
    )
  }
}