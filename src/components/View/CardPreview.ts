import { CardBase } from "./CardBase";
import { ensureElement } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";
import { setCategoryClass } from "../../utils/utils.ts";
import { ICardPreview } from "../../types/index.ts";

type CardPreviewActions = {
  onBuy: () => void;
};
export class CardPreview extends CardBase<ICardPreview> {
  protected cardBuyButton: HTMLButtonElement;
  protected cardDescription: HTMLElement;
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(сontainer: HTMLElement, actions: CardPreviewActions) {
    super(сontainer);

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
      actions.onBuy();
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

  set buttonText(value: string) {
    this.cardBuyButton.textContent = value;
  }

  set cardBuyButtonDisabled(value: boolean) {
    this.cardBuyButton.disabled = value;
  }
}
