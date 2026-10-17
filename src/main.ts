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
import { EventEmitter } from "./components/base/Events.ts";
import { Basket } from "./components/View/Basket.ts";
import { Card } from "./components/View/Card.ts";
import { cloneTemplate, ensureElement } from "./utils/utils.ts";
import { CardBasket } from "./components/View/CardBasket.ts";
import { CardPreview } from "./components/View/CardPreview.ts";
import { Gallery } from "./components/View/Gallery.ts";
import { Modal } from "./components/View/Modal.ts";



const events = new EventEmitter();

const productsModel = new ProductsCatalog(events);
const cartModel = new ShoppingCart();
const buyer = new Buyer();

const apiClient = new Api(API_URL);
const apiService = new ApiService(apiClient);

const header = new Header(events, ensureElement<HTMLElement>('.header'));
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const gallery = new Gallery(events, galleryContainer);
const modal = new Modal(events, ensureElement<HTMLElement>("#modal-container"));
// const basket = new Basket(events, ensureElement<HTMLElement>("#modal-container"), cloneTemplate<HTMLTemplateElement>('#basket'));

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

  const previewCard = new CardPreview(events, cloneTemplate<HTMLElement>("#card-preview"));
  const previewElement = previewCard.render({
    ...product,
     price: product.price === null 
     ? "Бесценно" 
     : `${product.price} синапсов`,});
  modal.content = [previewElement];
  modal.open();
})

//добавление товара в корзину
events.on<{id:string, button: HTMLButtonElement}>("card:basket", ({id, button}) => {
  const product = productsModel.getProduct(id);

  if (!product) return;

  cartModel.addProductInCart(product);
  button.textContent = 'ok';
  console.log('add');
})

// открытие корзины

apiService.fetchProducts()
  .then((response) => {
    productsModel.setProducts(response.items);
  })
  .catch((error) => {
    console.error("Не удалось загрузить каталог:", error);
  });

// //CATALOG TESTS
// console.log("%cТесты на данных из файла data.ts:", "font-weight: bold;");
// const productsModel = new ProductsCatalog();
// productsModel.setProducts([...apiProducts.items]);
// productsModel.setProduct(apiProducts.items[1]);

// console.log("Массив товаров из каталога: ", productsModel.getProducts());
// console.log(
//   "Товар с id c101ab44-ed99-4a54-990d-47aa2bb4e7d9:",
//   productsModel.getProduct("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"),
// );
// console.log("Выбранный товар:", productsModel.getSelectedProduct());

// // CART TESTS
// const cartModelAr = [...apiProducts.items.slice(0, 3)];
// const cartModel = new ShoppingCart();
// for (let i = 0; i < cartModelAr.length; i++) {
//   cartModel.addProductInCart(cartModelAr[i]);
// }

// console.log("Товары в корзине:", cartModel.getProductsInCart());
// console.log("Общая сумма товаров в корзине:", cartModel.getTotalCost());
// console.log(
//   "Колличество продуктов в корзине:",
//   cartModel.getQuantityProductsInCart(),
// );
// cartModel.deleteProductFromCart(apiProducts.items[0]);
// console.log(
//   "Корзина после удаления первого продукта:",
//   cartModel.getProductsInCart(),
// );
// cartModel.clearCart();
// cartModel.addProductInCart(apiProducts.items[3]);
// console.log(
//   "Корзина после очистки и добавления продукта",
//   cartModel.getProductsInCart(),
// );
// console.log(
//   "Проверка наличия товара с id c101ab44-ed99-4a54-990d-47aa2bb4e7d9:",
//   cartModel.checkProductAvailability(apiProducts.items[1].id),
// );

// // BUYER TESTS
// const buyer = new Buyer();
// buyer.setBuyer({
//   payment: "online",
//   address: "Москва, ул. Тестовая, д. 23",
//   email: "sdafwsg@mail.ru",
//   phone: "900809",
// });
// console.log("Данные покупателя:", buyer.getBuyer());
// console.log("Валидация:", buyer.validation());

// // APISERVICE TESTS
// console.log("%cТесты на данных с сервера:", "font-weight: bold;");
// const baseUrl = API_URL;
// const apiClient = new Api(baseUrl);
// const apiService = new ApiService(apiClient);

// (async () => {
//   try {
//     const response = await apiService.fetchProducts();
//     if (!response.items || response.items.length === 0) {
//       throw new Error("Сервер вернул пустой каталог");
//     }
//     productsModel.setProducts(response.items);

//     console.log("Каталог после сохранения:", productsModel.getProducts());

//     const firstItem = productsModel.getProducts()[0];
//     productsModel.setProduct(firstItem);
//     console.log("Выбранный товар:", productsModel.getSelectedProduct());

//     const buyerData = {
//       payment: "online",
//       email: "test.user@example.com",
//       phone: "+79990000000",
//       address: "Москва, ул. Тестовая, д. 1",
//     };

//     const orderPayload: ICreateOrderRequest = {
//       payment: buyerData.payment as TPayment,
//       email: buyerData.email,
//       phone: buyerData.phone,
//       address: buyerData.address,
//       total: cartModel.getTotalCost(),
//       items: cartModel.getProductsInCart().map((item) => item.id),
//     };

//     const orderResult = await apiService.createOrder(orderPayload);
//     console.log("Заказ успешно создан", orderResult);

//     buyer.clear();
//     console.log("Данные покупателя после очистки", buyer.getBuyer());
//   } catch (error) {
//     console.error("Ошибка интеграции с каталогом:");
//     console.error(error instanceof Error ? error.message : String(error));
//   }
// })();





// HEADER TESTS

// const events = new EventEmitter();

// const headerContainer = document.querySelector<HTMLElement>('.header')!;

// const header = new Header(events, headerContainer);

// // BASKET TESTS
// const modalContainer = document.querySelector<HTMLElement>('.modal')!;

// const basketTemplate = document.querySelector<HTMLTemplateElement>('#basket')!;

// const basket = new Basket(events, modalContainer, basketTemplate);

// function createCard(title: string): HTMLElement { 
//   const li = document.createElement('li'); 
//   li.textContent = title; return li; 
// }

// const card1 = createCard("Фреймворк куки судьбы"); 
// const card2 = createCard("+1 час в сутках"); 
// const cardsArray: HTMLElement[] = [card1, card2];

// basket.basketList = cardsArray;

// if ( basket.listContainer.children.length === 2 && 
//   basket.listContainer.contains(card1) && basket.listContainer.contains(card2) ) { 
//   console.log( "🟢 Сеттеры basketList/content работают корректно. Карты добавлены." ); 
// } 
// else { 
//   console.error( "🛑 Ошибка! Список товаров не был добавлен в корзину или добавился некорректно." );
// }

// //ТЕСТ : Работа модального окна === 
// console.log("--- Тест : Открытие и закрытие модалки ---"); 
// let isOpenEventFired = false; 
// let isCloseEventFired = false; 

// // Подписываемся на события, которые должен генерировать родительский Modal 
// events.on('basket: open', () => {
//     modalContainer.classList.add('modal_active');
//     isOpenEventFired = true; 
//     console.log("🟢 Получено событие 'modal: open'."); 
//   });

// events.on('modal: close', () => 
//   { 
//     modalContainer.classList.remove('modal_active');
//     isCloseEventFired = true; 
//     console.log("🟢 Получено событие 'modal: close'.");
//    }); 

// // Программно открываем модалку
// header.basketButton.click();
// basket.closeButton.click();

// //Card TESTS
// const testEvents = new EventEmitter();

// testEvents.on('card: open', () => {
//   console.log('✅ Событие: card: open');
// });

// testEvents.on('card: basket', () => {
//   console.log('✅ Событие: card: basket');
// });

// testEvents.on('card: delete', () => {
//   console.log('✅ Событие: card: delete');
// });

// // Создаём отдельную область для тестов,
// // чтобы не затирать существующую разметку страницы.
// const testArea = document.createElement('section');
// testArea.innerHTML = '<h2>Тест карточек</h2>';

// const cardsContainer = document.createElement('div');
// cardsContainer.style.display = 'flex';
// cardsContainer.style.flexWrap = 'wrap';
// cardsContainer.style.gap = '20px';

// testArea.append(cardsContainer);
// document.body.append(testArea);

// // 1. Карточка каталога
// const card = new Card(
//   testEvents,
//   cloneTemplate<HTMLElement>('#card-catalog')
// );

// console.assert(
//   card.render() instanceof HTMLElement,
//   'Card: render() должен вернуть HTML-элемент'
// );

// const catalogCard = card.render({
//   title: 'Тестовый товар',
//   price: '1000 синапсов',
//   category: 'софт-скил',
//   image: '././public/mstile-310x310.png',
// });

// // 2. Карточка предпросмотра
// const preview = new CardPreview(
//   testEvents,
//   cloneTemplate<HTMLElement>('#card-preview')
// );

// console.assert(
//   preview.render() instanceof HTMLElement,
//   'CardPreview: render() должен вернуть HTML-элемент'
// );

// const previewCard = preview.render({
//   title: 'Тестовый товар',
//   price: '1000 синапсов',
//   category: 'софт-скил',
//   image: '././public/mstile-310x310.png',
//   description: 'Описание тестового товара',
// });

// // 3. Карточка корзины
// const basketCard = new CardBasket(
//   testEvents,
//   cloneTemplate<HTMLElement>('#card-basket')
// );

// console.assert(
//   basketCard.render() instanceof HTMLElement,
//   'CardBasket: render() должен вернуть HTML-элемент'
// );

// const basketItem = basketCard.render({
//   title: 'Тестовый товар',
//   price: '1000 синапсов',
//   index: 1,
// });

// cardsContainer.replaceChildren(
//   catalogCard,
//   previewCard,
//   basketItem
// );