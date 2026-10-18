import { CardBase } from "./CardBase";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { CDN_URL } from "../../utils/constants";
import { setCategoryClass } from "../../utils/utils.ts";
import { ICardPreview } from "../../types/index.ts";
export class CardPreview extends CardBase<ICardPreview> {
  public cardBuyButton: HTMLButtonElement;
  protected cardDescription: HTMLElement;
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.cardBuyButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
    this.cardDescription = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );

    this.cardBuyButton.addEventListener("click", () => {
      this.events.emit("card:basket", { id: this.productId });
    });
  }

  set description(value: string) {
    this.cardDescription.textContent = value;
  }

  set image(value: string) {
    this.imageElement.src = `${CDN_URL}${value}`;
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    setCategoryClass(this.categoryElement, value);
  }

  set id(value: string) {
    this.productId = value;
  }

  set buttonText(value: string) {
    this.cardBuyButton.textContent = value;
  }
}
