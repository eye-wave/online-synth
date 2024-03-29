use plotters::{
    chart::ChartBuilder, drawing::IntoDrawingArea, series::AreaSeries, style::RGBAColor,
};
use plotters_canvas::CanvasBackend;
use wasm_bindgen::prelude::*;
use web_sys::HtmlCanvasElement;

use crate::wasm::plot::colors::*;

#[wasm_bindgen]
pub struct Chart2d {}

#[wasm_bindgen]
impl Chart2d {
    pub fn draw(canvas: HtmlCanvasElement, data: &[f32], framesize: u16, frame: u8, color: u32) {
        if data.is_empty() {
            return;
        }

        let start_point = frame as usize * framesize as usize;
        let end_point = start_point + framesize as usize;

        if start_point > data.len() {
            return;
        }

        let backend = CanvasBackend::with_canvas_object(canvas).unwrap();
        let data_range_x = 0.0..framesize as f64;
        let data_range_y = -1.0..1.0;

        let root = backend.into_drawing_area();

        let mut chart = ChartBuilder::on(&root)
            .margin(2)
            .build_cartesian_2d(data_range_x, data_range_y)
            .unwrap();

        chart
            .configure_mesh()
            .disable_x_mesh()
            .disable_y_mesh()
            .draw()
            .unwrap();

        let data_to_draw: Vec<(f64, f64)> = data[start_point..end_point]
            .iter()
            .enumerate()
            .map(|(x, &y)| (x as f64, y as f64))
            .collect();

        let stroke = hex_to_rgb(&color);
        let mut fill = RGBAColor::from(hex_to_rgb(&color));
        fill.3 = 0.2;

        let series = AreaSeries::new(data_to_draw, 0.0, fill).border_style(stroke);

        chart.draw_series(series).unwrap();
    }
}
