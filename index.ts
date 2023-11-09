import van from 'vanjs-core';
import { addComponents, componentTags, FC, VanComponent } from './components';

const app: HTMLElement = document.getElementById('app');

const { div, button } = componentTags;

const AppComponent = new VanComponent(null, {
  name: 'App',
  children: [
    'My Name is Yahia',
    div('Hello World', 'Hello!!!', div('Hi There!')),
    button(
      {
        onclick() {
          console.log('Hi There!');
        },
      },
      'Clickable'
    ),
  ],
  props: null,
});

const html = div(
  'Hi There!',
  button(
    {
      onclick() {
        console.log('hello world');
      },
    },
    'Clickable'
  )
).toHTML();
const html2 = van.tags.div(
  'Hi There!',
  van.tags.button(
    {
      onclick() {
        console.log('Hello World');
      },
    },
    'Clickable'
  )
);

const App: FC = () => {
  // console.log(Object.values(van.tags));
  console.log(div('Hello World', div('Hi There!')).toHTML());
  console.log('AppComponent:', AppComponent.toDOM());

  return html;
};

addComponents(app, AppComponent);
