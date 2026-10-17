# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений. 

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

#### Интерфейс IProduct 
Интерфейс описывает данные о товаре

Свойства интерфейса:
`id: string` - id товара
`description: string` - описание товара
`image: string` - изображение товара
`title: string` - название товара
`category: string` - категория товара
`price: number | null` - стоимость товара


#### Интерфейс IBuyer 
Интерфейс описывает данные о покупателе

Свойства интерфейса:
`payment: TPayment` - способ оплаты ('online'|'cash'|'')
`email: string` - электронная почта покупателя
`phone: string` - телефон покупателя
`address: string` - адресс покупателя

### Модели данных

#### Класс ProductsCatalog
Содержит товары, которые можно купить в приложении

Поля класса:
`products: IProduct[]` - массив всех товаров
`selectedProduct : IProduct` - товар, выбранный для подробного отображения

Методы класса:
`setProducts(products: IProduct[]): void` - сохранение массива товаров
`getProducts(): IProduct[]` - получение массива товаров из модели
`getProduct(id: IProduct['id']): IProduct` - получение одного товара по его id, в параметрах id товара
`setProduct(product: IProduct): void` - сохранение товара для подробного отображения
`getSelectedProduct(): IProduct | undefined`- получение товара для подробного отображения

#### Класс ShoppingCart
Содержит товары, которые пользователь выбрал для покупки

Поля класса:
`productsInCart: IProduct[]` - массив товаров, выбранных покупателем для покупки

Методы класса:
`getProductsInCart(): IProduct[]` - получение массива товаров, которые находятся в корзине
`addProductInCart(product: IProduct): void` - добавление товара в массив корзины
`deleteProductFromCart(product: IProduct): void` - удаление товара из массива корзины
`clearCart(): void` - очистка корзины
`getTotalCost(): number` - получение стоимости всех товаров в корзине
`getQuantityProductsInCart(): number`- получение количества товаров в корзине
`checkProductAvailability(id: IProduct['id']): boolean`- проверка наличия товара в корзине по его id, в параметрах id товара

#### Класс Buyer
Содержит данные покупателя, которые тот должен указать при оформлении заказа

Конструктор:  
`constructor(buyer: IBuyer)` - принимает объект интерфейса IBuyer

Поля класса:
`_payment: TPayment` - способ оплаты ('online'|'cash'|'')
`_email: string` - электронная почта покупателя
`_phone: string` - телефон покупателя
`_address: string` - адресс покупателя

Методы класса:
`setBuyer(data:Partial<Pick<IBuyer, "payment" | "address"| "email" | "phone">> ): void` - сохранение данных покупателя в модели
`getBuyer(): IBuyer` - получение всех данных покупателя
`clear(): void` - очистка данных покупателя
`validation(): Partial<Record<keyof Pick<IBuyer,"payment" | "address"| "email" | "phone">, string>>` - валидация данных, в параметрах данные покупателя, возвращается объект ошибок, в котором ключ - пропущенное свойство IBuyer, значения - строка ошибки, возвращаемый объект не обязтально должен содержать все свойства IBuyer

### Слой коммуникации
#### Класс ApiServer
Отвечает за взаимодействие приложения с сервером

Конструктор:
`constructor(apiClient: IApi)` - принимает запрос

Поля класса:
`apiClient:IApi` - объект, реализующий интерфейс низкоуровневых запросов

Методы класса:
`fetchProducts(): Promise<IProductResponse>` - делает get запрос на эндпоинт /product/ и возвращает объект, полученный от сервера, в котором находится массив товаров
`createOrder(orderPayload: ICreateOrderRequest): Promise<IOrderResponse>` - делает post запрос на эндпоинт /order/ и передаёт в него данные, полученные в параметрах метода, а возвращает объект, подтверждающий покупку на определенную сумму

### View

#### Класс Header
Иконка корзины с счетчиком

Конструктор:
`constructor(events: IEvents, container: HTMLElement){}`

Поля класса:
`counterElement: HTMLElement` - счетчик
`basketButton: HTMLButtonElement` - кнопка корзины

Методы класса:
`set counter(value:number): void` - сохранение значения счетчика

#### Interface IHeader
`counter: number` - значение счетчика 

#### Класс Gallery
Список карточек товаров

Конструктор:
`constructor(events: IEvents, container: HTMLElement){}`

Поля класса:
`catalogElement: HTMLElement` - контейнер для карточек

Методы класса:
`set catalog(items: HTMLElement[]): void` - сохранение карточек товаров

#### Interface IGallery

`catalog: HTMLElement[]` - каталог элементов

#### Класс Modal
Модальное окно

Конструктор:
`constructor(events: IEvents, container: HTMLElement){}`

Поля класса:
`modalContent: HTMLElement` - содержимое модального окна
`closeButton: HTMLButtonElement` - кнопка закрытия модального окна

Методы класса:
`set content(elements: HTMLElement[]): void` - сохранение контента в модальное окно
`open():void` - открытие модального окна
`close():void` - закрытие модального окна

#### Interface IModal

`content: HTMLElement[]` - каталог элементов

#### Класс Success
Подтверждение заказа

Конструктор:
`constructor(events: IEvents, container: HTMLElement){}`

Поля класса:
`closeSuccessButton: HTMLButtonElement` - кнопка для перехода к новым покупкам
`successDescription: HTMLElement` - элемент описания успешного заказа

Методы класса:
`set description(value: string): void` - сохранение описания успешного заказа 

#### Interface ISuccess

`description: string` - описание успешного заказа

#### Класс CardBase
Основа для карточки как для переиспользуемой сущности

Конструктор:
`constructor(events: IEvents, container: HTMLElement){}`

Поля класса:
`titleElement: HTMLElement` - заголовок карточки
`priceElement: HTMLElement`- описание стоимости товара

Методы класса:
`set title(value: string): void` - сохранение заголовка товара
`set price(value: string): void` - сохранение стоимости товара

#### Interface ICardBase

`title: string` - заголовок товара
`price: string`- стоимость товара

#### Класс Card
Карточка в каталоге

Конструктор:
`constructor(events: IEvents, container: HTMLElement){}`

Поля класса:
<!-- `cardButton: HTMLButtonElement` - кнопка для перехода к карточке -->
`categoryElement: HTMLElement` - элемент карточки, описывающий категорию товара
`imageElement: HTMLImageElement` - изображение товара


Методы класса:
`set category(value: string): void` - сохранение категории товара
`set image(value: string): void` - сохранение изображения товара по ссылке


#### Interface ICard

`category: string` - категория товара
`image: string`- ссылка на изображение товара


#### Класс CardPreview
Карточка с подробным описанием

Конструктор:
`constructor(events: IEvents, container: HTMLElement){}`

Поля класса:
`cardBuyButton: HTMLButtonElement` - кнопка для добавления товара в корзину
`cardDescription: HTMLElement` - описание товара
`categoryElement: HTMLElement` - элемент карточки, описывающий категорию товара
`imageElement: HTMLImageElement` - изображение товара


Методы класса:
`set category(value: string): void` - сохранение категории товара
`set description(value: string): void` - сохранение описания товара
`set image(value: string): void` - сохранение изображения товара по ссылке


#### Interface ICardPreview

`description: string` - описание товара
`image: string`- ссылка на изображение товара
`category: string` - категория товара


#### Класс CardBasket
Карточка в корзине

Конструктор:
`constructor(events: IEvents, container: HTMLElement){}`

Поля класса:
`indexElement: HTMLElement` - индекс товара в корзине
`deleteButton: HTMLButtonElement` - кнопка удаления товара из корзины


Методы класса:
`set index(i: number): void` - сохранение индекса товара

#### Interface ICardBasket

`index: number` - индекс товара

#### Класс Basket
Корзина

Конструктор:
`constructor(events: IEvents, container: HTMLElement, template: HTMLTemplateElement){}`

Поля класса:
`basketButton: HTMLButtonElement` - кнопка оформления заказа
`basketPrice: HTMLElement` - элемент, описывающий общую стоимость товаров в корзине
`listContainer: HTMLElemenent` - карточки

Методы класса:
`set basketList (list: HTMLElement[]): void` - сохранение списка товаров в корзине
`set price (value: string): void` - сохранение общей стоимоси товаров в корзине 

#### Interface IBasket

`basketList: HTMLElement[]` - список товаров в корзине
`price: string` - общая стоимость товаров в корзине

#### Класс Form
Базовый класс для форм

Конструктор:
`constructor(events: IEvents, container: HTMLElement){}`

Поля класса:
`submitButton: HTMLButtonElement` - кнопка 'далее/оплатить'
`errorsContainer: HTMLSpanElement` - контейнер для ошибок формы

Методы класса:
`clearErrors(): void` - очищает содержимое контейнера ошибок

«При получении ошибок от Модели, Presenter обращается к view.errorsContainer и записывает текст ошибки напрямую в textContent».

#### Класс OrderForm
Форма с выбором способа оплаты и адреса доставки

Конструктор:
`constructor(events: IEvents, container: HTMLElement){}`

Поля класса:
`onlineButton: HTMLButtonElement` - кнопка выбора онлайн-оплаты
`offlineButton: HTMLButtonElement` - кнопка выбора оплаты на месте
`addressInput: HTMLInputElement` - поле для ввода адреса доставки


Методы класса:
`set payment (payment: string): void` - устанавливает выбранный способ оплаты
`set address (address: string): void` - устанавливает значение поля ввода адреса

#### Interface IOrderForm

`payment: string` - способ оплаты
`address: string` - адресс доставки

#### Класс ContactsForm
Форма с указание контактных данных покупателя

Конструктор:
`constructor(events: IEvents, container: HTMLElement){}`

Поля класса:
`emailInput: HTMLInputElement` - поле для ввода электронной ночты покупателя 
`phoneInput: HTMLInputElement` - поле для ввода номера телефона покупателя

Методы класса:
`set phone (phone: string): void` - сохранение номера телефона покупателя
`set email (email: string): void` - сохранение электронной почты покупателя

#### Interface IContactForm

`phone: string` - номер телефона покупателя
`email: string` - электронная почта покупателя