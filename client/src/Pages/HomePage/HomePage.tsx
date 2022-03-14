/**
 * Home page component, retrieves posts according to sort
 * type and displays the retrieved posts.
 */

import React from "react";
import Container from "react-bootstrap/Container";
import ItemGrid from "../../Components/ItemGrid/ItemGrid";
import SortSelector from "../../Components/SortSelector/SortSelector";
import styles from "./HomePage.module.css";
import PopUp from "../../Components/Pop-ups/Pop-up";
import { getPosts } from "../../Api/Posts";
import EventBus from "../../Api/EventBus";

export type Props = {
  
}

type State = {
  items: JSX.Element[],
  errorPopup?: JSX.Element,
  eventKey: string
}

export default class HomePage extends React.Component<Props>{
  state: State = {
    items: [],
    errorPopup: undefined,
    eventKey: ""
  }
  eventListeners: {[event: string] : number} = {};

  getPosts = async (order?: string): Promise<void> => {
    getPosts(order ?? "").then((items: JSX.Element[]) => {
      this.setState({
        items: items
      });
    }).catch((e: any) => {
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
    this.setState({eventKey: eventKey})
    this.getPosts(eventKey);
  }

  componentDidMount() {
    this.getPosts(this.state.eventKey);
    this.eventListeners["REFRESH_POSTS"] = EventBus.addListener("REFRESH_POSTS", () => this.getPosts(this.state.eventKey));
  }

  componentWillUnmount() {
    EventBus.removeListener("REFRESH_POSTS", this.eventListeners["REFRESH_POSTS"])
  }

  render() {
    return (
      <>
        <Container>
          <SortSelector className={styles.selector + " text-end "} onSelect={this.onSelect}/>
          <ItemGrid items={this.state.items} />
        </Container>
        {this.state.errorPopup ?? null}
      </>
    )
  }
}