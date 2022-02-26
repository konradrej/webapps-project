import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import GridItem, { Props as GridItemProps } from "../../GridItem/GridItem";
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
  const posts: GridItemProps[] = [
    {
      id: 0,
      title: "Title 1",
      description: "Description 1",
      imageUrl: "imageUrl 1",
      createdAt: new Date(),
      creatorUsername: "Username 1",
      creatorProfileUrl: "creatorProfileUrl 1",
      creatorProfileImageUrl: "creatorProfileImageUrl 1"
    },
    {
      id: 1,
      title: "Title 2",
      description: "Description 2",
      imageUrl: "imageUrl 2",
      createdAt: new Date(),
      creatorUsername: "Username 2",
      creatorProfileUrl: "creatorProfileUrl 2",
      creatorProfileImageUrl: "creatorProfileImageUrl 2"
    }
  ];

  const items: JSX.Element[] = [
    <GridItem key={0} {...posts[0]} />,
    <GridItem key={1} {...posts[1]} />,
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

  expect(postCount).toBe(posts.length);
})

it("check if breakpoints prop gets applied", () => {

  const posts: GridItemProps[] = [
    {
      id: 0,
      title: "Title 1",
      description: "Description 1",
      imageUrl: "imageUrl 1",
      createdAt: new Date(),
      creatorUsername: "Username 1",
      creatorProfileUrl: "creatorProfileUrl 1",
      creatorProfileImageUrl: "creatorProfileImageUrl 1"
    },
    {
      id: 1,
      title: "Title 2",
      description: "Description 2",
      imageUrl: "imageUrl 2",
      createdAt: new Date(),
      creatorUsername: "Username 2",
      creatorProfileUrl: "creatorProfileUrl 2",
      creatorProfileImageUrl: "creatorProfileImageUrl 2"
    },
    {
      id: 2,
      title: "Title 3",
      description: "Description 3",
      imageUrl: "imageUrl 3",
      createdAt: new Date(),
      creatorUsername: "Username 3",
      creatorProfileUrl: "creatorProfileUrl 3",
      creatorProfileImageUrl: "creatorProfileImageUrl 3"
    }
  ];

  const items: JSX.Element[] = [
    <GridItem key={0} {...posts[0]} />,
    <GridItem key={1} {...posts[1]} />,
    <GridItem key={2} {...posts[2]} />,
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