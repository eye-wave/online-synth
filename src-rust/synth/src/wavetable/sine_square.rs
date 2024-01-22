use super::Wavetables;
use crate::{generate_waveform_data, normalize_vec};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Wavetables {
    pub fn generate_sine_square_table(sample_rate: usize, base_frequency: f32) -> Vec<f32> {
        let safe_amplitude = 0.4;
        let mut result: Vec<f32> = Vec::new();

        for t in 1..64 {
            let amplitudes: Vec<f32> = (0..t)
                .map(|i| if i % 2 == 0 { safe_amplitude } else { 0.0 } / (i + 1) as f32)
                .collect();

            let mut frame =
                generate_waveform_data(sample_rate, base_frequency, amplitudes, Vec::from([0.0]));

            result.extend(normalize_vec(&mut frame));
        }

        result
    }
}
