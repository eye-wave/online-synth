use super::Wavetables;
use crate::{generate_waveform_data, normalize_vec};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
impl Wavetables {
    pub fn generate_basic_shapes_table(sample_rate: usize, base_frequency: f32) -> Vec<f32> {
        let safe_amplitude = 0.4;
        let fft_quality: usize = 500;

        let saw_amplitudes: Vec<f32> = (0..fft_quality)
            .map(|i| safe_amplitude / (i + 1) as f32)
            .collect();

        let square_amplitudes: Vec<f32> = (0..fft_quality)
            .map(|i| if i % 2 == 0 { safe_amplitude } else { 0.0 } / (i + 1) as f32)
            .collect();

        let tri_amplitudes: Vec<f32> = (0..fft_quality)
            .map(|i| {
                if i % 2 == 0 {
                    (8.0 / std::f32::consts::PI.powi(2)) * (-1.0f32).powf(i as f32 / 2.0)
                        / (i + 1).pow(2) as f32
                } else {
                    0.0f32
                }
            })
            .collect();

        let mut sine = generate_waveform_data(
            sample_rate,
            base_frequency,
            Vec::from([1.0]),
            Vec::from([0.0]),
        );
        let mut saw = generate_waveform_data(
            sample_rate,
            base_frequency,
            saw_amplitudes,
            Vec::from([0.0]),
        );
        let mut square = generate_waveform_data(
            sample_rate,
            base_frequency,
            square_amplitudes,
            Vec::from([0.0]),
        );
        let mut tri = generate_waveform_data(
            sample_rate,
            base_frequency,
            tri_amplitudes,
            Vec::from([0.0]),
        );

        let mut result: Vec<f32> = Vec::new();

        result.extend(normalize_vec(&mut sine));
        result.extend(normalize_vec(&mut saw));
        result.extend(normalize_vec(&mut square));
        result.extend(normalize_vec(&mut tri));

        result
    }
}
