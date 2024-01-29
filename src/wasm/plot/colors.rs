use plotters::prelude::*;

pub fn hex_to_rgba(color: u32) -> RGBAColor {
    let r = ((color >> 24) & 0xFF) as u8;
    let g = ((color >> 16) & 0xFF) as u8;
    let b = ((color >> 8) & 0xFF) as u8;
    let a = ((color & 0xFF) as f64) / 255.0;

    RGBAColor(r, g, b, a)
}

pub fn hex_to_rgb(color: u32) -> RGBColor {
    let r = ((color >> 24) & 0xFF) as u8;
    let g = ((color >> 16) & 0xFF) as u8;
    let b = ((color >> 8) & 0xFF) as u8;
    RGBColor(r, g, b)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_hex_to_rgba() {
        assert_eq!(hex_to_rgba(0x00000000), RGBAColor(0, 0, 0, 0.0));
        assert_eq!(hex_to_rgba(0xFF0000FF), RGBAColor(255, 0, 0, 1.0));
        assert_eq!(hex_to_rgba(0x00FF00FF), RGBAColor(0, 255, 0, 1.0));
        assert_eq!(hex_to_rgba(0x0000FFFF), RGBAColor(0, 0, 255, 1.0));
    }

    #[test]
    fn test_hex_to_rgb() {
        assert_eq!(hex_to_rgb(0x00000000), RGBColor(0, 0, 0));
        assert_eq!(hex_to_rgb(0xFF000000), RGBColor(255, 0, 0));
        assert_eq!(hex_to_rgb(0x00FF0000), RGBColor(0, 255, 0));
        assert_eq!(hex_to_rgb(0x0000FF00), RGBColor(0, 0, 255));
    }
}
