import "./scss/styles.scss";
import { apiProducts } from "./utils/data.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "./utils/constants.ts";
import { ApiService } from "./components/base/Models/ApiService.ts";
import { ProductsCatalog } from "./components/base/Models/ProductsCatalog.ts";
import { ShoppingCart } from "./components/base/Models/ShoppingCart.ts";
import { Buyer } from "./components/base/Models/Buyer.ts";

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
const cartModel = new ShoppingCart(cartModelAr);

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
buyer.saveStep1({ payment: "card", address: "Msk,fsd,23" });
console.log("Данные покупателя:", buyer.getBuyer());
console.log("Проверка на валидацию шага 1:", buyer.isStep1Valid());
buyer.saveStep2({ email: "sdafwsg" });
console.log("Проверка на валидацию шага 1:", buyer.isStep2Valid());
console.log("Валидация шага 1:", buyer.validateStep2());
console.log("Валидация шага 2:", buyer.validateStep1());
buyer.clear();
console.log("Данные покупателя после очистки", buyer.getBuyer());

// APISERVICE TESTS
console.log("%cТесты на данных с сервера:", "font-weight: bold;");
const baseUrl = API_URL;
const apiClient = new Api(baseUrl);
const apiService = new ApiService(apiClient);

(async () => {
  try {
    const products = await apiService.fetchProducts();
    productsModel.setProducts(products);

    console.log("Каталог после сохранения:", productsModel.getProducts());

    const firstItem = productsModel.getProducts()[0];
    if (!firstItem) throw new Error("Нет товаров!");

    productsModel.setProduct(firstItem);
    console.log("Выбранный товар:", productsModel.getSelectedProduct());
  } catch (error) {
    console.error("Ошибка при загрузке или сохранении каталога:", error);
  }
})();
