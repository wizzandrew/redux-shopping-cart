import {createSlice} from '@reduxjs/toolkit';

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
    reducers: {}
});

export default cartSlice.reducer;