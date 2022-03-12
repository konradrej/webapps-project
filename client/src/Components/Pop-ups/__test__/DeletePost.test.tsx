import DeletePostPopup from '../DeletePost';
import {render as secondRender, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventBus from "../../../Api/EventBus";
import {deletePost} from "../../../Api/Posts";

jest.mock('../../../Api/Posts');
jest.mock('../../../Api/EventBus');

test("DeletePost should emit to Eventbus if update succeeded", async () => {
  secondRender(<DeletePostPopup onClose={() => {}}  postId={1}/>);

  (deletePost as jest.Mocked<any>).mockResolvedValue("123");
  userEvent.click(screen.getByTestId("submit-button"));
  await waitFor(() =>
      expect(deletePost).toHaveBeenCalled()
  )
  expect(EventBus.trigger).toHaveBeenCalledTimes(1)
})


test("DeletePost should show error message if update failed", async () => {
  const {container} = secondRender(<DeletePostPopup onClose={() => {}}  postId={1}/>);

  (deletePost as jest.Mocked<any>).mockRejectedValue(new Error("Mock failure"))
  userEvent.click(screen.getByTestId("submit-button"));
  await waitFor(() =>
      expect(deletePost).toHaveBeenCalled()
  )
  expect(container.querySelector(".alert.alert-danger")?.textContent).toEqual("Mock failure")
})

test("Close DeletePost popup", async () => {
  let popUpClose : boolean = false;
  secondRender(<DeletePostPopup onClose={() => {popUpClose = true}}  postId={1}/>);
  userEvent.click(screen.getByTestId("cancel-button"));
  expect(popUpClose).toBe(true);
})