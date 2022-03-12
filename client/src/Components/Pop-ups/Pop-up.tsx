import React from 'react';
import './PopUp.css'

type Props = {
  children?: JSX.Element | JSX.Element[],
  onClose?: Function
}

export default class PopUp extends React.Component<Props>{

  onCloseHandler = () => {
    this.setState({})

    if (this.props.onClose)
      this.props.onClose()
  }

  render() {
    return (
      <div className={'background'}>
        <div className='popUpContainer'>
          <span
            className='closeButton'
            onClick={this.onCloseHandler}>&times;</span>
          {this.props.children}
        </div>
      </div>
    )
  }
}

