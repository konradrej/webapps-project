import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import styles from "./Profile.module.css";
import ItemGrid from "../../Components/ItemGrid/ItemGrid";

export default function ProfilePage() {
  let {userID} = useParams()
  const [user, setUser] = useState<any>(null);
  const [msg, setMsg] = useState<any>("");

  // On user-id update, query new
  useEffect(() => {
    setUser(null);
    setMsg("Loading...");

    axios.get(process.env.REACT_APP_BASE_API_URL+"/user/show/" + userID)
        .then(
            (ret) => {
              const user = ret.data;
              setUser(user)
            }, (err) => {
              console.error(err)
              setMsg(err.toString())
            });

  }, [userID]);

  return (
      <div>
        {user ?
            profile(user) :
            <h2 style={{textAlign: "center", marginTop: "20%"}}>{msg}</h2>
        }
      </div>
  );
}

function profile(user: any) {
  return (
      <div className="container">
        <div className={"row " + styles["content"]}>
          <div className="col-xl-12">
            <div className={styles["header-container"]}>
              <img src={user.profileImageUrl ? user.profileImageUrl : "https://via.placeholder.com/100"} alt="profile"/>
              <h2>{user.username}</h2>
              <button className="btn btn-success" type="submit">Message</button>
              <p>{user.description}</p>
            </div>
          </div>
          <div className="row g-0">
            <ItemGrid posts={user.posts}/>
          </div>
        </div>
      </div>
  )
}
