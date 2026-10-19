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
const cartModel = new ShoppingCart(events);
const buyer = new Buyer(events);

const apiClient = new Api(API_URL);
const apiService = new ApiService(apiClient);

const header = new Header(events, ensureElement<HTMLElement>('.header'));
const basket = new Basket(events, cloneTemplate<HTMLTemplateElement>('#basket'));
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const gallery = new Gallery(events, galleryContainer);
const previewCard = new CardPreview(cloneTemplate<HTMLElement>("#card-preview"),
  {
    onBuy: () => {
      events.emit("card:basket");
    },
  },
);
const modal = new Modal(events, ensureElement<HTMLElement>("#modal-container"));
const orderForm = new OrderForm (events, cloneTemplate<HTMLTemplateElement>("#order"));
const contactsForm = new ContactsForm (events, cloneTemplate<HTMLTemplateElement>("#contacts"));
const success = new Success(events, cloneTemplate<HTMLTemplateElement>("#success"));

//изменение корзины
events.on("basket:changed", () => {
  header.counter = cartModel.getQuantityProductsInCart();
  updateBasket();
});

// изменение каталога
events.on("catalog:changed", () => {
  const products = productsModel.getProducts();

  const cards = products.map((product) => {
  const card = new Card(
    cloneTemplate<HTMLElement>("#card-catalog"),
    {
      onClick: () => {
        productsModel.setProduct(product);
      },
    },
  );

  return card.render(product);
});

gallery.catalog = cards;
});

// открытие подробного описания карточки
events.on("product:changed", () => {
  const product = productsModel.getSelectedProduct();

  if (!product) return;

  const previewElement = previewCard.render(product);

  if (product.price === null) {
    previewCard.cardBuyButtonDisabled = true;
    previewCard.buttonText = "Недоступно";
  } else {
    previewCard.cardBuyButtonDisabled = false;

    if (cartModel.checkProductAvailability(product.id)) {
      previewCard.buttonText = "Удалить из корзины";
    } else {
      previewCard.buttonText = "Купить";
    }
  }

  modal.content = previewElement;
  modal.open();
});

//добавление товара в корзину и удаление из корзины через CartPreview
events.on("card:basket", () => {
  const product = productsModel.getSelectedProduct();

  if (!product || product.price === null) return;

  if (cartModel.checkProductAvailability(product.id)) {
    cartModel.deleteProductFromCart(product);
  } else {
    cartModel.addProductInCart(product);
  }

  modal.close();
});

// открытие корзины
// функция обновления корзины

function updateBasket(): void {
  const cartArray = cartModel.getProductsInCart();

  basket.buttonDisabled = cartArray.length === 0;

  const basketArray: HTMLElement[] = cartArray.map((element, index) => {
    const basketCard = new CardBasket(
  cloneTemplate<HTMLElement>("#card-basket"),
  {
    onDelete: () => {
      events.emit("card:delete", { id: element.id });
    },
  },
);

    return basketCard.render({
      ...element,
      index: index + 1,});
  });

  basket.basketList = basketArray;
  basket.price = `${cartModel.getTotalCost()} синапсов`;

  if (basketArray.length === 0){
    basket.buttonDisabled = true;
  }
  else{
        basket.buttonDisabled = false;
  }

}

// обработчик на открытие корзины
events.on("basket:open", () => {
  modal.content = basket.render();
  modal.open();
});

// Удаление товара из корзины через CardBasket
events.on<{id: string}>("card:delete", ({id}) => {
  const product = productsModel.getProduct(id);

  if (!product) return;

  cartModel.deleteProductFromCart(product);
})

// изменение данных покупателя

events.on("buyer:changed", () => {
  const data = buyer.getBuyer();
  const errors = buyer.validation();

  orderForm.payment = data.payment;
  orderForm.address = data.address;

  contactsForm.phone = data.phone;
  contactsForm.email = data.email;

  orderForm.errors = {
    ...(errors.payment ? { payment: errors.payment } : {}),
    ...(errors.address ? { address: errors.address } : {}),
  };

  contactsForm.errors = {
    ...(errors.phone ? { phone: errors.phone } : {}),
    ...(errors.email ? { email: errors.email } : {}),
  };
});


//переход к оформлению заказа

// Переход к оформлению заказа
events.on("order:place", () => {
  modal.content = orderForm.render();
  modal.open();
});



// изменение способа оплаты
events.on<{ payment: TPayment }>("order:payment-change", ({ payment }) => {
  buyer.setBuyer({ payment });
});

// изменение адреса доставки
events.on<{ address: string }>("order:address-change", ({ address }) => {
  buyer.setBuyer({ address });
});

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

    modal.content = contactsForm.render();
  }

  // Второй шаг — проверяем контакты и отправляем заказ
  if (formName === "contacts") {
    
    const products = cartModel.getProductsInCart();

    const orderPayload: ICreateOrderRequest = {
      ...buyer.getBuyer(),
      items: products.map((product) => product.id),
      total: cartModel.getTotalCost(),
    };

    contactsForm.submitButtonDisabled = true;

    try {
      const response = await apiService.createOrder(orderPayload);

      success.orderDescription = response.total;

      modal.content = success.render();
    } catch (error) {
      console.error("Не удалось оформить заказ:", error);

      contactsForm.errors = {
        email: "Не удалось оформить заказ. Проверьте соединение и попробуйте ещё раз.",
      };
    }
  }
});

//изменение номера телефона
events.on<{ phone: string }>("contacts:phone-change", ({ phone }) => {
  buyer.setBuyer({ phone });
});

//измненнение электронной почты
events.on<{ email: string }>("contacts:email-change", ({ email }) => {
  buyer.setBuyer({ email });
});

//Закрытие окна с уведомлением об успешном оформлении заказа
events.on("order_-success:close",() => {
  buyer.clear();
  cartModel.clearCart();
  modal.close();
})


apiService.fetchProducts()
  .then((response) => {
    productsModel.setProducts(response.items);
  })
  .catch((error) => {
    console.error("Не удалось загрузить каталог:", error);
  });

