import SignUpPopUp from "../SignUp";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from 'react-dom/test-utils';


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

it("Check the static text", () => {
  act(() =>{
    render(<SignUpPopUp/>, container);
  });
  expect(container?.textContent).toContain("Username");
  expect(container?.textContent).toContain("Password");
  expect(container?.textContent).toContain("E-mail");
})
