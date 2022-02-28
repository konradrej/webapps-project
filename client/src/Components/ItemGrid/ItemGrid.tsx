import Masonry from "react-masonry-css";
import styles from "./ItemGrid.module.css";

export type Props = {
  items: JSX.Element[], 
  breakpointColumns?: { default : number, [key : number] : number }
}

const breakpointColumns = {
  default: 4,
  1400: 3,
  768: 2,
  576: 1
}

const ItemGrid = (props: Props) => {
  return (
    <>
      <Masonry
        breakpointCols={props.breakpointColumns ?? breakpointColumns}
        className={styles["grid"]}
        columnClassName={styles["grid-column"]}
      >
        {
          props.items.map((item: any, _: number) => {
            return item;
          })
        }   
      </Masonry>
      {props.items.length === 0 ? <div style={{textAlign: "center"}}>No items to display.</div> : null}
    </>
  )
}

export default ItemGrid;