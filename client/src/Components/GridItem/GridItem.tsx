import React from "react";
import { Card } from "react-bootstrap";
import ReactDOM from "react-dom";
import CardDetails from "../CardDetails";
import styles from "./GridItem.module.css";

export type Props = {
  id: number,
  title: string,
  description: string,
  imageUrl: string,
  createdAt: Date,
  creatorUsername: string,
  creatorProfileUrl: string,
  creatorProfileImageUrl: string
}

type State = {
  showCardDetails: boolean
}

export default class GridItem extends React.Component<Props>{
  state : State = {
    showCardDetails: false,
  }

  onClickHandler = () : void => {
    this.setState({showCardDetails: true});
  }

  onClose = () : void => {
    this.setState({showCardDetails: false});
  }

  render() : JSX.Element {
    return (
      <>
        <Card className={styles.card}>
          <Card.Img variant="top" src={this.props.imageUrl} alt="" onClick={ this.onClickHandler } />
          <Card.Body>
            <Card.Title>{this.props.title}</Card.Title>
            <Card.Subtitle className={styles["card-subtitle"]}>
              <a href={this.props.creatorProfileUrl}>
                <img src={this.props.creatorProfileImageUrl} alt="" />
                <span className={styles['text-muted']}>{this.props.creatorUsername}</span>
              </a>
            </Card.Subtitle>
            <Card.Text className="text-end">
              <small className={styles['text-muted']}>{this.props.createdAt.toLocaleString('en-GB')}</small>
            </Card.Text>
          </Card.Body>
        </Card>
        {
          this.state.showCardDetails ? ReactDOM.createPortal((
            <CardDetails
              postImageURL={this.props.imageUrl}
              postTitle={this.props.title}
              postDate={this.props.createdAt.toLocaleString('en-GB')}
              postDescription={this.props.description}
              userImage={this.props.creatorProfileImageUrl}
              userName={this.props.creatorUsername}
              onClose={ this.onClose }
            />
          ), document.body) : null
        }
      </>
    )
  }
}