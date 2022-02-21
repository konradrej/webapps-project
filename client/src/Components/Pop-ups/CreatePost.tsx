import { read } from 'fs';
import React from 'react';
import { Button } from 'react-bootstrap';
import PopUp from './Pop-up';
import './PopUp.css'
import axios from 'axios'

type Props = {
    onClose?: Function,
}


export default class CreatePostPopUp extends React.Component<Props>{

    private createText: string = "Create";
    private goBackText: string = "Go back";
    private userPostTitle: string = "Title";
    private userDescription: string = "Description";
    private userImage: string = "Add your image";
    private titlePlaceholder: string = "Add your title";
    private descriptionPlaceholder: string = "Tell everyone what your picture is about";
    private imagePlaceholder: string = "Add your image";

    state = {
        inputPostTitle: "",
        inputDescription: "",
        inputImage: "",
    }

    onChangePostTitle = (e: React.FormEvent<HTMLInputElement>): void => {
        this.setState({ inputPostTitle: e.currentTarget.value });
    };

    onChangeDescription = (e: React.FormEvent<HTMLInputElement>): void => {
        this.setState({ inputDescription: e.currentTarget.value });
    };

    onChangeSelectedImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.currentTarget as HTMLInputElement;
        const file = target.files![0];
        //this.setState({ inputImage: file })
        console.log(e.target.files![0]);


    };

    onFileUploadHandler = async () => {
        const fd = new FormData();
        //fd.append('image', this.state.inputImage, this.state.inputImage)
        axios.post('', fd);
    }

    onGoBackHandler = () => {
    }



    render() {
        return (
            <PopUp onClose={this.props.onClose}>
                <form className="form-pop-up">
                    <div className="input-content">
                        <div className="input-sub-content">
                            <h2><b>{this.userPostTitle}</b></h2>
                            <input type="text" value={this.state.inputPostTitle} placeholder={this.titlePlaceholder} onChange={this.onChangePostTitle} />
                        </div>
                        <div className="input-sub-content">
                            <h2><b>{this.userDescription}</b></h2>
                            <input type="text" value={this.state.inputDescription} placeholder={this.descriptionPlaceholder} onChange={this.onChangeDescription} />
                        </div>
                        <div className="input-sub-content">
                            <h2><b>{this.userImage}</b></h2>
                            <input type="file" value={this.state.inputImage} placeholder={this.imagePlaceholder} onChange={this.onChangeSelectedImage} />
                        </div>
                        <div className="pop-up-button-container">
                            <Button className="pop-up-button" onClick={this.onGoBackHandler}>
                                {this.goBackText}
                            </Button>
                            <Button className="pop-up-button" onClick={this.onFileUploadHandler}>
                                {this.createText}
                            </Button>
                        </div>
                    </div>
                </form>
            </PopUp>
        )
    }
}