import {createSlice, createAsyncThunk, createSelector, PayloadAction} from '@reduxjs/toolkit';
import { checkout, CartItems } from '../../app/api';
import { RootState, AppDispatch } from '../../app/store';

type CheckoutState = "LOADING" | "READY" | "ERROR";
export interface CartState {
    // key of type "string" + value of type "number"
    // items: {
    //     "id": 12,
    //     "value": 5
    // } 
    items: {[productID: string]: number};
    checkoutState: CheckoutState;
    errorMessage: string;
}

const initialState: CartState = {
    items: {},
    checkoutState: "READY",
    errorMessage: ""
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<string>) {
            const id = action.payload;
            if(state.items[id]) {
                state.items[id]++;
            }
            else {
                state.items[id] = 1;
            }
        },
        removeFromCart(state, action: PayloadAction<string>) {
            delete state.items[action.payload];
        },
        // able to change quantity of products in cart view
        updateQuantity(state, action: PayloadAction<{id: string, quantity: number}>) {
            const { id, quantity } = action.payload;
            state.items[id] = quantity;
        }
    },
    extraReducers: function(builder) {
        builder.addCase(checkoutCart.pending, (state) => {
            state.checkoutState = 'LOADING';
        });
        builder.addCase(checkoutCart.fulfilled, (state) => {
            state.checkoutState = 'READY';
        });
        builder.addCase(checkoutCart.rejected, (state, action) => {
            state.checkoutState = 'ERROR';
            state.errorMessage = action.error.message || "";
        });
    }
});

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;

//total number of items in the cart
export function getNumItems(state: RootState) {
    console.log("calling getNumItems")
    let numItems = 0;
    for(let id in state.cart.items) {
        numItems += state.cart.items[id];
    }
    return numItems;
}

//total number of items in the cart
//is called ONLY when state.cart.ITEMS change but not anyhting in the state
export const getMemoizedNumItems = createSelector(
    (state: RootState) => state.cart.items,
    (items) => {
        console.log("calling memoized getNumItems")
        let numItems = 0;
        for(let id in items) {
            numItems += items[id];
        }
        return numItems;
    }
)

// total price for the order
export const getTotalPrice = createSelector(
    (state: RootState) => state.cart.items,
    (state: RootState) => state.products.products,
    (items, products) => {
        let total = 0;
        for(let id in items) {
            total += products[id].price * items[id];
        }
        return total.toFixed(2);
    }
)

// //checkout functionality
export const checkoutCart = createAsyncThunk("cart/checkout", async (items: CartItems) => {
    const response = await checkout(items);
    return response;
})