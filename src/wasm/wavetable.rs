use crate::wasm::buffer::generate_waveform_data;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn genrate_basic_shapes_table(
    sample_rate: usize,
    base_frequency: f32,
    fft_quality: usize,
) -> Vec<f32> {
    let saw_amplitudes: Vec<f32> = (0..fft_quality).map(|i| 0.4 / (i + 1) as f32).collect();

    let square_amplitudes: Vec<f32> = (0..fft_quality)
        .map(|i| if i % 2 == 0 { 0.4 } else { 0.0 } / (i + 1) as f32)
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

    let sine = generate_waveform_data(
        sample_rate,
        base_frequency,
        Vec::from([1.0]),
        Vec::from([0.0]),
    );
    let saw = generate_waveform_data(
        sample_rate,
        base_frequency,
        saw_amplitudes,
        Vec::from([0.0]),
    );
    let square = generate_waveform_data(
        sample_rate,
        base_frequency,
        square_amplitudes,
        Vec::from([0.0]),
    );
    let tri = generate_waveform_data(
        sample_rate,
        base_frequency,
        tri_amplitudes,
        Vec::from([0.0]),
    );

    let mut result: Vec<f32> = Vec::new();

    result.extend(sine);
    result.extend(saw);
    result.extend(square);
    result.extend(tri);

    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_genrate_basic_shapes_table() {
        let sample_rate = 44100;
        let base_frequency = 440.0;
        let fft_quality = 5;

        let result = genrate_basic_shapes_table(sample_rate, base_frequency, fft_quality);

        let expected_length = (sample_rate as f32 / base_frequency) as usize * 4;

        assert_eq!(result.len(), expected_length);
    }
}
