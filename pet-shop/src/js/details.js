"use strict";

import {
  fetchResult,
  productURL,
  showLoader,
  hideLoader,
  displayNumberOfItemsAddedInCart,
  addWithEnter,
  plusAndMinusBtn,
} from "../js/utils";

const searchParamstring = window.location.search;
const searchParams = new URLSearchParams(searchParamstring);
const productId = Number(searchParams.get("product_id"));
let productInfo;

const createCard = (product) => {
  return `
  <div class="image">
          <img
            src="${product.imgURL}"
          />
        </div>
        <div class="details">
          <h2>${product.name}</h2>
          <h3>$${product.price}</h3>
          <label for="product-description"></label>
          <p id="product-description">
            &nbsp; &nbsp;${product.description}
          </p>
          <p>Stock: <span id="stock-p">${displayTheCorrectStockNumber(
            product
          )}</span></p>
          <div class="qunantity-container">
            <div class="q">
              <label for="quantity:">Quantity</label>
              <input class="details-input" type="text" value="1" min="1" max="${
                product.stock
              }" />
              <div class="plus-minus disable-selection-of-white-spaces">
                <i class="fa-solid fa-minus"></i>
                <i class="fa-solid fa-plus"></i>
              </div>
            </div>
            <div class="cart" id="${product.id}">
              <i class="fa-solid fa-cart-shopping" id="text-add-to-cart"></i>
              <p for="text-add-to-cart">Add to cart</p>
            </div>
          </div>
        </div>
  `;
};

const createMessageCard = (product) => {
  return `
  <div class="left">
        <img
          width="90px"
          height="90px"
          src="${product.imgURL}"
        />
      </div>
      <div class="rigth">
        <p>${product.name}</p>
        <p>
          Added successfully to cart <span id="check" <i class="fa-solid fa-circle-check"></i></span>
        </p>
      </div>
  `;
};

const showProducstDetails = async () => {
  showLoader("details-container", "loader");
  const productURLWithId = `${productURL}${productId}`;
  productInfo = await fetchResult(productURLWithId);
  document.querySelector(".details-container").innerHTML =
    createCard(productInfo);
  hideLoader("loader", "details-container");

  displayNumberOfItemsAddedInCart();
  plusAndMinusBtn("qunantity-container", "details-input");
  document.querySelector(".cart").addEventListener("click", addToCart);

  addWithEnter(".", "details-input", ".", "cart");
};

window.addEventListener("DOMContentLoaded", showProducstDetails());

const addToCart = () => {
  const inputEl = document.querySelector(".details-input");
  let inputValue = Number(inputEl.value);
  const stockEl = document.querySelector("#stock-p");
  let stockValue = Number(stockEl.textContent);
  let cartProducts = [];

  if ((inputValue > stockValue || inputValue < inputEl.min) && stockValue > 0) {
    inputEl.value = "";
    inputEl.placeholder = `maximum: ${stockValue}`;
  } else if (stockValue === 0) {
    alert("Sorry, unfortunately we are out of stock");
  } else {
    if (isNaN(inputValue) && stockValue >= 0) inputValue = 1;

    if (localStorage.getItem("productsCart") === null) {
      cartProducts.push({ ...productInfo, items: inputValue });
      stockEl.textContent = stockValue - inputValue;
    } else {
      cartProducts = JSON.parse(localStorage.getItem("productsCart"));
      const productAlreadyInCart = cartProducts.find(
        (product) => product.id == productId
      );
      if (productAlreadyInCart != undefined) {
        productAlreadyInCart.items += inputValue;
        stockEl.textContent = stockValue - inputValue;
      } else {
        const productToBeAddedInCart = { ...productInfo, items: inputValue };
        cartProducts.push(productToBeAddedInCart);
        stockEl.textContent = stockValue - inputValue;
      }
    }
    if (cartProducts.length > 0) {
      localStorage.setItem("productsCart", JSON.stringify(cartProducts));
    }
    confirmationMessage();
  }
  displayNumberOfItemsAddedInCart();
};

const confirmationMessage = () => {
  const messageDivEl = document.querySelector("#successfully-added-message");
  messageDivEl.style.display = "flex";
  document.querySelector(".details-container").style.filter = "blur(1.2px)";
  messageDivEl.innerHTML = createMessageCard(productInfo);
  setTimeout(() => {
    messageDivEl.style.display = "none";
    document.querySelector(".details-container").style.removeProperty("filter");
  }, 1800);
};

const displayTheCorrectStockNumber = (product) => {
  if (localStorage.getItem("productsCart") === null) {
    return product.stock;
  } else {
    const productsInCart = JSON.parse(localStorage.getItem("productsCart"));
    const isProductInCart = productsInCart.find(
      (product) => product.id == productId
    );

    if (isProductInCart != undefined) {
      return isProductInCart.stock - isProductInCart.items;
    } else {
      return product.stock;
    }
  }
};
