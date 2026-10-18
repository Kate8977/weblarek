import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IGallery } from "../../types";
export class Gallery extends Component<IGallery> {
  protected catalogElement: HTMLElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.catalogElement = this.container;
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items);
  }
}
