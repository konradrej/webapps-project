import React, { useState } from 'react';
import './tempcss.css'

type Props = {
  children?: JSX.Element | JSX.Element[],

}

export default class PopUp extends React.Component<Props>{
  private showPopUp : boolean = true;

  onCloseHandler = () => {
    this.showPopUp = false;
    this.setState({})
  }

  render(){
    return(
      <div className={(this.showPopUp) ? 'background' : 'closed'}>
        <div className='popUpContainer'>
          <span className='closeButton' onClick={ this.onCloseHandler }>&times;</span>
          {this.props.children}
        </div>
      </div>
    )
  }
}

