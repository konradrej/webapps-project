import React from 'react';
import {Button} from 'react-bootstrap';
import PopUp from './Pop-up';
import './PopUp.css'
import {AuthContext} from "../../AuthContext";
import {createPost} from '../../Api/Posts';
import EventBus from "../../Api/EventBus";
import axios from "axios";

type Props = {
  onClose: Function,
}


export default class CreatePostPopUp extends React.Component<Props> {

  private createText: string = "Create";
  private userTitle: string = "Title";
  private cancelText: string = "Cancel";
  private userDescription: string = "Description";
  private titleImage: string = "Image Url"
  private imagePlaceholder: string = "Add URL to image here";
  private titlePlaceholder: string = "Add your title";
  private descriptionPlaceholder: string = "Tell everyone what your picture is about";

  state = {
    inputTitle: "",
    inputDescription: "",
    inputImage: "",
    message: "",
  }

  onChangeTitle = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({inputTitle: e.currentTarget.value});
  };

  onChangeDescription = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({inputDescription: e.currentTarget.value});
  };

  onImageChange = (e: React.FormEvent<HTMLInputElement>): void => {
    this.setState({inputImage: e.currentTarget.value});
  };

  private async validateImage() {
    try {
      let url = new URL(this.state.inputImage);
      let res = await axios.head(url.toString());
      if (res.headers["content-type"].startsWith("image/")) {
        return true
      }else{
        this.setState({message: "Provided URL is not an image"})
      }
    } catch (err) {
      this.setState({message: "Invalid Url"});
    }
    return false;
  }

  onCreateHandler = async (currentUser?: number) => {
    this.setState({message: ""})

    if (this.state.inputTitle.length < 1 || this.state.inputDescription.length < 1 || this.state.inputImage.length < 1) {
      this.setState({message: "All fields must be set"});
      return;
    }

    if (await this.validateImage()) {
      if (currentUser) {
        createPost(this.state.inputTitle, this.state.inputDescription, this.state.inputImage, currentUser)
            .then((str) => {
              EventBus.trigger("REFRESH_POSTS", null);
              this.props.onClose();
            })
            .catch((error) => {
              this.setState({message: error.message})
            })
      } else {
        this.setState({message: "Creation failed"})
      }
    }
  }

  render() {
    return (
        <PopUp onClose={this.props.onClose}>
          <form className="form-pop-up">
            <div className="input-content">
              <div className="input-sub-content">
                <h2><b>{this.userTitle}</b></h2>
                <input type="text" value={this.state.inputTitle} placeholder={this.titlePlaceholder}
                       onChange={this.onChangeTitle}/>
              </div>
              <div className="input-sub-content">
                <h2><b>{this.userDescription}</b></h2>
                <input type="text" value={this.state.inputDescription} placeholder={this.descriptionPlaceholder}
                       onChange={this.onChangeDescription}/>
              </div>
              <div className="input-sub-content">
                <h2><b>{this.titleImage}</b></h2>
                <input type="text" value={this.state.inputImage} placeholder={this.imagePlaceholder}
                       onChange={this.onImageChange}/>
              </div>
              <div className="pop-up-button-container">
                <Button className="pop-up-button" onClick={() => this.props.onClose()}>{this.cancelText}</Button>
                <AuthContext.Consumer>
                  {context => (
                      <>
                        <Button className="pop-up-button"
                                onClick={() => this.onCreateHandler.bind(this)(context.currentUser?.id)}>{this.createText}</Button>
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