import React, { ReactElement } from "react";
import GridItem, { Props as GridItemProps } from "../GridItem/GridItem";
import Masonry from "react-masonry-css";
import styles from "./ItemGrid.module.css";

export type Props = {
  posts : GridItemProps[],
  breakpointColumns? : { default : number, [key : number] : number }
}

type State = {
  items: ReactElement[]
}

const breakpointColumns = {
  default: 6,
  1400: 4,
  992: 3,
  768: 2,
  576: 1
}

export default class ItemGrid extends React.Component<Props>{
  state: State = {
    items: []
  }

  constructor(props: Props) {
    super(props);

    this.createItems();
  }

  createItems = (): void => {
    const items: JSX.Element[] = [];

    this.props.posts.map((post: any, i: number) => {
      items.push(<GridItem key={i} {...post} />);
    })

    this.setState({items: items});
  }

  componentDidUpdate(prevProps: Props) {
    if(this.props.posts != prevProps.posts){
      this.createItems();
    }
  }

  render() : JSX.Element {
    return (
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
    )
  }
}