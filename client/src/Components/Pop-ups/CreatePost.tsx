import { read } from 'fs';
import React from 'react';
import { Button } from 'react-bootstrap';
import PopUp from './Pop-up';
import './PopUp.css'
import axios from 'axios'
import { Post } from "../../../../server/src/model/post.interface"
import { CreateProgramOptions } from 'typescript';
import { AuthContext } from "../../AuthContext";
import { createPost } from '../../Api/Posts';

type Props = {
    onClose: Function,
}


export default class CreatePostPopUp extends React.Component<Props>{

    private createText: string = "Create";
    private goBackText: string = "Go back";
    private userTitle: string = "Title";
    private userDescription: string = "Description";
    private userImage: string = "Add your image";
    private titlePlaceholder: string = "Add your title";
    private descriptionPlaceholder: string = "Tell everyone what your picture is about";

    state = {
        inputTitle: "",
        inputDescription: "",
        inputImage: "",
    }

    onChangeTitle = (e: React.FormEvent<HTMLInputElement>): void => {
        this.setState({ inputTitle: e.currentTarget.value });
    };

    onChangeDescription = (e: React.FormEvent<HTMLInputElement>): void => {
        this.setState({ inputDescription: e.currentTarget.value });
    };

    onSelectedImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ inputImage: e.target.files![0] });

    };


    onGoBackHandler = () => {
    }

    onUploadHandler = (currentUser?: number) => {
        this.setState({ errorMsg: "" })
        if (currentUser) {
            createPost(this.state.inputTitle, this.state.inputDescription, this.state.inputImage, currentUser)
                .then((res) => {
                    this.setState({ message: res })
                })
        } else {
            this.setState({ message: "upload failed" })
        }
    }



    render() {
        return (
            <PopUp onClose={this.props.onClose}>
                <form className="form-pop-up">
                    <div className="input-content">
                        <div className="input-sub-content">
                            <h2><b>{this.userTitle}</b></h2>
                            <input type="text" value={this.state.inputTitle} placeholder={this.titlePlaceholder} onChange={this.onChangeTitle} />
                        </div>
                        <div className="input-sub-content">
                            <h2><b>{this.userDescription}</b></h2>
                            <input type="text" value={this.state.inputDescription} placeholder={this.descriptionPlaceholder} onChange={this.onChangeDescription} />
                        </div>
                        <div className="input-sub-content">
                            <h2><b>{this.userImage}</b></h2>
                            <input type="file" value={this.state.inputImage} onChange={this.onSelectedImageHandler} />
                        </div>
                        <div className="pop-up-button-container">
                            <Button className="pop-up-button" onClick={this.onGoBackHandler}>
                                {this.goBackText}
                            </Button>
                            <AuthContext.Consumer>
                                {context => (
                                    <>
                                        <Button className="pop-up-button" onClick={() => this.onUploadHandler.bind(this)(context.currentUser?.id)}>{this.createText}</Button>
                                    </>
                                )}
                            </AuthContext.Consumer>
                        </div>
                    </div>
                </form>
            </PopUp>
        )
    }
}