use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn generate_waveform_data(
    sample_rate: usize,
    frequency: f32,
    amplitudes: Vec<f32>,
    phases: Vec<f32>,
) -> Vec<f32> {
    let num_samples = (sample_rate as f32) / frequency;
    let mut wave_data = Vec::with_capacity(num_samples as usize);

    let two_pi = 2.0 * std::f32::consts::PI;

    for i in 0..num_samples as usize {
        let t = (i as f32 / sample_rate as f32) * two_pi;

        let mut y = 0.0;

        for j in 0..amplitudes.len() {
            let harmonic_frequency = frequency as f32 * (j as f32 + 1.0);
            let amplitude = *amplitudes.get(j).unwrap_or(&0.0);
            let phase = *phases.get(j).unwrap_or(&0.0);

            y += amplitude * (harmonic_frequency * t + phase).sin();
        }

        wave_data.push(y);
    }

    wave_data
}
