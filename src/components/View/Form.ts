import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { BuyerValidate } from "../../types";

export class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsContainer: HTMLSpanElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );
    this.errorsContainer = ensureElement<HTMLSpanElement>(
      ".form__errors",
      this.container,
    );

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit("form:submit", {
        formName: (this.container as HTMLFormElement).name,
      });
    });
  }

  set submitButtonDisabled(value: boolean){
    this.submitButton.disabled = value;
  }

  set errors(errors: BuyerValidate) {
    this.errorsContainer.textContent = Object.values(errors).join(" ");
    this.submitButtonDisabled = Object.keys(errors).length > 0;
  }
}
