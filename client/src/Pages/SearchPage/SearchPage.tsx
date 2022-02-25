import { useEffect, useMemo, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import ItemGrid from "../../Components/ItemGrid/ItemGrid";
import styles from "./SearchPage.module.css";
import PopUp from "../../Components/Pop-ups/Pop-up";
import { useLocation } from "react-router-dom";
import { searchPosts } from "../../Api/Posts";
import { Props as GridItemProps } from "../../Components/GridItem/GridItem";

export type Props = {
  
}

const SearchPage = (_: Props) => {
  const { search } = useLocation();
  const searchQuery = useMemo(() => new URLSearchParams(search), [search])

  const [searchResult, setSearchResult] = useState<GridItemProps[]>([]);
  const [errorPopup, setErrorPopup] = useState<boolean>(false);

  useEffect(() => {
    setErrorPopup(false);

    searchPosts(searchQuery.get("search") ?? "").then((posts: GridItemProps[]) => {
      setSearchResult(posts);
    }).catch((e: any) => {
      setErrorPopup(true);
    })
  }, [searchQuery])

  return (
    <>
      <Container>
        {searchResult == null ?
        <Spinner className={styles.spinner} animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        :
        <ItemGrid posts={searchResult} />
        }
      </Container>
      {errorPopup ?
        <PopUp onClose={() => {setErrorPopup(false)}}>
          <span>Unable to get posts.</span>
          <br />
          <span>Please try again later.</span>
        </PopUp> : null
      }
    </>
  );
}

export default SearchPage;