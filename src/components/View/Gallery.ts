import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IGallery{
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery>{
  public catalogElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement){
    super(container);

    this.catalogElement = this.container;
  }

  set catalog(items: HTMLElement[]){
    this.catalogElement.replaceChildren(...items);
  }
}