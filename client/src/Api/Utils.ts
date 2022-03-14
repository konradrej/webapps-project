/**
 * A variety of utility functions.
 */

import axios from "axios";

/**
 * Checks that the URL is valid image.
 * @param inputUrl
 * @returns { status: boolean, message: string } - status is the validation status. Message is only non-empty if status failed.
 */
export async function validateImage(inputUrl: string): Promise<{ status: boolean, message: string }> {
  let returnObj = {
    message: "",
    status: false,
  };

  try {
    let url = new URL(inputUrl);
    let res = await axios.head(url.toString());
    if (res.headers["content-type"].startsWith("image/")) {
      returnObj.status = true;
    } else {
      returnObj.message = "Provided URL is not an image";
    }
  } catch (err) {
    returnObj.message = "Invalid Url";
  }

  return returnObj;
}