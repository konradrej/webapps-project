import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Profile.module.css";
import ItemGrid from "../../Components/ItemGrid/ItemGrid";
import { showUser } from "../../Api/User";
import { createItems } from "../../Api/Posts";
import EventBus from "../../Api/EventBus";
import { AuthContext } from "../../AuthContext";
import { Button } from "react-bootstrap";
import UpdateUserPopup from "../../Components/Pop-ups/UpdateUser";

export default function ProfilePage() {
  let { userID } = useParams()
  const userContext = useContext(AuthContext);
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any>(null);
  const [msg, setMsg] = useState<any>("");
  const [editPopup, setEditPopup] = useState<boolean>(false);

  function getUserInformation() {
    if (userID) {
      showUser(parseInt(userID))
        .then(
          (data) => {
            setUser(data.user)
            setPosts(createItems(data.posts))
          }, (err) => {
            console.error(err)
            setMsg(err.toString())
          });
    }
  }

  // On user-id update, query new
  useEffect(() => {
    setUser(null);
    setMsg("Loading...");
    setPosts([])

    let eventListenerId = EventBus.addListener("REFRESH_POSTS", () => getUserInformation());
    getUserInformation()
    return () => {
      EventBus.removeListener("REFRESH_POSTS", eventListenerId)
    }
  }, [userID]);

  return (
    <div>
      {(editPopup) ? <UpdateUserPopup description={user.description} profileImageUrl={user.profileImageUrl} onClose={() => setEditPopup(false)} /> : null}
      {user ?
        <div className="container">
          <div className={"row " + styles["content"]}>
            <div className="col-xl-12">
              <div className={styles["header-container"]}>
                <img src={user.profileImageUrl ? user.profileImageUrl : ""} alt="profile" />
                <h2>{user.username}</h2>
                {userContext.currentUser?.id == userID ?
                  <Button onClick={() => setEditPopup(true)} className="me-2" variant="success">Edit</Button>
                  : ""
                }
                <p>{user.description}</p>
                <hr />
              </div>
            </div>
            <div className="row g-0">
              <ItemGrid items={posts} />
            </div>
          </div>
        </div>
        : <h2 style={{ textAlign: "center", marginTop: "20%" }}>{msg}</h2>
      }
    </div>
  );
}
