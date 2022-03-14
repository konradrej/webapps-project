import SignInPopUp from "../SignIn";
import { render as secondRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';


describe("Sign in input values", () => {

  test('username should be admin123', () => {
    secondRender(<SignInPopUp onClose={() => { }} />);

    const inputEl = screen.getByTestId("username-input");
    userEvent.type(inputEl, "admin123");

    expect(screen.getByTestId("username-input")).toHaveValue("admin123");
    expect(inputEl).toHaveAttribute("type", "text");
  });

  test('Password should be password123', () => {
    secondRender(<SignInPopUp onClose={() => { }} />);

    const inputEl = screen.getByTestId("password-input");
    userEvent.type(inputEl, "password123");

    expect(screen.getByTestId("password-input")).toHaveValue("password123");
    expect(inputEl).toHaveAttribute("type", "password");
  });
});