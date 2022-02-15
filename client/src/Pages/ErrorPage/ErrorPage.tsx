import React from "react";
import Header from "../../Components/Header";

export type Props = {
  
}

export default class ErrorPage extends React.Component<Props>{
  render(){
    return (
      <>
        <Header></Header>
        <h2 style={{textAlign: "center", marginTop: "20%"}}>The resource could not be found.</h2>
      </>
    )
  }
}