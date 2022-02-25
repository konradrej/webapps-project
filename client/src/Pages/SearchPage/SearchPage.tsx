import { useEffect, useMemo, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import ItemGrid from "../../Components/ItemGrid/ItemGrid";
import styles from "./SearchPage.module.css";
import axios, { AxiosResponse } from "axios";
import PopUp from "../../Components/Pop-ups/Pop-up";
import { useLocation } from "react-router-dom";

export type Props = {
  
}

const SearchPage = (_: Props) => {
  const { search } = useLocation();
  const searchQuery = useMemo(() => new URLSearchParams(search), [search])

  const [searchResult, setSearchResult] = useState(null);
  const [errorPopup, setErrorPopup] = useState(false);

  useEffect(() => {
    setErrorPopup(false);

    axios.get("http://localhost:8080/post/search/", {params: {search: searchQuery.get("search")}}).then((res: AxiosResponse) => {
      res.data.map((value : any, _ : number) => {
        value.createdAt = new Date(value.createdAt);
      });

      setSearchResult(res.data);
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