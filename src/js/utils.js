"use strict";

export const productURL =
  "https://63221515fd698dfa2906c23b.mockapi.io/products/";

export const fetchResult = async (apiURL) => {
  const result = await fetch(apiURL);
  const data = await result.json();
  return data;
};

export const showLoader = (HTMLTagWhereTagIsInjected, loader) => {
  document.querySelector(`.${HTMLTagWhereTagIsInjected}`).style.display =
    "none";
  document.querySelector(`.${loader}`).style.display = "block";
};

export const hideLoader = (HTMLTagWhereTagIsInjected, loader) => {
  document.querySelector(`.${HTMLTagWhereTagIsInjected}`).style.display =
    "none";
  document.querySelector(`.${loader}`).style.display = "flex";
};

export const displayNumberOfItemsAddedInCart = () => {
  const spanEl = document.querySelector("#total-items-navbar");
  const localStorageValue = localStorage.getItem("productsCart");
  let totalItems = 0;
  if (localStorageValue != null) {
    const allProductsAddedInCart = JSON.parse(localStorageValue);
    allProductsAddedInCart.forEach((product) => {
      totalItems += product.items;
    });
    spanEl.textContent = totalItems;
    spanEl.style.display = "block";
  }
};

export const addWithEnter = (
  type1,
  inputClassName,
  type2,
  addClassNameButton
) => {
  const inputEl = document.querySelector(`${type1}${inputClassName}`);
  const addButton = document.querySelector(`${type2}${addClassNameButton}`);

  inputEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addButton.click();
    }
  });
};

export const plusAndMinusBtn = (btnToClickClassName, inputElClassName) => {
  const btnToClickOn = document.querySelector(`.${btnToClickClassName}`);

  const buttonsFunctionality = (e) => {
    const inputEl = document.querySelector(`.${inputElClassName}`);
    let inputValue = Number(inputEl.value);
    if (e.target.classList.contains("fa-plus") && inputValue >= 1) {
      inputValue++;
      inputEl.value = inputValue;
    } else if (e.target.classList.contains("fa-minus") && inputValue > 1) {
      inputValue--;
      inputEl.value = inputValue;
    } else if (
      (e.target.classList.contains("fa-plus") ||
        e.target.classList.contains("fa-minus")) &&
      inputValue != Number
    ) {
      inputEl.value = 1;
    }
  };

  btnToClickOn.addEventListener("click", buttonsFunctionality);
};
