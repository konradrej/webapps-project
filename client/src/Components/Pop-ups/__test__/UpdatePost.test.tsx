import UpdatePostPopUp from '../UpdatePost';
import {render as secondRender, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventBus from "../../../Api/EventBus";
import {updatePost} from "../../../Api/Posts";

jest.mock('../../../Api/Posts');
jest.mock('../../../Api/EventBus');

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

test("UpdatePost should emit to Eventbus if update succeeded", async () => {
  secondRender(<UpdatePostPopUp onClose={() => {}}  postId={1}/>);

  userEvent.type(screen.getByTestId("title-input"), "Title");
  userEvent.type(screen.getByTestId("description-input"), "new post description");

  (updatePost as jest.Mocked<any>).mockResolvedValue("123");
  userEvent.click(screen.getByTestId("submit-button"));
  await waitFor(() =>
      expect(updatePost).toHaveBeenCalled()
  )
  expect(EventBus.trigger).toHaveBeenCalledTimes(1)
})


test("UpdatePost should show error message if update failed", async () => {
  const {container} = secondRender(<UpdatePostPopUp onClose={() => {}}  postId={1}/>);

  userEvent.type(screen.getByTestId("title-input"), "Title");
  userEvent.type(screen.getByTestId("description-input"), "new post description");

  (updatePost as jest.Mocked<any>).mockRejectedValue(new Error("Mock failure"))
  userEvent.click(screen.getByTestId("submit-button"));
  await waitFor(() =>
      expect(updatePost).toHaveBeenCalled()
  )
  expect(container.querySelector(".alert.alert-danger")?.textContent).toEqual("Mock failure")
})


test("Close UpdatePost popup", async () => {
  let popUpClose : boolean = false;
  secondRender(<UpdatePostPopUp onClose={() => {popUpClose = true}}  postId={1}/>);
  userEvent.click(screen.getByTestId("cancel-button"));
  expect(popUpClose).toBe(true);
})
