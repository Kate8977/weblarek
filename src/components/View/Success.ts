import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { ISuccess } from "../../types";

export class Success extends Component<ISuccess> {
  protected orderDescriptionElement;
  protected successButton;
  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.orderDescriptionElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
    this.successButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );

    this.successButton.addEventListener("click", () => {
      this.events.emit("order_-success:close");
    });
  }

  set orderDescription(value: number) {
  this.orderDescriptionElement.textContent = `Списано ${value} синапсов`;
}
}
