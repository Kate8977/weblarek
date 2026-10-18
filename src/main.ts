import "./scss/styles.scss";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "./utils/constants.ts";
import { ApiService } from "./components/Models/ApiService.ts";
import { ProductsCatalog } from "./components/Models/ProductsCatalog.ts";
import { ShoppingCart } from "./components/Models/ShoppingCart.ts";
import { Buyer } from "./components/Models/Buyer.ts";
import { ICreateOrderRequest, TPayment } from "././types/index.ts";


import { Header } from "./components/View/Header.ts";
import { EventEmitter } from "./components/base/Events.ts";
import { Basket } from "./components/View/Basket.ts";
import { Card } from "./components/View/Card.ts";
import { cloneTemplate, ensureElement } from "./utils/utils.ts";
import { CardBasket } from "./components/View/CardBasket.ts";
import { CardPreview } from "./components/View/CardPreview.ts";
import { Gallery } from "./components/View/Gallery.ts";
import { Modal } from "./components/View/Modal.ts";
import { OrderForm } from "./components/View/OrderForm.ts";
import { ContactsForm } from "./components/View/ContactsForm.ts";
import { Success } from "./components/View/Success.ts";



const events = new EventEmitter();

const productsModel = new ProductsCatalog(events);
const cartModel = new ShoppingCart();
const buyer = new Buyer();

const apiClient = new Api(API_URL);
const apiService = new ApiService(apiClient);

const header = new Header(events, ensureElement<HTMLElement>('.header'));
const basket = new Basket(events, cloneTemplate<HTMLTemplateElement>('#basket'));
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const gallery = new Gallery(events, galleryContainer);
let previewCard: CardPreview | null = null;
const modal = new Modal(events, ensureElement<HTMLElement>("#modal-container"));
const orderForm = new OrderForm (events, cloneTemplate<HTMLTemplateElement>("#order"));
const contactsForm = new ContactsForm (events, cloneTemplate<HTMLTemplateElement>("#contacts"));
const success = new Success(events, cloneTemplate<HTMLTemplateElement>("#success"));


// закрытие модального окна
events.on ("modal:close", () => {
  modal.close();
})


// изменение каталога
events.on("catalog:changed", () => {
  const products = productsModel.getProducts();

  const cards = products.map((product) => {
    const card = new Card(
      events,
      cloneTemplate<HTMLElement>("#card-catalog")
    );

    return card.render({
  ...product,
  price: product.price === null ? "Бесценно" : `${product.price} синапсов`,
});
  });

  gallery.catalog = cards;
});

// открытие подробного описания карточки
events.on<{ id: string }>("card: open", ({id}) => {
  const product = productsModel.getProduct(id);

  if (!product) return;

  previewCard = new CardPreview(events, cloneTemplate<HTMLElement>("#card-preview"));
  const previewElement = previewCard.render({
    ...product,
     price: product.price === null 
     ? "Бесценно" 
     : `${product.price} синапсов`,});

  if (product.price === null){
    previewCard.cardBuyButton.disabled = true;
    previewCard.buttonText = "Недоступно";
  }

  else{
    previewCard.cardBuyButton.disabled = false;
    if (cartModel.checkProductAvailability(previewCard.productId)){
      previewCard.buttonText = 'Удалить из корзины';
    }
    else{
      previewCard.buttonText = 'Купить';
    }
  }

  modal.content = [previewElement];
  modal.open();
})

//добавление товара в корзину и удаление из корзины через CartPreview
events.on<{id:string}>("card:basket", ({id}) => {
  const product = productsModel.getProduct(id);

  if (!product) return;
  if (!previewCard) return;

  if (cartModel.checkProductAvailability(id)){
    cartModel.deleteProductFromCart(product);
  }
  else{
    cartModel.addProductInCart(product);
  }

  header.counter = cartModel.getQuantityProductsInCart();

  modal.close();
  
})

// открытие корзины
// функция обновления корзины

function updateBasket(): void {
  const cartArray = cartModel.getProductsInCart();

  const basketArray: HTMLElement[] = cartArray.map((element, index) => {
    const basketCard = new CardBasket(
      events,
      cloneTemplate<HTMLElement>("#card-basket")
    );

    return basketCard.render({
      ...element,
      index: index + 1,
      price: element.price === null
        ? "Бесценно"
        : `${element.price} синапсов`,
    });
  });

  basket.basketList = basketArray;
  basket.price = `${cartModel.getTotalCost()} синапсов`;

  if (basketArray.length === 0){
    basket.basketButton.disabled = true;
  }
  else{
    basket.basketButton.disabled = false;
  }

}

// обработчик на открытие корзины
events.on("basket:open", () => {
  updateBasket();

  modal.content = [basket.container];
  modal.open();
})

// Удаление товара из корзины через CardBasket
events.on<{id: string}>("card:delete", ({id}) => {
  const product = productsModel.getProduct(id);

  if (!product) return;

  cartModel.deleteProductFromCart(product);

  header.counter = cartModel.getQuantityProductsInCart();

  updateBasket();
})

// разделение ошибок

let showBuyerErrors = false;

function updateOrderErrors(): void {
  const errors = buyer.validation();

  orderForm.errors = showBuyerErrors
    ? {
        ...(errors.payment ? { payment: errors.payment } : {}),
        ...(errors.address ? { address: errors.address } : {}),
      }
    : {};
}

function updateContactsErrors(): void {
  const errors = buyer.validation();

  contactsForm.errors = showBuyerErrors
    ? {
        ...(errors.phone ? { phone: errors.phone } : {}),
        ...(errors.email ? { email: errors.email } : {}),
      }
    : {};
}


//переход к оформлению заказа

events.on("order:place", () => {
  orderForm.clearErrors();
  updateOrderErrors();
  modal.content = [orderForm.render()];
});



// изменение способа оплаты
events.on<{payment:TPayment}>("order:payment-change", ({payment}) => {
  buyer.setBuyer({payment});
  orderForm.payment = payment;

  showBuyerErrors = true;
  updateOrderErrors();
})

// изменение адреса доставки
events.on<{address:string}>("order:address-change", ({address}) => {
  buyer.setBuyer({address});
  orderForm.address = address;

  showBuyerErrors = true;
  updateOrderErrors();
})

// отправка формы

events.on<{formName: string}>("form:submit", async ({formName}) => {
  if (formName === "order") {
    const errors = buyer.validation();

    const orderErrors = {
      ...(errors.payment ? { payment: errors.payment } : {}),
      ...(errors.address ? { address: errors.address } : {}),
    };

    orderForm.errors = orderErrors;

    if (Object.keys(orderErrors).length > 0) {
      return;
    }

    contactsForm.clearErrors();
    modal.content = [contactsForm.render()];
    return;
  }

  // Второй шаг — проверяем контакты и отправляем заказ
  if (formName === "contacts") {
    const errors = buyer.validation();

    const contactsErrors = {
      ...(errors.phone ? { phone: errors.phone } : {}),
      ...(errors.email ? { email: errors.email } : {}),
    };

    contactsForm.errors = contactsErrors;

    if (Object.keys(contactsErrors).length > 0) {
      return;
    }

    const products = cartModel.getProductsInCart();

    if (products.length === 0) {
      contactsForm.errors = { email: "Корзина пуста" };
      return;
    }

    const orderPayload: ICreateOrderRequest = {
      ...buyer.getBuyer(),
      items: products.map((product) => product.id),
      total: cartModel.getTotalCost(),
    };

    contactsForm.submitButton.disabled = true;

    try {
      const response = await apiService.createOrder(orderPayload);

      success.orderDescription =
        `Списано ${response.total} синапсов`;

      modal.content = [success.render()];
    } catch (error) {
      console.error("Не удалось оформить заказ:", error);

      contactsForm.errors = {
        email: "Не удалось оформить заказ. Проверьте соединение и попробуйте ещё раз.",
      };
    }
  }
});

//изменение номера телефона
events.on<{phone:string}>("contacts:phone-change", ({phone}) => {
  buyer.setBuyer({phone});
  contactsForm.phone = phone;

  showBuyerErrors = true;
  updateContactsErrors();
})

//измненнение электронной почты
events.on<{email:string}>("contacts:email-change", ({email}) => {
  buyer.setBuyer({email});
  contactsForm.email = email;

  showBuyerErrors = true;
  updateContactsErrors();
})

//Закрытие окна с уведомлением об успешном оформлении заказа
events.on("order_-success:close",() => {
  buyer.clear();
  orderForm.address="";
  orderForm.payment = null;
  contactsForm.phone = "";
  contactsForm.email = "";
  cartModel.clearCart();
  header.counter = cartModel.getQuantityProductsInCart();
  updateBasket();
  modal.close();
})


apiService.fetchProducts()
  .then((response) => {
    productsModel.setProducts(response.items);
  })
  .catch((error) => {
    console.error("Не удалось загрузить каталог:", error);
  });

