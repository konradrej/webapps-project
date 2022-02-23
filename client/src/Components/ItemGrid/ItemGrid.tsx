import React from "react";
import GridItem, { Props as GridItemProps } from "../GridItem/GridItem";
import Masonry from "react-masonry-css";
import styles from "./ItemGrid.module.css";

export type Props = {
  posts : GridItemProps[],
  breakpointColumns? : { default : number, [key : number] : number }
}

type State = {
  items: JSX.Element[]
}

const breakpointColumns = {
  default: 4,
  1400: 3,
  768: 2,
  576: 1
}

export default class ItemGrid extends React.Component<Props>{
  state: State = {
    items: []
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      items: this.createItems()
    };
  }

  createItems = (): State["items"] => {
    const items: JSX.Element[] = [];

    this.props.posts.map((post: any, i: number) => {
      items.push(<GridItem key={i} {...post} />);
    })

    return items;
  }

  componentDidUpdate(prevProps: Props) {
    if(this.props.posts != prevProps.posts){
      this.setState({
        items: this.createItems()
      });
    }
  }

  render() : JSX.Element {
    return (
      <>
        <Masonry
          breakpointCols={this.props.breakpointColumns ?? breakpointColumns}
          className={styles["grid"]}
          columnClassName={styles["grid-column"]}
        >
          {
            this.state.items.map((item: any, _: number) => {
              return item;
            })
          }   
        </Masonry>
        {this.state.items.length == 0 ? <div style={{textAlign: "center"}}>No items to display.</div> : null}
      </>
    )
  }
}