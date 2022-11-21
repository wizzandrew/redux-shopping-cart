import {createSlice, createSelector, PayloadAction} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface CartState {
    // key of type "string" + value of type "number"
    // items: {
    //     "id": 12,
    //     "value": 5
    // } 
    items: {[productID: string]: number}
}

const initialState: CartState = {
    items: {}
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
        }
    }
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;

export function getNumItems(state: RootState) {
    console.log("calling getNumItems")
    let numItems = 0;
    for(let id in state.cart.items) {
        numItems += state.cart.items[id];
    }
    return numItems;
}

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