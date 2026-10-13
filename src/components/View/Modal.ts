import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IModal{
  content: HTMLElement[];
}

export class Modal extends Component <IModal>{
  public modalContent: HTMLElement;//public for tests need to CHANGE to protected
  public closeButton: HTMLButtonElement;//public for tests need to CHANGE to protected

  constructor(protected events: IEvents, container: HTMLElement){
    super(container);
    
    this.modalContent = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.closeButton.addEventListener('click', ()=>{
      this.events.emit('modal: close');
    })

    this.container.addEventListener('click', (event: MouseEvent) => {
      if (event.target === this.container){
        this.events.emit('modal: close');
      }
    })

  }

  set content(elements: HTMLElement[]){
    this.modalContent.innerHTML = '';

    elements.forEach(element => {
      this.modalContent.append(element);
    });
  }
}