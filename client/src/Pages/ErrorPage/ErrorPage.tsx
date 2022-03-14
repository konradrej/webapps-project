/**
 * Error page component, displays an error message.
 */

import React from "react";

export type Props = {

}

export default class ErrorPage extends React.Component<Props>{
  render() {
    return (
      <h2 style={{ textAlign: "center", marginTop: "20%" }}>
        The resource could not be found.
      </h2>
    )
  }
}