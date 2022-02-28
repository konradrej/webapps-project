
import { render, unmountComponentAtNode } from "react-dom";
import { act } from 'react-dom/test-utils';
import CardDetailsPopUp from '../CardDetails';

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

it("CardDetails with text inputs matching ", () => {
  act(() =>{
    render(<CardDetailsPopUp postId={1} postDate="12-12-2022" postDescription="Lorem Ipsum" postImageURL="img.jpeg" postTitle="A Title" userImage="profile.jpeg" userName="user"/>, container);
  });
  expect(container?.textContent).toContain("12-12-2022");
  expect(container?.textContent).toContain("Lorem Ipsum");
  expect(container?.textContent).toContain("A Title");
  expect(container?.textContent).toContain("user");
})
