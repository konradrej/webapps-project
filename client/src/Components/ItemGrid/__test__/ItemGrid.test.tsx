import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import ItemGrid from "../ItemGrid";

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

it("check if posts prop gets rendered", () => {
  const items: JSX.Element[] = [
    <div key={0} />,
    <div key={1} />,
  ];

  expect(container?.children.length).toBe(0);

  act(() => {
    render(<ItemGrid items={items} />, container);
  })

  const itemGrid : Element | undefined = container?.children[0];
  expect(itemGrid).toBeDefined();
  
  let postCount: number = 0;
  for(let i: number = 0; i < (itemGrid?.children.length ?? 0); i++){
    if(itemGrid && itemGrid.children[i] && itemGrid.children[i].children){
      postCount += itemGrid.children[i].children.length;
    }
  }

  expect(postCount).toBe(items.length);
})

it("check if breakpoints prop gets applied", () => {
  const items: JSX.Element[] = [
    <div key={0} />,
    <div key={1} />,
    <div key={2} />,
  ];

  const breakpointColumns: { default : number, [key : number] : number } = {
    default: 3,
    200: 2,
    100: 1
  }

  window.innerWidth = 50;

  act(() => {
    render(<ItemGrid breakpointColumns={breakpointColumns} items={items} />, container);
  })

  let itemGrid: Element | undefined = container?.children[0];
  expect(itemGrid).toBeDefined();
  expect(itemGrid?.children.length).toBe(1);

  window.innerWidth = 150;

  act(() => {
    render(<ItemGrid breakpointColumns={breakpointColumns} items={items} />, container);
  })
  expect(itemGrid?.children.length).toBe(2);

  window.innerWidth = 250;

  act(() => {
    render(<ItemGrid breakpointColumns={breakpointColumns} items={items} />, container);
  })
  expect(itemGrid?.children.length).toBe(3);
})