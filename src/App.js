import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import MainLayout from "./Components/MainLayout";
import Category from "./Pages/Category";
import Checkout from "./Pages/Checkout";
import { useReducer, useState } from "react";
import data from "./data/productsData";

const initialState = {
  cart: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    }
    case "REMOVE": {
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    }
    case "INCREASE": {
      return {
        ...state,
        cart: state.cart.map((item, index) =>
          index === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }
    case "DECREASE": {
      return {
        ...state,
        cart: state.cart.map((item, index) =>
          index === action.payload
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        ),
      };
    }
    default: {
      return state;
    }
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [filterData] = useState(data);

  // Handle add to cart button
  function addToCart(id) {
    const item = {
      ...filterData[id],
      quantity: 1,
    };

    dispatch({ type: "ADD", payload: item });
  }

  function handleRemove(id) {
    dispatch({ type: "REMOVE", payload: id });
  }

  function handleDecrease(index) {
    dispatch({ type: "DECREASE", payload: index });
  }

  function handleIncrease(index) {
    dispatch({ type: "INCREASE", payload: index });
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route
            path="category/:id"
            element={<Category addToCart={addToCart} />}
          />
          <Route
            path="checkout"
            element={
              <Checkout
                cart={state.cart}
                handleRemove={handleRemove}
                handleDecrease={handleDecrease}
                handleIncrease={handleIncrease}
              />
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;