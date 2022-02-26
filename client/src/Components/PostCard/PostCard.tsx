import { useState } from "react";
import { Card } from "react-bootstrap";
import ReactDOM from "react-dom";
import CardDetails from "../Pop-ups/CardDetails";
import styles from "./PostCard.module.css";

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

const ItemGrid = (props: Props) => {
  const [showCardDetails, setShowCardDetails] = useState<boolean>(false);

  return (
    <>
      <Card className={styles.card}>
        <Card.Img variant="top" src={props.imageUrl} alt="" onClick={() => setShowCardDetails(true) } />
        <Card.Body>
          <Card.Title>{props.title}</Card.Title>
          <Card.Subtitle className={styles["card-subtitle"]}>
            <a href={props.creatorProfileUrl}>
              <img src={props.creatorProfileImageUrl} alt="" />
              <span className={styles['text-muted']}>{props.creatorUsername}</span>
            </a>
          </Card.Subtitle>
          <Card.Text className="text-end">
            <small className={styles['text-muted']}>{props.createdAt.toLocaleString('en-GB')}</small>
          </Card.Text>
        </Card.Body>
      </Card>
      {
        showCardDetails ? ReactDOM.createPortal((
          <CardDetails
            postImageURL={props.imageUrl}
            postTitle={props.title}
            postDate={props.createdAt.toLocaleString('en-GB')}
            postDescription={props.description}
            userImage={props.creatorProfileImageUrl}
            userName={props.creatorUsername}
            onClose={() => setShowCardDetails(false)}
          />
        ), document.body) : null
      }
    </>
  )
}

export default ItemGrid;