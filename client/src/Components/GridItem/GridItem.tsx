import React from 'react';
import { Card } from "react-bootstrap";
import styles from "./GridItem.module.css";

type Props = {
  user: {
    username: string,
    imageUrl: string
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
  render(){
    return (
      <Card className={styles.card}>
        <Card.Img variant="top" src={this.props.post.imageUrl} alt={this.props.post.imageAlt} />
        <Card.Body>
          <Card.Title>{this.props.post.title}</Card.Title>
          <Card.Subtitle className={styles["card-subtitle"]}>
            <img src={this.props.user.imageUrl} alt="" />
            <span className={styles['text-muted']}>{this.props.user.username}</span>
          </Card.Subtitle>
          <Card.Text className="text-end">
            <small className={styles['text-muted']}>{this.props.post.created}</small>
          </Card.Text>
        </Card.Body>
      </Card>
    )
  }
}

