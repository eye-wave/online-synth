use plotters::{
    coord::{ranged3d::Cartesian3d, types::RangedCoordf64},
    prelude::*,
};
use plotters_canvas::CanvasBackend;
use wasm_bindgen::prelude::*;
use web_sys::HtmlCanvasElement;

type Point3d = (f64, f64, f64);
type Frame = Vec<Point3d>;

use crate::{colors::*, Chart3d};

const MARGIN: u32 = 2;

#[wasm_bindgen]
impl Chart3d {
    pub fn draw_bg(
        canvas: HtmlCanvasElement,
        data: Vec<f32>,
        framesize: u16,
        color: u32,
        pitch: f64,
        yaw: f64,
        zoom: f64,
        scale_y: f64,
    ) {
        let backend = CanvasBackend::with_canvas_object(canvas).unwrap();
        let number_of_frames = data.len() / framesize as usize;

        let data_range_x = 0.0..framesize as f64;
        let data_range_y = -1.0..1.0;
        let data_range_z = number_of_frames as f64..0.0;

        let root = backend.into_drawing_area();

        let mut chart = ChartBuilder::on(&root)
            .margin(MARGIN)
            .build_cartesian_3d(data_range_x, data_range_y, data_range_z)
            .unwrap();

        modify_projection(&mut chart, pitch, yaw, zoom);

        let stroke = hex_to_rgba(color);

        for z in 0..number_of_frames {
            let start_point = z * framesize as usize;
            let end_point = start_point + framesize as usize;

            let data_to_draw: Frame = data[start_point..end_point]
                .iter()
                .enumerate()
                .map(|(x, &y)| (x as f64, y as f64 * scale_y, z as f64))
                .collect();

            let series = LineSeries::new(data_to_draw, stroke);
            chart.draw_series(series).unwrap();
        }
    }

    pub fn draw_frame(
        canvas: HtmlCanvasElement,
        data: Vec<f32>,
        framesize: u16,
        frame: u8,
        color: u32,
        pitch: f64,
        yaw: f64,
        zoom: f64,
        scale_y: f64,
    ) {
        let backend = CanvasBackend::with_canvas_object(canvas).unwrap();
        let number_of_frames = data.len() / framesize as usize;

        let data_range_x = 0.0..framesize as f64;
        let data_range_y = -1.0..1.0;
        let data_range_z = number_of_frames as f64..0.0;

        let root = backend.into_drawing_area();

        let mut chart = ChartBuilder::on(&root)
            .margin(MARGIN)
            .build_cartesian_3d(data_range_x, data_range_y, data_range_z)
            .unwrap();

        modify_projection(&mut chart, pitch, yaw, zoom);

        let stroke = hex_to_rgb(color);

        let start_point = frame as usize * framesize as usize;
        let end_point = start_point + framesize as usize;

        let data_to_draw: Frame = data[start_point..end_point]
            .iter()
            .enumerate()
            .map(|(x, &y)| (x as f64, y as f64 * scale_y, frame as f64))
            .collect();

        let series = LineSeries::new(data_to_draw, stroke);
        chart.draw_series(series).unwrap();
    }
}

fn modify_projection(
    chart: &mut ChartContext<
        '_,
        CanvasBackend,
        Cartesian3d<RangedCoordf64, RangedCoordf64, RangedCoordf64>,
    >,
    pitch: f64,
    yaw: f64,
    zoom: f64,
) {
    chart.with_projection(|mut p| {
        p.pitch = pitch;
        p.yaw = yaw;
        p.scale = zoom;

        p.into_matrix()
    });
}
