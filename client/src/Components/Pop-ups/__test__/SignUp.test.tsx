import SignUpPopUp from "../SignUp";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from 'react-dom/test-utils';
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

it("Check the static text", () => {
  act(() =>{
    render(<SignUpPopUp onClose={() => {}} />, container);
  });
  expect(container?.textContent).toContain("Username");
  expect(container?.textContent).toContain("Password");
  expect(container?.textContent).toContain("E-mail");
})

describe("Sign up input values", () => {
 
  test('Username should be admin123', () => {
    secondRender(<SignUpPopUp onClose={() => {}} />);
 
    const inputEl = screen.getByTestId("username-input");
    userEvent.type(inputEl, "admin123");
 
    expect(screen.getByTestId("username-input")).toHaveValue("admin123");
    expect(inputEl).toHaveAttribute("type", "text");
  });

  test('Password should be password123', () => {
    secondRender(<SignUpPopUp onClose={() => {}} />);
 
    const inputEl = screen.getByTestId("password-input");
    userEvent.type(inputEl, "password123");
 
    expect(screen.getByTestId("password-input")).toHaveValue("password123");
    expect(inputEl).toHaveAttribute("type", "password");
  });

  test('Email should be test@test.com', () => {
    secondRender(<SignUpPopUp onClose={() => {}} />);
 
    const inputEl = screen.getByTestId("email-input");
    userEvent.type(inputEl, "test@test.com");
 
    expect(screen.getByTestId("email-input")).toHaveValue("test@test.com");
    expect(inputEl).toHaveAttribute("type", "email");
  });
});