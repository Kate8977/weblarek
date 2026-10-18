import { ensureElement } from "../../utils/utils";
import { CardBase} from "./CardBase";
import { IEvents } from "../base/Events";
import { ICardBasket } from "../../types";
export class CardBasket extends CardBase<ICardBasket> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    this.deleteButton.addEventListener("click", () => {
      this.events.emit("card:delete", { id: this.productId });
    });
  }

  set index(i: number) {
    this.indexElement.textContent = String(i);
  }
}
