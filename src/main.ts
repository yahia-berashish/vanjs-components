import van from "vanjs-core";
import { addComponents, C, componentTags } from "./components";

const app: HTMLElement = document.getElementById("app")!;

const { div, button } = componentTags;

const App = C<{ hello: string }>(
  ({ hello }) => {
    const count = van.state(0);
    const visible = van.state(false);

    return div(
      "Hello ",
      hello,
      button(
        {
          onclick() {
            ++count.val;
            visible.val = !visible.oldVal;
          },
        },
        "Count is ",
        count
      ),
      () => (visible.val ? div("Hi There!!!") : "")
    );
  },
  { name: "App" }
);

addComponents(app, App({ hello: "World" }));
