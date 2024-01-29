use wasm_bindgen::prelude::*;

pub fn normalize_vec(vec: &mut [f32]) -> Vec<f32> {
    let max_value = vec.iter().cloned().fold(0.0, f32::max);
    let scale_factor = 1.0 / max_value;

    vec.iter_mut().for_each(|x: &mut f32| *x *= scale_factor);
    vec.to_vec()
}

#[wasm_bindgen]
pub fn generate_waveform_data(
    sample_rate: usize,
    frequency: f32,
    amplitudes: Vec<f32>,
    phases: Vec<f32>,
    normalize: bool,
) -> Vec<f32> {
    let num_samples = (sample_rate as f32) / frequency;
    let mut wavedata = Vec::with_capacity(num_samples as usize);

    let two_pi = 2.0 * std::f32::consts::PI;

    for i in 0..num_samples as usize {
        let t = (i as f32 / sample_rate as f32) * two_pi;

        let mut y = 0.0;

        for j in 0..amplitudes.len() {
            let harmonic_frequency = frequency * (j as f32 + 1.0);
            let amplitude = *amplitudes.get(j).unwrap_or(&0.0);
            let phase = *phases.get(j).unwrap_or(&0.0);

            y += amplitude * (harmonic_frequency * t + phase).sin();
        }

        wavedata.push(y);
    }

    if normalize {
        normalize_vec(&mut wavedata)
    } else {
        wavedata
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_waveform_data() {
        let sample_rate = 44100;
        let frequency = 440.0;
        let amplitudes = vec![1.0, 0.5, 0.2];
        let phases = vec![0.0, 1.0, 0.5];

        let result = generate_waveform_data(sample_rate, frequency, amplitudes, phases, false);

        assert_eq!(result.len(), (sample_rate as f32 / frequency) as usize);
    }
}
