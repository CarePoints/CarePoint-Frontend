// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface CartItem {
//     id:string;
//     name:string;
//     price:number;
//     quantity:number;
// }

// interface CartState{
//     cartItems : CartItem[]
// }

// const initialState: CartState = {
//     cartItems : []
// }

// const cartSlice = createSlice({
//     name:'cart',
//     initialState,
//     reducers:{
//         removeItemFromCart(state, action: PayloadAction<string>) {
//             state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
//         },
//         updateItemQuantity(state, action: PayloadAction<{id:string; quantity: number}>){
//             const item = state.cartItems.find(item=>item.id === action.payload.id);
//             if(item){
//                 item.quantity = action.payload.quantity
//             }
//         }
//     }
// })


// export const {removeItemFromCart, updateItemQuantity} = cartSlice.actions;
// export default cartSlice.reducer;


import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  image: string[];
}

interface CartState {
  cartItems: CartItem[];
}

const initialState: CartState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems(state, action: PayloadAction<CartItem[]>) {
      state.cartItems = action.payload;
    },
    removeItemFromCart(state, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
    },
    updateItemQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.cartItems.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
  },
});

export const { setCartItems, removeItemFromCart, updateItemQuantity } = cartSlice.actions;
export default cartSlice.reducer;
