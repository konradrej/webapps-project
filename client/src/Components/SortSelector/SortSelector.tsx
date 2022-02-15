import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { BsSortDown, BsSortAlphaDown, BsSortAlphaUp } from "react-icons/bs";

export type Props = {
  className? : string,
  onSelect? : Function
}

const options = [
  {
    icon: <BsSortDown />,
    type: "recent-descending",
    text: "Recent"
  },
  {
    icon: <BsSortAlphaDown />,
    type: "title-ascending",
    text: "Title (A-Z)"
  },
  {
    icon: <BsSortAlphaUp />,
    type: "title-descending",
    text: "Title (Z-A)"
  },
]

export default class SortSelector extends React.Component<Props>{
  state = {
    selectedOption: "recent-descending"
  }

  onSelect = (eventKey: any, event: Object) : void => {
    this.setState({selectedOption: eventKey.substring(eventKey.lastIndexOf("/") + 1)})

    if(this.props.onSelect)
      this.props.onSelect();
  }

  render() : JSX.Element {
    return (
      <DropdownButton id="dropdown-basic-button" title="Sort by" className={this.props.className} onSelect={this.onSelect}>
        {
          options.map((post, i) => {
            return <Dropdown.Item key={"#/sort/" + post.type} href={"#/sort/" + post.type} active={this.state.selectedOption === post.type}>{post.icon} {post.text}</Dropdown.Item>
          })
        }
      </DropdownButton>
    )
  }
}