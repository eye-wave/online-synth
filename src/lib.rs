use wasm_bindgen::prelude::*;

mod wasm;

#[wasm_bindgen]
pub fn add(left: usize, right: usize) -> usize {
    left + right
}
