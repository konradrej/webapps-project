import {render as secondRender, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePostPopUp from "../CreatePost";
import axios from "axios";
import EventBus from "../../../Api/EventBus";
import {createPost} from "../../../Api/Posts";

jest.mock("axios")
jest.mock('../../../Api/Posts');
jest.mock('../../../Api/EventBus');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Create post input values", () => {

  test('Input of the title', () => {
    secondRender(<CreatePostPopUp onClose={() => {}} />);

    const inputEl = screen.getByTestId("title-input");
    userEvent.type(inputEl, "This is a title");

    expect(screen.getByTestId("title-input")).toHaveValue("This is a title");
    expect(inputEl).toHaveAttribute("type", "text");
  });

  test('Input of the description', () => {
    secondRender(<CreatePostPopUp onClose={() => {}} />);

    const inputEl = screen.getByTestId("description-input");
    userEvent.type(inputEl, "This is a description");

    expect(screen.getByTestId("description-input")).toHaveValue("This is a description");
    expect(inputEl).toHaveAttribute("type", "text");
  });

  test('Input of the imageUrl', () => {
    secondRender(<CreatePostPopUp onClose={() => {}} />);

    const inputEl = screen.getByTestId("imageURL-input");
    userEvent.type(inputEl, "http://localhost/image");

    expect(screen.getByTestId("imageURL-input")).toHaveValue("http://localhost/image");
    expect(inputEl).toHaveAttribute("type", "text");
  });
});


test("CreatePost emits an error if one of the inputs are empty", () => {
  const {container} = secondRender(<CreatePostPopUp onClose={() => {}} />);

  userEvent.paste(screen.getByTestId("title-input"), "");
  userEvent.type(screen.getByTestId("description-input"), "hello there");
  userEvent.type(screen.getByTestId("imageURL-input"), "https://example.com/image");
  userEvent.click(screen.getByTestId("submit-button"));

  expect(container.querySelector(".alert.alert-danger")?.textContent).toEqual("All fields must be set");
})


test("CreatePost should fail if URL is invalid", async () => {
  const {container} = secondRender(<CreatePostPopUp onClose={() => {}} />);

  userEvent.type(screen.getByTestId("title-input"), "New Test");
  userEvent.type(screen.getByTestId("description-input"), "hello there");
  userEvent.type(screen.getByTestId("imageURL-input"), "invalid-url");
  userEvent.click(screen.getByTestId("submit-button"));

  await waitFor(() =>
      expect(container.querySelector(".alert.alert-danger")).toBeTruthy()
  )
  expect(container.querySelector(".alert.alert-danger")?.textContent).toEqual("Image error: Invalid Url")
})

test("CreatePost should emit an error if URL is not an image", async () => {
  const {container} = secondRender(<CreatePostPopUp onClose={() => {}} />);

  userEvent.type(screen.getByTestId("title-input"), "New Test");
  userEvent.type(screen.getByTestId("description-input"), "hello there");
  userEvent.type(screen.getByTestId("imageURL-input"), "http://localhost");

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

test("CreatePost should emit to Eventbus if create succeeded", async () => {
  secondRender(<CreatePostPopUp onClose={() => {}} />);

  userEvent.type(screen.getByTestId("title-input"), "New Test");
  userEvent.type(screen.getByTestId("description-input"), "hello there");
  userEvent.type(screen.getByTestId("imageURL-input"), "http://localhost");

  mockedAxios.head.mockResolvedValue({
    headers: {
      "content-type": "image/png"
    }
  });

  (createPost as jest.Mocked<any>).mockResolvedValue("123");
  userEvent.click(screen.getByTestId("submit-button"));
  await waitFor(() =>
      expect(createPost).toHaveBeenCalled()
  )
  expect(EventBus.trigger).toHaveBeenCalledTimes(1)
})
