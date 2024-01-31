use super::IO;
use byteorder::{LittleEndian, WriteBytesExt};
use wasm_bindgen::prelude::*;

const FILE_ID: &str = "eyewave.audio";

#[wasm_bindgen]
impl IO {
    pub fn encode_wav(wave_data: &[f32], sample_rate: u32) -> Vec<u8> {
        let mut buffer: Vec<u8> = vec![];

        let fmt_chunk = Self::create_fmt_chunk(sample_rate);
        let data_chunk = Self::create_data_chunk(wave_data);
        let clm_chunk = Self::create_clm_chunk(FILE_ID);

        let chunk_size = fmt_chunk.len() + clm_chunk.len() + data_chunk.len() + 4;

        buffer.extend(b"RIFF");
        buffer.write_u32::<LittleEndian>(chunk_size as u32).unwrap();
        buffer.extend(b"WAVE");
        buffer.extend(fmt_chunk);
        buffer.extend(clm_chunk);
        buffer.extend(data_chunk);

        buffer
    }

    fn create_clm_chunk(url: &str) -> Vec<u8> {
        let mut buffer: Vec<u8> = vec![];
        let window_size = 2024;
        let flags = 20000000;

        let data = format!("<!>{} {} wavetable ({})  ", window_size, flags, url)
            .as_bytes()
            .to_owned();

        let chunk_size = data.len() as u32;

        buffer.extend(b"clm ");
        buffer.write_u32::<LittleEndian>(chunk_size).unwrap();
        buffer.extend(data);

        buffer
    }

    fn create_data_chunk(wave_data: &[f32]) -> Vec<u8> {
        let mut buffer: Vec<u8> = vec![];

        let samples: Vec<u8> = wave_data
            .iter()
            .flat_map(|&sample| {
                // Convert the floating-point sample to a 16-bit signed integer
                let sample_i16 = (sample * std::i16::MAX as f32) as i16;

                // Write the 16-bit integer as two bytes in little-endian format
                vec![sample_i16 as u8, (sample_i16 >> 8) as u8]
            })
            .collect();

        let chunk_size = samples.len() as u32;

        buffer.extend(b"data");
        buffer.write_u32::<LittleEndian>(chunk_size).unwrap();
        buffer.extend(samples);

        buffer
    }

    fn create_fmt_chunk(sample_rate: u32) -> Vec<u8> {
        let mut buffer: Vec<u8> = vec![];
        let bit_depth = 16u16;
        let byte_rate = sample_rate * bit_depth as u32 / 8;

        buffer.extend(b"fmt ");
        buffer.write_u32::<LittleEndian>(16).unwrap(); // Size
        buffer.write_u16::<LittleEndian>(1).unwrap(); // Compression Code
        buffer.write_u16::<LittleEndian>(1).unwrap(); // Channels
        buffer.write_u32::<LittleEndian>(sample_rate).unwrap(); // Sample Rate
        buffer.write_u32::<LittleEndian>(byte_rate).unwrap(); // Byte Rate
        buffer.write_u16::<LittleEndian>(bit_depth / 8).unwrap(); // Block align
        buffer.write_u16::<LittleEndian>(bit_depth).unwrap(); // Bit depth

        buffer
    }
}
