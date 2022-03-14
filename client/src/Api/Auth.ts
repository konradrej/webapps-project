/**
 * Functions for auth related api calls.
 */

import axios from "axios";

export const getCurrentUser = async function (): Promise<Object | null> {
  let ret = await axios.get(process.env.REACT_APP_BASE_API_URL + "/user/session", {withCredentials: true});
  if (ret.status !== 200) {
    return null;
  }
  return ret.data;
}

export const updateCurrentUser = async function(changes: {imageUrl?: string, description?: string}): Promise<any>{
  if(changes.imageUrl || changes.description) {
    let ret = await axios.put(process.env.REACT_APP_BASE_API_URL + "/user/update", {
      profileImageUrl: changes.imageUrl,
      description: changes.description,
    }, {withCredentials: true});

    if (ret.status !== 200) {
      return null;
    }

    return ret.data;
  }
  throw Error("Must either set Image Url or Description")
}

export const signupUser = async function (username: string, password: string, email: string): Promise<Object | null> {
  let ret = await axios.post(process.env.REACT_APP_BASE_API_URL + "/user/sign-up", {
    username: username,
    password: password,
    email: email
  }, {withCredentials: true});

  if (ret.status == 201) {
    let user = await getCurrentUser();
    if (user != null) {
      return user;
    }
  }

  return null;
}

export const loginUser = async function (username: string, password: string): Promise<Object | null> {
  let ret = await axios.post(process.env.REACT_APP_BASE_API_URL + "/user/login", {
    username: username,
    password: password
  }, {withCredentials: true});

  if (ret.status == 200) {
    let user = await getCurrentUser();
    if (user != null) {
      return user;
    }
  }

  return null;
}

export const logoutUser = async function (): Promise<boolean> {
  let ret = await axios.post(process.env.REACT_APP_BASE_API_URL + "/user/logout", {}, {withCredentials: true});

  return ret.status === 200;
}