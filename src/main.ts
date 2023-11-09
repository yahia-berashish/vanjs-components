import van from "vanjs-core";
import { addComponents, C, componentTags, VanComponent } from "./components";

const app: HTMLElement = document.getElementById("app")!;

const { div, button } = componentTags;

const AppComponent = new VanComponent(null, {
  name: "App",
  children: [
    "My Name is Yahia",
    div("Hello World", "Hello!!!", div("Hi There!")),
    button(
      {
        onclick() {
          console.log("Hi There!");
        },
      },
      "Clickable"
    ),
  ],
  props: null,
});

const App = C<{ hello: string }>(
  ({ hello }) => {
    const count = van.state(0);
    // console.log(Object.values(van.tags));
    console.log(div("Hello World", div("Hi There!")).toHTML());
    console.log("AppComponent:", AppComponent.toDOM());

    return [
      div(
        "Hello ",
        hello,
        button(
          {
            onclick() {
              console.log("Hi There");
              ++count.val;
            },
          },
          "Count is ",
          count
        )
      ),
    ];
  },
  { name: "App" }
);

console.log("Name:", App({ hello: "World" }).name);

addComponents(app, App({ hello: "World" }));
