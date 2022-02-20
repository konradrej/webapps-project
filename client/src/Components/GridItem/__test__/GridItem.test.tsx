import { render, unmountComponentAtNode } from "react-dom";
import { act, findRenderedComponentWithType, isElement, isElementOfType } from "react-dom/test-utils";
import CardDetailsPopUp from "../../Pop-ups/CardDetails";
import GridItem from "../GridItem";

let container : HTMLElement | null = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
})

afterEach(() => {
  if(container)
    unmountComponentAtNode(container);

  container?.remove();
  container = null;
})

it("expect component to display provided information", () => {
  const props = {
    id: 0,
    title: "Title",
    description: "Description",
    imageUrl: "https://via.placeholder.com/150x250",
    createdAt: new Date(),
    creatorUsername: "Username",
    creatorProfileUrl: "",
    creatorProfileImageUrl: "https://via.placeholder.com/150"
  }

  act(() => {

    render(<GridItem {...props} />, container);
  })
  expect(container?.textContent).toContain("Username");
  expect(container?.textContent).toContain("Title");
  expect(container?.textContent).toContain(props.createdAt.toLocaleString("en-gb"));
})

// Really bad test, shouldn't test for contains description when
// expecting an entire component to open.
it("check if onclick on .card opens CardDetails and contains description", () => {
  act(() => {
    const props = {
      id: 0,
      title: "Title",
      description: "Description",
      imageUrl: "https://via.placeholder.com/150x250",
      createdAt: new Date(),
      creatorUsername: "Username",
      creatorProfileUrl: "",
      creatorProfileImageUrl: "https://via.placeholder.com/150"
    }
    
    render(<><GridItem {...props} /><div id="popup-container"></div></>, container);
  })
  expect(document.body.textContent).not.toContain("Description");

  const cardImgTop : HTMLElement | null = document.querySelector(".card-img-top");
  expect(container).toContainElement(cardImgTop);

  act(() => {
    cardImgTop?.dispatchEvent(new MouseEvent("click", { bubbles : true }));
  })
  expect(document.body.textContent).toContain("Description");
})