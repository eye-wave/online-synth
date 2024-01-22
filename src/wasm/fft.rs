use rustfft::{num_complex::Complex, FftDirection, FftPlanner};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn fft_analyze(samples: Vec<f32>) -> Vec<f32> {
    let mut planner = FftPlanner::new();

    let fft = planner.plan_fft(samples.len(), FftDirection::Forward);

    let mut buffer = samples
        .iter()
        .map(|&sample| Complex {
            re: sample,
            im: 0.0,
        })
        .collect::<Vec<_>>();

    fft.process(&mut buffer);

    let real: Vec<f32> = buffer.iter().map(|c| c.re as f32).collect();
    let imag: Vec<f32> = buffer.iter().map(|c| c.im as f32).collect();

    let mut result: Vec<f32> = Vec::new();

    result.extend(real.clone());
    result.extend(imag.clone());

    result
}
