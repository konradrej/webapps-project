import {render as secondRender, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UpdateUserPopup from "../UpdateUser";
import axios from "axios";
import EventBus from "../../../Api/EventBus";
import {updateCurrentUser} from "../../../Api/Auth";

jest.mock("axios")
jest.mock('../../../Api/Auth');
jest.mock('../../../Api/EventBus');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("UpdateUser input values test", () => {

  test('Input of the description', () => {
    secondRender(<UpdateUserPopup onClose={() => {}}  description={""} profileImageUrl={""}/>);

    const inputEl = screen.getByTestId("description-input");
    userEvent.type(inputEl, "This is a description");

    expect(screen.getByTestId("description-input")).toHaveValue("This is a description");
    expect(inputEl).toHaveAttribute("type", "text");
  });

  test('Input of the imageURL', () => {
    secondRender(<UpdateUserPopup onClose={() => {}}  description={""} profileImageUrl={""}/>);

    const inputEl = screen.getByTestId("imageURL-input");
    userEvent.type(inputEl, "http://localhost/image");

    expect(screen.getByTestId("imageURL-input")).toHaveValue("http://localhost/image");
    expect(inputEl).toHaveAttribute("type", "text");
  });
});

test("UpdateUser emits an error if no values has changed", () => {
  const {container} = secondRender(<UpdateUserPopup onClose={() => {}}  description="" profileImageUrl="" />);

  userEvent.click(screen.getByTestId("submit-button"));
  expect(container.querySelector(".alert.alert-danger")?.textContent).toEqual("Change either image or description");
})

test("UpdateUser should fail if URL is invalid", async () => {
  const {container} = secondRender(<UpdateUserPopup onClose={() => {}}  description={""} profileImageUrl={""}/>);

  userEvent.type(screen.getByTestId("imageURL-input"), "invalid-url");
  userEvent.type(screen.getByTestId("description-input"), "hello there");
  userEvent.click(screen.getByTestId("submit-button"));

  await waitFor(() =>
      expect(container.querySelector(".alert.alert-danger")).toBeTruthy()
  )

  expect(container.querySelector(".alert.alert-danger")?.textContent).toEqual("Image error: Invalid Url");
})

test("UpdateUser should emit an error if URL is not an image", async () => {
  const {container} = secondRender(<UpdateUserPopup onClose={() => {}}  description={""} profileImageUrl={""}/>);

  userEvent.type(screen.getByTestId("imageURL-input"), "http://localhost");
  userEvent.type(screen.getByTestId("description-input"), "hello there");

  mockedAxios.head.mockResolvedValue({
    headers: {
      "content-type": "video/mp4"
    }
  });
  userEvent.click(screen.getByTestId("submit-button"));
  await waitFor(() =>
      expect(container.querySelector(".alert.alert-danger")).toBeTruthy()
  )
  expect(container.querySelector(".alert.alert-danger")?.textContent).toContain("Image error: ")
})

test("UpdateUser should emit to Eventbus if update succeeded", async () => {
  secondRender(<UpdateUserPopup onClose={() => {}}  description={""} profileImageUrl={""}/>);

  userEvent.type(screen.getByTestId("imageURL-input"), "http://localhost");
  userEvent.type(screen.getByTestId("description-input"), "hello there");

  mockedAxios.head.mockResolvedValue({
    headers: {
      "content-type": "image/png"
    }
  });

  (updateCurrentUser as jest.Mocked<any>).mockResolvedValue("");
  userEvent.click(screen.getByTestId("submit-button"));
  await waitFor(() =>
      expect(updateCurrentUser).toHaveBeenCalled()
  )
  expect(EventBus.trigger).toHaveBeenCalledTimes(1)
})
