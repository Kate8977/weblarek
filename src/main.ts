import "./scss/styles.scss";
import { apiProducts } from "./utils/data.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "./utils/constants.ts";
import { ApiService } from "./components/Models/ApiService.ts";
import { ProductsCatalog } from "./components/Models/ProductsCatalog.ts";
import { ShoppingCart } from "./components/Models/ShoppingCart.ts";
import { Buyer } from "./components/Models/Buyer.ts";
import { ICreateOrderRequest, TPayment } from "././types/index.ts";


import { Header } from "./components/View/Header.ts";
import {Modal} from "./components/View/Modal.ts";
import { EventEmitter } from "./components/base/Events.ts";
import { Basket } from "./components/View/Basket.ts";
import { Card } from "./components/View/Card.ts";


//CATALOG TESTS
console.log("%cТесты на данных из файла data.ts:", "font-weight: bold;");
const productsModel = new ProductsCatalog();
productsModel.setProducts([...apiProducts.items]);
productsModel.setProduct(apiProducts.items[1]);

console.log("Массив товаров из каталога: ", productsModel.getProducts());
console.log(
  "Товар с id c101ab44-ed99-4a54-990d-47aa2bb4e7d9:",
  productsModel.getProduct("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"),
);
console.log("Выбранный товар:", productsModel.getSelectedProduct());

// CART TESTS
const cartModelAr = [...apiProducts.items.slice(0, 3)];
const cartModel = new ShoppingCart();
for (let i = 0; i < cartModelAr.length; i++) {
  cartModel.addProductInCart(cartModelAr[i]);
}

console.log("Товары в корзине:", cartModel.getProductsInCart());
console.log("Общая сумма товаров в корзине:", cartModel.getTotalCost());
console.log(
  "Колличество продуктов в корзине:",
  cartModel.getQuantityProductsInCart(),
);
cartModel.deleteProductFromCart(apiProducts.items[0]);
console.log(
  "Корзина после удаления первого продукта:",
  cartModel.getProductsInCart(),
);
cartModel.clearCart();
cartModel.addProductInCart(apiProducts.items[3]);
console.log(
  "Корзина после очистки и добавления продукта",
  cartModel.getProductsInCart(),
);
console.log(
  "Проверка наличия товара с id c101ab44-ed99-4a54-990d-47aa2bb4e7d9:",
  cartModel.checkProductAvailability(apiProducts.items[1].id),
);

// BUYER TESTS
const buyer = new Buyer();
buyer.setBuyer({
  payment: "online",
  address: "Москва, ул. Тестовая, д. 23",
  email: "sdafwsg@mail.ru",
  phone: "900809",
});
console.log("Данные покупателя:", buyer.getBuyer());
console.log("Валидация:", buyer.validation());

// APISERVICE TESTS
console.log("%cТесты на данных с сервера:", "font-weight: bold;");
const baseUrl = API_URL;
const apiClient = new Api(baseUrl);
const apiService = new ApiService(apiClient);

(async () => {
  try {
    const response = await apiService.fetchProducts();
    if (!response.items || response.items.length === 0) {
      throw new Error("Сервер вернул пустой каталог");
    }
    productsModel.setProducts(response.items);

    console.log("Каталог после сохранения:", productsModel.getProducts());

    const firstItem = productsModel.getProducts()[0];
    productsModel.setProduct(firstItem);
    console.log("Выбранный товар:", productsModel.getSelectedProduct());

    const buyerData = {
      payment: "online",
      email: "test.user@example.com",
      phone: "+79990000000",
      address: "Москва, ул. Тестовая, д. 1",
    };

    const orderPayload: ICreateOrderRequest = {
      payment: buyerData.payment as TPayment,
      email: buyerData.email,
      phone: buyerData.phone,
      address: buyerData.address,
      total: cartModel.getTotalCost(),
      items: cartModel.getProductsInCart().map((item) => item.id),
    };

    const orderResult = await apiService.createOrder(orderPayload);
    console.log("Заказ успешно создан", orderResult);

    buyer.clear();
    console.log("Данные покупателя после очистки", buyer.getBuyer());
  } catch (error) {
    console.error("Ошибка интеграции с каталогом:");
    console.error(error instanceof Error ? error.message : String(error));
  }
})();

// HEADER TESTS

const events = new EventEmitter();

const headerContainer = document.querySelector<HTMLElement>('.header')!;

const header = new Header(events, headerContainer);

// BASKET TESTS
const modalContainer = document.querySelector<HTMLElement>('.modal')!;

const basketTemplate = document.querySelector<HTMLTemplateElement>('#basket')!;

const basket = new Basket(events, modalContainer, basketTemplate);

function createCard(title: string): HTMLElement { 
  const li = document.createElement('li'); 
  li.textContent = title; return li; 
}

const card1 = createCard("Фреймворк куки судьбы"); 
const card2 = createCard("+1 час в сутках"); 
const cardsArray: HTMLElement[] = [card1, card2];

basket.basketList = cardsArray;

if ( basket.listContainer.children.length === 2 && 
  basket.listContainer.contains(card1) && basket.listContainer.contains(card2) ) { 
  console.log( "🟢 Сеттеры basketList/content работают корректно. Карты добавлены." ); 
} 
else { 
  console.error( "🛑 Ошибка! Список товаров не был добавлен в корзину или добавился некорректно." );
}

//ТЕСТ : Работа модального окна === 
console.log("--- Тест : Открытие и закрытие модалки ---"); 
let isOpenEventFired = false; 
let isCloseEventFired = false; 

// Подписываемся на события, которые должен генерировать родительский Modal 
events.on('basket: open', () => {
    modalContainer.classList.add('modal_active');
    isOpenEventFired = true; 
    console.log("🟢 Получено событие 'modal: open'."); 
  });

events.on('modal: close', () => 
  { 
    modalContainer.classList.remove('modal_active');
    isCloseEventFired = true; 
    console.log("🟢 Получено событие 'modal: close'.");
   }); 

// Программно открываем модалку
header.basketButton.click();
basket.closeButton.click();

//Card TESTS
const cardTemplate = document.querySelector<HTMLTemplateElement>('#card-catalog');
const cardElement = cardTemplate?.content.querySelector('.card')!.cloneNode(true) as HTMLElement;

const card = new Card(events, cardElement);

card.title = 'CAT';
card.category= 'animals';
card.price = 'infinity';
card.image = '././public/mstile-310x310.png';

