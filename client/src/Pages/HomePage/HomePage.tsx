import React from "react";
import Container from "react-bootstrap/Container";
import ItemGrid from "../../Components/ItemGrid/ItemGrid";
import SortSelector from "../../Components/SortSelector/SortSelector";
import { Props as GridItemProps } from "../../Components/GridItem/GridItem";
import Header from "../../Components/Header";
import axios from "axios";
import styles from "./HomePage.module.css";
import PopUp from "../../Components/Pop-ups/Pop-up";

export type Props = {
  
}

type State = {
  posts: GridItemProps[],
  errorPopup?: JSX.Element
}

export default class HomePage extends React.Component<Props>{
  state: State = {
    posts: [],
    errorPopup: undefined
  }

  getPosts = (order?: string): void => {
    let url: string = "http://localhost:8080/post/";

    axios.get(url, {timeout: 1000, params: {order: order}}).then((res) => {
      res.data.map((value : any, _ : number) => {
        value.createdAt = new Date(value.createdAt);
      });

      this.setState({
        posts: res.data
      });
    }).catch((error) => {
      this.setState({
        errorPopup: <PopUp onClose={this.onClose}><span>Unable to get posts.</span><br /><span>Please try again later.</span></PopUp>
      });
    })
  }

  onClose = (): void => {
    this.setState({
      errorPopup: undefined
    });
  }

  onSelect = (eventKey: string): void => {
    this.getPosts(eventKey);
  }

  componentDidMount() {
    this.getPosts();
  }
 
  render() {
    return (
      <>
        <Header />
        <Container>
          <SortSelector className={styles.selector + " text-end "} onSelect={this.onSelect}/>
          <ItemGrid posts={this.state.posts} />
        </Container>
        {this.state.errorPopup ?? null}
      </>
    )
  }
}