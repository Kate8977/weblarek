import { ensureElement } from "../../utils/utils";
import { CardBase, ICardBase } from "./CardBase";
import { IEvents } from "../base/Events";

interface ICardBasket extends ICardBase{
  index: number;
}

export class CardBasket extends CardBase <ICardBasket>{
  public indexElement: HTMLElement;
  public deleteButton: HTMLButtonElement;

  constructor(events: IEvents, container: HTMLElement){
    super(events, container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButton.addEventListener('click', () => {
      this.events.emit('card: delete');
    });
  }

  set index(i: number){
    this.indexElement.textContent = String(i);
  }
}