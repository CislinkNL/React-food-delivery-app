import { createSlice } from "@reduxjs/toolkit";

const items =
  localStorage.getItem("cartItems") !== null
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

const totalAmount =
  localStorage.getItem("totalAmount") !== null
    ? JSON.parse(localStorage.getItem("totalAmount"))
    : 0;

const totalQuantity =
  localStorage.getItem("totalQuantity") !== null
    ? JSON.parse(localStorage.getItem("totalQuantity"))
    : 0;

const setItemFunc = (item, totalAmount, totalQuantity) => {
  localStorage.setItem("cartItems", JSON.stringify(item));
  localStorage.setItem("totalAmount", JSON.stringify(totalAmount));
  localStorage.setItem("totalQuantity", JSON.stringify(totalQuantity));
};

const initialState = {
  cartItems: items,
  totalQuantity: totalQuantity,
  totalAmount: totalAmount,
};

// Helper function to generate option signature for comparison
const getOptionSignature = (selectedOptions) => {
  if (!selectedOptions || Object.keys(selectedOptions).length === 0) {
    return "no-options";
  }
  return JSON.stringify(selectedOptions);
};

// Helper function to generate display text for selected options
const generateOptionsText = (selectedOptions) => {
  if (!selectedOptions || Object.keys(selectedOptions).length === 0) {
    return "";
  }

  const optionTexts = [];
  Object.entries(selectedOptions).forEach(([key, value]) => {
    if (value && value.name) {
      optionTexts.push(value.name);
    }
  });

  return optionTexts.length > 0 ? `(${optionTexts.join(", ")})` : "";
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    // =========== add item ============
    addItem(state, action) {
      const newItem = action.payload;
      const baseId = newItem.id.split('_')[0]; // Get base ID without timestamp
      const optionSignature = getOptionSignature(newItem.selectedOptions);

      // Find existing item with same base ID and same options
      const existingItem = state.cartItems.find((item) => {
        const itemBaseId = item.id.split('_')[0];
        const itemOptionSignature = getOptionSignature(item.selectedOptions);
        return itemBaseId === baseId && itemOptionSignature === optionSignature;
      });

      if (!existingItem) {
        // Add new item with options
        const optionsText = generateOptionsText(newItem.selectedOptions);
        state.cartItems.push({
          id: newItem.id,
          title: newItem.title,
          displayTitle: `${newItem.title} ${optionsText}`.trim(),
          image01: newItem.image01,
          price: newItem.price,
          basePrice: newItem.basePrice || newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          selectedOptions: newItem.selectedOptions || {},
          category: newItem.category,
          desc: newItem.desc
        });
        state.totalQuantity++;
      } else {
        // Increase quantity of existing item with same options
        state.totalQuantity++;
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.price * existingItem.quantity;
      }

      // Recalculate total amount
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );

      setItemFunc(
        state.cartItems.map((item) => item),
        state.totalAmount,
        state.totalQuantity
      );
    },

    // ========= remove item ========
    removeItem(state, action) {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        state.totalQuantity--;

        if (existingItem.quantity === 1) {
          state.cartItems = state.cartItems.filter((item) => item.id !== id);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice = existingItem.price * existingItem.quantity;
        }

        state.totalAmount = state.cartItems.reduce(
          (total, item) => total + Number(item.price) * Number(item.quantity),
          0
        );

        setItemFunc(
          state.cartItems.map((item) => item),
          state.totalAmount,
          state.totalQuantity
        );
      }
    },

    //============ delete item ===========
    deleteItem(state, action) {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
        state.totalQuantity = state.totalQuantity - existingItem.quantity;

        state.totalAmount = state.cartItems.reduce(
          (total, item) => total + Number(item.price) * Number(item.quantity),
          0
        );

        setItemFunc(
          state.cartItems.map((item) => item),
          state.totalAmount,
          state.totalQuantity
        );
      }
    },

    //============ clear cart ===========
    clearCart(state) {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;

      setItemFunc([], 0, 0);
    }
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice;
