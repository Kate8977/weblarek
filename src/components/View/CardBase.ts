import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Component } from "../base/Component";
import { ICardBase } from "../../types";

export class CardBase<T extends ICardBase = ICardBase> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  public productId!: string;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);
    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container,
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container,
    );
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: string) {
    this.priceElement.textContent = value;
  }

  set id(value: string) {
    this.productId = value;
  }
}
