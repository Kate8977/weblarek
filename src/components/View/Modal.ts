import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IModal } from "../../types";
export class Modal extends Component<IModal> {
  protected modalContent: HTMLElement; 
  protected closeButton: HTMLButtonElement; 

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.modalContent = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );

    this.closeButton.addEventListener("click", () => {
      this.close();
    });

    this.container.addEventListener("click", (event: MouseEvent) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  set content(element: HTMLElement) {
    this.modalContent.replaceChildren(element);
  }

  open() {
    this.container.classList.add("modal_active");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.events.emit("modal:close");
  }
}
