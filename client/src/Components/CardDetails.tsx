import React, { Component } from 'react';
import PopUp from './Pop-up';

export default class CardDetailsPopUp extends React.Component<{ postImageURL: string , postTitle: string, userImage : string, userName : string, postDate : string, postDescription : string}>{

  private descriptionText: string = "Description: "
  private createdAtText: string = "Created at: "

  // TODO onclick userProfile


  render(){
    return(
      <PopUp>
        <div className="post-pop-up">
          <div className="post-content">
            <img className="post-image"src= {this.props.postImageURL} alt="alt"/>
            <div className="post-info">
              <h2>{ this.props.postTitle }</h2>
              <div className="post-user-info">
                <img className ="post-user-profile" src={this.props.userImage} alt="profile" />
                <h4 className="username"><b>{ this.props.userName} </b></h4>
              </div>
              <h4>{ this.createdAtText } </h4>
              <p>{ this.props.postDate }</p>
              <h4>{ this.descriptionText }</h4>
              <p>{ this.props.postDescription }</p>
            </div>
          </div>
        </div>
      </PopUp>
    )
  }
}