/**
 * Provides a simple dropdown for selecting post ordering.
 */

import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { BsSortDown, BsSortAlphaDown, BsSortAlphaUp } from "react-icons/bs";

export type Props = {
  className?: string,
  onSelect?: Function,
  sortOptions?: {
    selectedOption: string,
    options: { icon: JSX.Element, type: string, text: string }[]
  }
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
    selectedOption: (this.props.sortOptions?.selectedOption ?? options[0].type)
  }

  onSelect = (eventKey: any): void => {
    const type = eventKey.substring(eventKey.lastIndexOf("/") + 1);

    this.setState({ selectedOption: type })

    if (this.props.onSelect)
      this.props.onSelect(type);
  }

  render(): JSX.Element {
    return (
      <DropdownButton id="dropdown-basic-button" title="Sort by" className={this.props.className} onSelect={this.onSelect}>
        {
          (this.props.sortOptions?.options ?? options).map((option, i) => {
            return <Dropdown.Item key={"#/sort/" + option.type} href={"#/sort/" + option.type} active={this.state.selectedOption === option.type}>{option.icon} {option.text}</Dropdown.Item>
          })
        }
      </DropdownButton>
    )
  }
}