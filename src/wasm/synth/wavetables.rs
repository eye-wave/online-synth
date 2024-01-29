use wasm_bindgen::prelude::*;

use crate::wasm::synth::generators::generate_waveform_data;

const QUALITY: u8 = 64;
const SAFE_AMPLITUDE: f32 = 0.4;

#[wasm_bindgen]
pub struct Wavetables {}

#[wasm_bindgen]
impl Wavetables {
    pub fn generate_nth_wavetable(sample_rate: usize, freq: f32, n: u8) -> Vec<f32> {
        (1..=QUALITY)
            .step_by(n as usize)
            .flat_map(|t| {
                let amplitudes = generate_amplitudes(0..t as usize, |i| {
                    if i % n as usize == 0 {
                        SAFE_AMPLITUDE / (i + 1) as f32
                    } else {
                        0.0
                    }
                });
                generate_waveform_data(sample_rate, freq, amplitudes, vec![0.0], true)
            })
            .collect()
    }

    pub fn generate_basic_shapes_table(sample_rate: usize, freq: f32) -> Vec<f32> {
        let fft_quality: usize = 500;
        let pi = std::f32::consts::PI.powi(2);

        let sine_amp = vec![1.0];
        let saw_amp = generate_amplitudes(0..fft_quality, |i| SAFE_AMPLITUDE / (i + 1) as f32);
        let square_amp = generate_amplitudes(0..fft_quality, |i| {
            (if i % 2 == 0 { SAFE_AMPLITUDE } else { 0.0 }) / (i + 1) as f32
        });
        let tri_amp = generate_amplitudes(0..fft_quality, |i| {
            if i % 2 == 0 {
                (8.0 / pi) * (-1.0f32).powf(i as f32 / 2.0) / (i + 1).pow(2) as f32
            } else {
                0.0f32
            }
        });

        let sine = generate_waveform_data(sample_rate, freq, sine_amp, vec![0.0], true);
        let saw = generate_waveform_data(sample_rate, freq, saw_amp, vec![0.0], true);
        let square = generate_waveform_data(sample_rate, freq, square_amp, vec![0.0], true);
        let tri = generate_waveform_data(sample_rate, freq, tri_amp, vec![0.0], true);

        let mut result: Vec<f32> = Vec::new();
        result.extend(sine);
        result.extend(saw);
        result.extend(square);
        result.extend(tri);

        result
    }
}

fn generate_amplitudes(
    range: impl Iterator<Item = usize>,
    amplitude_fn: impl Fn(usize) -> f32,
) -> Vec<f32> {
    range.map(amplitude_fn).collect()
}
