use wasm_bindgen::prelude::*;

use hound::{SampleFormat, WavReader};
use std::io::Cursor;

use crate::{wasm::io::IO, web_log};

#[wasm_bindgen]
impl IO {
    pub fn decode_wav(data: &[u8], window_size: u16) -> Vec<f32> {
        let cursor = Cursor::new(data);

        let reader = match WavReader::new(cursor) {
            Ok(reader) => reader,
            Err(error) => {
                web_log!("{:?}", error);
                return Vec::new();
            }
        };

        let max_size = window_size as usize * 256;
        let sample_format = reader.spec().sample_format;

        if sample_format != SampleFormat::Float && sample_format != SampleFormat::Int {
            web_log!("{:?}", sample_format);
            return vec![];
        }

        let mut samples: Vec<f32> = Vec::new();
        let max_value = (1 << (reader.spec().bits_per_sample - 1)) as f32;

        match sample_format {
            SampleFormat::Float => {
                for sample in reader.into_samples::<f32>() {
                    if let Ok(s) = sample {
                        samples.push(s);
                    } else {
                        break;
                    }

                    if samples.len() >= max_size {
                        break;
                    }
                }
            }
            SampleFormat::Int => {
                for sample in reader.into_samples::<i32>() {
                    if let Ok(s) = sample {
                        samples.push(s as f32 / max_value);
                    } else {
                        break;
                    }

                    if samples.len() >= max_size {
                        break;
                    }
                }
            }
        }

        samples
    }
}
