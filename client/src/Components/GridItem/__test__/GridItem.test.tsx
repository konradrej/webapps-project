import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
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
  act(() => {
    const props = {
      user: {
        username: "Username",
        profileImageUrl: ""
      },
      post: {
        title: "Title",
        description: "Description",
        imageUrl: "",
        imageAlt: "Image Alt",
        created: "Created"
      }
    }

    render(<GridItem {...props} />, container);
  })
  expect(container?.textContent).toContain("Username");
  expect(container?.textContent).toContain("Title");
  expect(container?.textContent).toContain("Created");
})

// Really bad test, shouldn't test for contains description when
// expecting an entire component to open.
it("check if onclick on .card opens CardDetails and contains description", () => {
  act(() => {
    const props = {
      user: {
        username: "Username",
        profileImageUrl: ""
      },
      post: {
        title: "Title",
        description: "Description",
        imageUrl: "",
        imageAlt: "Image Alt",
        created: "Created"
      }
    }
    
    render(<><GridItem {...props} /><div id="popup-container"></div></>, container);
  })
  expect(container?.textContent).not.toContain("Description");

  const card : HTMLElement | null = document.querySelector(".card");
  expect(container).toContainElement(card);

  act(() => {
    card?.dispatchEvent(new MouseEvent("click", { bubbles : true }));
  })
  expect(container?.textContent).toContain("Description");
})