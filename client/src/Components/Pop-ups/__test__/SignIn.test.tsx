
import { render, unmountComponentAtNode } from "react-dom";
import { act } from 'react-dom/test-utils';
import SignInPopUp from "../SignIn";


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
    render(<SignInPopUp onClose={() =>{}} />, container);
  });
  expect(container?.textContent).toContain("Username");
  expect(container?.textContent).toContain("Password");
})
