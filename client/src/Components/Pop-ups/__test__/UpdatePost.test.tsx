import UpdatePostPopUp from '../UpdatePost';
import { render as secondRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe("Update post input values", () => {
 
  test('Input of the title', () => {
    secondRender(<UpdatePostPopUp postId={1} onClose={() => {}} />);
 
    const inputEl = screen.getByTestId("title-input");
    userEvent.type(inputEl, "This is a title");
 
    expect(screen.getByTestId("title-input")).toHaveValue("This is a title");
    expect(inputEl).toHaveAttribute("type", "text");
  });

  test('Input of the description', () => {
    secondRender(<UpdatePostPopUp postId={1} onClose={() => {}} />);
 
    const inputEl = screen.getByTestId("description-input");
    userEvent.type(inputEl, "This is a description");
 
    expect(screen.getByTestId("description-input")).toHaveValue("This is a description");
    expect(inputEl).toHaveAttribute("type", "text");
  }); 
});