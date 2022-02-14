import React from "react";
import { Card } from "react-bootstrap";
import CardDetails from "../CardDetails";
import styles from "./GridItem.module.css";

export type Props = {
  user: {
    username: string,
    profileImageUrl: string
  },
  post: {
    title: string,
    description: string,
    imageUrl: string,
    imageAlt: string,
    created: string
  }
}

export default class GridItem extends React.Component<Props>{
  state = {
    showCardDetails: false
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
        <Card className={styles.card} onClick={ this.onClickHandler }>
          <Card.Img variant="top" src={this.props.post.imageUrl} alt={this.props.post.imageAlt} />
          <Card.Body>
            <Card.Title>{this.props.post.title}</Card.Title>
            <Card.Subtitle className={styles["card-subtitle"]}>
              <img src={this.props.user.profileImageUrl} alt="" />
              <span className={styles['text-muted']}>{this.props.user.username}</span>
            </Card.Subtitle>
            <Card.Text className="text-end">
              <small className={styles['text-muted']}>{this.props.post.created}</small>
            </Card.Text>
          </Card.Body>
        </Card>
        {
          this.state.showCardDetails ? 
            <CardDetails
              postImageURL={this.props.post.imageUrl}
              postTitle={this.props.post.title}
              postDate={this.props.post.created}
              postDescription={this.props.post.description}
              userImage={this.props.user.profileImageUrl}
              userName={this.props.user.username}
              onClose={ this.onClose }
            />
            : null
        }
      </>
    )
  }
}