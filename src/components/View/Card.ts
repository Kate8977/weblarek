import { CardBase} from "./CardBase";
import { ensureElement } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";
import { setCategoryClass } from "../../utils/utils.ts";
import { ICard } from "../../types/index.ts";

type CardActions = {
  onClick: () => void;
};
export class Card extends CardBase<ICard> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions: CardActions) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );

    this.container.addEventListener("click", () => {
      actions.onClick();
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
