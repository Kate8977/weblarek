import { ensureElement } from "../../utils/utils";
import { CardBase} from "./CardBase";
import { ICardBasket } from "../../types";

type CardBasketActions = {
  onDelete: () => void;
};
export class CardBasket extends CardBase<ICardBasket> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: CardBasketActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    this.deleteButton.addEventListener("click", () => {
      actions.onDelete();
    });
  }

  set index(i: number) {
    this.indexElement.textContent = String(i);
  }
}
