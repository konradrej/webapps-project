import { render, unmountComponentAtNode } from "react-dom";
import { act } from 'react-dom/test-utils';
import SignInPopUp from "../SignIn";
import { render as secondRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


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


describe("Sign in input values", () => {
 
  test('username should be admin123', () => {
    secondRender(<SignInPopUp onClose={() => {}} />);
 
    const inputEl = screen.getByTestId("username-input");
    userEvent.type(inputEl, "admin123");
 
    expect(screen.getByTestId("username-input")).toHaveValue("admin123");
    expect(inputEl).toHaveAttribute("type", "text");
  });

  test('Password shoueld be password123', () => {
    secondRender(<SignInPopUp onClose={() => {}} />);
 
    const inputEl = screen.getByTestId("password-input");
    userEvent.type(inputEl, "password123");
 
    expect(screen.getByTestId("password-input")).toHaveValue("password123");
    expect(inputEl).toHaveAttribute("type", "password");
  }); 
});