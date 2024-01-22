use plotters::prelude::*;
use plotters_canvas::CanvasBackend;
use wasm_bindgen::prelude::*;
use web_sys::HtmlCanvasElement;

use crate::wasm::colors::*;

#[wasm_bindgen]
pub struct Chart {}

#[wasm_bindgen]
impl Chart {
    pub fn draw2d(
        canvas: HtmlCanvasElement,
        data: Vec<f32>,
        framesize: u16,
        frame: u8,
        color: u32,
    ) {
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

        let start_point = frame as usize * framesize as usize;
        let end_point = start_point + framesize as usize;

        let data_to_draw: Vec<(f64, f64)> = data[start_point..end_point]
            .iter()
            .enumerate()
            .map(|(x, &y)| (x as f64, y as f64))
            .collect();

        let fill = hex_to_rgba(color);
        let stroke = hex_to_rgb(color);

        let series = AreaSeries::new(data_to_draw, 0.0, fill).border_style(stroke);

        chart.draw_series(series).unwrap();
    }

    pub fn draw3d(
        canvas: HtmlCanvasElement,
        data: Vec<f32>,
        framesize: u16,
        frame: u8,
        color: u32,
    ) {
        let backend = CanvasBackend::with_canvas_object(canvas).unwrap();
        let number_of_frames = data.len() / framesize as usize;

        let data_range_x = 0.0..framesize as f64;
        let data_range_y = -1.0..1.0;
        let data_range_z = number_of_frames as f64..0.0;

        let root = backend.into_drawing_area();

        let mut chart = ChartBuilder::on(&root)
            .margin(2)
            .build_cartesian_3d(data_range_x, data_range_y, data_range_z)
            .unwrap();

        type Point3d = (f64, f64, f64);
        type Frame = Vec<Point3d>;

        let stroke_sub = hex_to_rgba(color);
        let mut stroke_main = hex_to_rgba(color);
        stroke_main.3 = 1.0;

        for z in 0..number_of_frames {
            let start_point = z * framesize as usize;
            let end_point = start_point + framesize as usize;

            let data_to_draw: Frame = data[start_point..end_point]
                .iter()
                .enumerate()
                .map(|(x, &y)| (x as f64, y as f64, z as f64))
                .collect();

            let stroke = if z as u8 == frame {
                stroke_main
            } else {
                stroke_sub
            };

            let series = LineSeries::new(data_to_draw, stroke);
            chart.draw_series(series).unwrap();
        }
    }
}
