import React from "react";
import GridItem, { Props as GridItemProps } from "../GridItem/GridItem";
import SortSelector from "../SortSelector/SortSelector";
import Masonry from "react-masonry-css";
import styles from "./ItemGrid.module.css";

export type Props = {
  posts : GridItemProps[],
  breakpointColumns? : { default : number, [key : number] : number }
}

const breakpointColumns = {
  default: 6,
  1400: 4,
  992: 3,
  768: 2,
  576: 1
}

export default class ItemGrid extends React.Component<Props>{
  render() : JSX.Element {
    return (
      <>
        <SortSelector className={styles.selector + " text-end "} />
        <Masonry
          breakpointCols={this.props.breakpointColumns ?? breakpointColumns}
          className={styles["grid"]}
          columnClassName={styles["grid-column"]}
        >
          {
            this.props.posts.map((post, i) => {
              return <GridItem key={i} {...post} />;
            })
          }   
        </Masonry>
      </>
    )
  }
}