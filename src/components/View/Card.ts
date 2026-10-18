import { CardBase} from "./CardBase";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";
import { setCategoryClass } from "../../utils/utils.ts";
import { ICard } from "../../types/index.ts";
export class Card extends CardBase<ICard> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );

    this.container.addEventListener("click", () => {
      this.events.emit("card: open", { id: this.productId });
    });
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    setCategoryClass(this.categoryElement, value);
  }

  set image(value: string) {
    this.imageElement.src = `${CDN_URL}${value}`;
  }
}
