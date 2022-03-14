import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import SortSelector from "../SortSelector";

let container: HTMLElement | null = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
})

afterEach(() => {
  if (container)
    unmountComponentAtNode(container);

  container?.remove();
  container = null;
})

it("check if onSelect prop gets called when choosing an option in the dropdown", async () => {
  const onSelect = jest.fn((eventKey): void => { })

  act(() => {
    render(<SortSelector onSelect={onSelect} />, container);
  })

  const selectElement = container?.children[0];
  expect(selectElement).toBeDefined();

  await act(async () => {
    selectElement?.children[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
  })
  expect(selectElement?.children[1]).toBeDefined();

  const optionTwo = selectElement?.children[1].children[1];
  expect(optionTwo).toBeDefined();

  act(() => {
    optionTwo?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  })
  expect(onSelect).toBeCalledTimes(1);
})

it("check if className prop gets applied", async () => {
  const className = "testClassName";

  act(() => {
    render(<SortSelector className={className} />, container);
  })
  expect(container?.children[0]).toHaveClass(className);
})

it("check if sortOptions prop gets applied", async () => {
  const sortOptions = {
    selectedOption: "",
    options: [
      {
        icon: <div className="icon1" />,
        type: "item1",
        text: "text1"
      },
      {
        icon: <div className="icon2" />,
        type: "item2",
        text: "text2"
      }
    ]
  }

  act(() => {
    render(<SortSelector sortOptions={sortOptions} />, container);
  })

  const selectElement = container?.children[0];
  expect(selectElement).toBeDefined();

  await act(async () => {
    selectElement?.children[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
  })

  const optionContainer = selectElement?.children[1];
  expect(optionContainer).toBeDefined();
  expect(optionContainer?.children.length).toBe(2);

  sortOptions.options.map((value, index) => {
    expect(optionContainer?.children[index].textContent).toContain(value.text);
    expect(optionContainer?.children[index].getAttribute("href")).toContain(value.type);
  })
})