use plotters::style::RGBColor;

#[inline]
pub fn hex_to_rgb(color: &u32) -> RGBColor {
    let r = ((color >> 16) & 0xFF) as u8;
    let g = ((color >> 8) & 0xFF) as u8;
    let b = (color & 0xFF) as u8;
    RGBColor(r, g, b)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_hex_to_rgb() {
        let tests = [
            (&0x000000, RGBColor(0, 0, 0)),
            (&0xFF0000, RGBColor(255, 0, 0)),
            (&0x00FF00, RGBColor(0, 255, 0)),
            (&0x0000FF, RGBColor(0, 0, 255)),
        ];

        for (input, expected) in tests.iter() {
            assert_eq!(hex_to_rgb(input), *expected);
        }
    }
}
