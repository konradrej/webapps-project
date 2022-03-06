import axios from "axios";
import {User} from "./Auth";

export const showUser = async function (id: number): Promise<{ user: User, posts: any[] }> {
  let ret = await axios.get(process.env.REACT_APP_BASE_API_URL + "/user/"+id);
  if(!ret.data.user || !ret.data.posts){
    throw Error("Failed to retrieve user information!")
  }
  return ret.data;
}
