"use strict";

import { displayNumberOfItemsAddedInCart, addWithEnter } from "../js/utils.js";

let cartProducts = JSON.parse(localStorage.getItem("productsCart"));

const createTable = () => {
  document.querySelector(".empty").style.display = "none";
  document.querySelector(".products-in-cart").innerHTML = `
    <div class="upper-text">
      <h2>Your shopping basket</h2>
    </div>
    <table class="table">
      <tr>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
    </table>
  `;

  const tableEl = document.querySelector(".table");

  cartProducts.forEach((product) => {
    let row = tableEl.insertRow(1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);

    cell1.innerHTML = `<a href="../pages/details.html?product_id=${product.id}"><img class="table-img" src=${product.imgURL}></img></a>`;
    cell2.innerHTML = `<a href="../pages/details.html?product_id=${product.id}"><p class="product-name">${product.name}</p></a>`;
    cell3.innerHTML = `$${product.price}`;
    cell4.innerHTML = `<div class="q">
    <input class="cart-q-input${product.id}" type="number" value="${
      product.items
    }" min="1" max="${product.stock - product.items}" product-id="${
      product.id
    }"/>
    <div class="plus-minus disable-selection-of-white-spaces">
      <span>
        <i class="fa-solid fa-minus" product-id="${product.id}"></i>
      </span>
      <span>
        <i class="fa-solid fa-plus" product-id="${product.id}"></i>
      </span>
    </div>`;
    cell5.innerHTML = `<i class="fa-solid fa-xmark" product-id="${product.id}"></i>`;
  });

  createTicket();
  document
    .querySelector(".table")
    .addEventListener("click", updateQuantityAndRemove);
};

window.addEventListener("DOMContentLoaded", () => {
  if (cartProducts != null) {
    displayNumberOfItemsAddedInCart();
    createTable();
  } else {
    createEmptyCart();
  }
});

const createTicket = () => {
  document.querySelector(".ticket").innerHTML = `
  <div>
    <h3>Subtotal</h3>
    <span id="subtotal"></span>
  </div>
  <div>
    <h4>VAT</h4>
    <span id="VAT"></span>
  </div>
  <div>
    <h4>Cupon / Discount</h4>
    <span id="applied-discount"></span>
  </div>
  <div class="cupon">
    <button id="cupon">Enter a cupon code</button>
  </div>
  <div id="input-cupon">
    <input type="text" id="input" placeholder="Your cupon code"/>
    <label class="check-cupon disable-selection-of-white-spaces" for="input">+<label>
  </div>
  <div id="totalDiv">
    <h2>Total <span>incl. VAT</span></h2>
    <span id="total"></span>
  </div>
  <div id="checkout">
    <p>Proceed to checkout</p>
  </div> `;
  ticketFunctionality();
};

const createEmptyCart = () => {
  document.querySelector(".actual-cart").style.display = "none";
  document.querySelector(".ticket").style.display = "none";
  document.querySelector(".empty").style.display = "flex";
  document.querySelector(".empty").innerHTML = `
    <div class="empty-cart disable-selection-of-white-spaces">
      <img src="../../resources/cartDoggo.png" />
      <div class="column">
        <p>Hmm, it looks like your shopping cart is empty</p>
        <p>Start <a href="../../index.html"><span id="shopping">shopping</span></a><span>...</span> your pet deserves it!</p>
      </div>
      <img src="../../resources/cartKitty.png" />
    </div>
  `;
};

const ticketFunctionality = () => {
  const subtotalEl = document.querySelector("#subtotal");
  const vatEl = document.querySelector("#VAT");
  const totalEl = document.querySelector("#total");
  const cuponPercentage = document.querySelector("#applied-discount");
  const cuponInputEl = document.querySelector("#input");
  const insertCuponEl = document.querySelector(".check-cupon");
  let subtotal = 0;
  let vatValue = 0;
  let cupon = 0;
  let total = 0;

  showCupon();

  cartProducts.forEach((product) => {
    subtotal += product.items * Number(product.price);
  });

  vatValue = 0.19 * subtotal;
  total = subtotal + vatValue - (subtotal + vatValue) * cupon;
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  vatEl.textContent = `${vatValue.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;

  insertCuponEl.addEventListener("click", () => {
    const check = checkCupon(cuponInputEl.value);
    if (check != null) {
      cupon = check;
      cuponPercentage.textContent = `${cupon * 100}%`;
      totalEl.textContent = `$${(total - total * cupon).toFixed(2)}`;
      cuponInputEl.value = "";
      cuponInputEl.placeholder = "Discount applied";
      cuponInputEl.classList.remove("red");
      cuponInputEl.classList.add("green");
    } else {
      cuponPercentage.textContent = "";
      totalEl.textContent = `$${total.toFixed(2)}`;
      cuponInputEl.value = "";
      cuponInputEl.placeholder = "Not a valid cupon";
      cuponInputEl.classList.remove("green");
      cuponInputEl.classList.add("red");
    }
  });
  addWithEnter("#", "input", ".", "check-cupon");
  document.querySelector("#checkout").addEventListener("click", () => {
    alert("You're gonna be redirected to the payment page");
  });
};

const checkCupon = (input) => {
  const expression = input.toLowerCase();
  switch (expression) {
    case "5%":
      return 0.05;
    case "10%":
      return 0.1;
    case "15%":
      return 0.15;
    case "doggo":
      return 0.17;
    case "bigsell":
      return 0.25;
    case "blackfriday":
      return 0.3;
    default:
      return null;
  }
};

const showCupon = () => {
  document.querySelector("#cupon").addEventListener("click", () => {
    document.querySelector("#input-cupon").style.display = "flex";
    document.querySelector(".cupon").style.display = "none";
  });
};

const updateQuantityAndRemove = (e) => {
  const productsInCart = cartProducts.find(
    (product) => product.id === e.target.getAttribute("product-id")
  );

  if (
    e.target.classList.contains("fa-plus") ||
    e.target.classList.contains("fa-minus") ||
    e.target.classList.contains("fa-xmark")
  ) {
    let inputValueEl = document.querySelector(
      `.cart-q-input${productsInCart.id}`
    );

    if (e.target.classList.contains("fa-plus")) {
      if (Number(productsInCart.stock) > productsInCart.items) {
        productsInCart.items += 1;
        inputValueEl.value = productsInCart.items;
      } else {
        alert("OUT OF STOCK");
      }
    } else if (e.target.classList.contains("fa-minus")) {
      if (productsInCart.items > 1) {
        productsInCart.items -= 1;
        inputValueEl.value = productsInCart.items;
      }
    } else if (e.target.classList.contains("fa-xmark")) {
      // console.log(cartProducts.splice(productsInCart, 1));
      cartProducts = cartProducts.filter(
        (product) => product.id != productsInCart.id
      );
    }
  }
  localStorage.setItem("productsCart", JSON.stringify(cartProducts));

  if (cartProducts.length == 0) {
    window.localStorage.removeItem("productsCart");
    createEmptyCart();
    document.querySelector("#total-items-navbar").style.display = "none";
  } else {
    displayNumberOfItemsAddedInCart();
    createTable();
  }
};
