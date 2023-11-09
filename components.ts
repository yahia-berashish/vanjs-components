import van, { ChildDom, Props, TagFunc } from 'vanjs-core';

export type FC<TProps = void> = (props: TProps) => ChildDom;
export type TagComponentFunc<TTag extends keyof HTMLElementTagNameMap> = (
  first?: ElementProps<TTag> | Children,
  ...rest: Children[]
) => VanElement<TTag>;

export type Children = VanElement<any> | VanComponent<any> | ChildDom;
export type ComponentTags = {
  [K in keyof HTMLElementTagNameMap]: TagComponentFunc<K>;
};
export type ElementProps<TTag extends keyof HTMLElementTagNameMap> = Props &
  Partial<HTMLElementTagNameMap[TTag]>;

export const isNotProps = (value: any) =>
  Array.isArray(value) ||
  value instanceof VanComponent ||
  value instanceof VanElement ||
  value instanceof Element ||
  typeof value === 'string' ||
  typeof value === 'number' ||
  typeof value === 'boolean';

export class VanElement<
  TTag extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap
> {
  tag: TTag;
  props: ElementProps<TTag>;
  children: Children[];
  tagFn: TagFunc<HTMLElementTagNameMap[TTag]>;

  constructor(tag: TTag, props: ElementProps<TTag>, children: Children[]) {
    this.tag = tag;
    this.props = props;
    this.children = children;

    this.tagFn = van.tags[this.tag] as TagFunc<HTMLElementTagNameMap[TTag]>;
  }

  toHTML(
    { children, tagFn, props }: VanElement = this
  ): HTMLElementTagNameMap[TTag] {
    const tagChildren = children?.map((child) => {
      if (child instanceof VanElement) {
        return this.toHTML(child);
      } else if (child instanceof VanComponent) {
        return child.toDOM();
      } else {
        return child as unknown as ChildDom;
      }
    });

    return tagFn(props as any, tagChildren) as any;
  }
}

export class VanComponent<TProps extends Record<string, any> | null = null> {
  parent: VanComponent | null;
  name: string;
  children: Children[];
  props: TProps;

  constructor(
    parent: VanComponent | null,
    options: { name: string; children: Children[]; props: TProps }
  ) {
    this.parent = null;
    this.name = options.name;
    this.children = options.children;
    this.props = options.props;
  }

  toDOM(children: Children[] = this.children): ChildDom {
    const tagChildren = children.map((child) => {
      if (child instanceof VanElement) {
        return child.toHTML();
      } else if (child instanceof VanComponent) {
        return this.toDOM(child.children);
      } else {
        return child as ChildDom;
      }
    });

    console.log('COMPONENT HTML:', tagChildren);

    return tagChildren;
  }
}

export const componentTags = new Proxy(van.tags, {
  get(_, property: keyof HTMLElementTagNameMap, reciever) {
    const newTagFn: TagComponentFunc<typeof property> = (
      first,
      ...children
    ) => {
      if (isNotProps(first)) {
        const element = new VanElement<typeof property>(property, {}, [
          first as Children,
          ...children,
        ]);
        return element;
      } else {
        const element = new VanElement<typeof property>(
          property,
          first as ElementProps<typeof property>,
          children
        );
        return element;
      }
    };

    return newTagFn;
  },
}) as unknown as ComponentTags;

export const addComponents = (
  container: HTMLElement,
  component: VanComponent<any>
) => {
  return van.add(container, component.toDOM());
};

const C = <TProps = void>(
  props: TProps
): VanComponent<TProps extends void ? null : TProps> => {};
