use crate::wasm::{plot::colors::*, utils::downsample::downsample};
use plotters::{
    chart::{ChartBuilder, ChartContext},
    coord::{ranged3d::Cartesian3d, types::RangedCoordf64, Shift},
    drawing::{DrawingArea, IntoDrawingArea},
    series::{LineSeries, SurfaceSeries},
    style::RGBAColor,
};
use plotters_canvas::CanvasBackend;
use std::ops::Range;
use wasm_bindgen::prelude::*;
use web_sys::HtmlCanvasElement;

type Point3d = (f64, f64, f64);
type Frame = Vec<Point3d>;

const MARGIN: u32 = 2;

#[wasm_bindgen]
pub struct Chart3d {}

#[wasm_bindgen]
pub struct Chart3dOptions {
    pub color: u32,
    pub pitch: f64,
    pub yaw: f64,
    pub zoom: f64,
    pub scale_y: f64,
}

#[wasm_bindgen]
impl Chart3dOptions {
    #[wasm_bindgen(constructor)]
    pub fn new(color: u32, pitch: f64, yaw: f64, zoom: f64, scale_y: f64) -> Chart3dOptions {
        Chart3dOptions {
            color,
            pitch,
            yaw,
            zoom,
            scale_y,
        }
    }
}

#[wasm_bindgen]
impl Chart3d {
    fn modify_projection(
        chart: &mut ChartContext<
            CanvasBackend,
            Cartesian3d<RangedCoordf64, RangedCoordf64, RangedCoordf64>,
        >,
        pitch: &f64,
        yaw: &f64,
        zoom: &f64,
    ) {
        chart.with_projection(|mut p| {
            p.pitch = *pitch;
            p.yaw = *yaw;
            p.scale = *zoom;

            p.into_matrix()
        });
    }

    fn create_root(canvas: HtmlCanvasElement) -> DrawingArea<CanvasBackend, Shift> {
        let backend = CanvasBackend::with_canvas_object(canvas).unwrap();
        backend.into_drawing_area()
    }

    fn create_chart(
        root: &DrawingArea<CanvasBackend, Shift>,
        data_range_x: Range<f64>,
        data_range_y: Range<f64>,
        data_range_z: Range<f64>,
    ) -> ChartContext<CanvasBackend, Cartesian3d<RangedCoordf64, RangedCoordf64, RangedCoordf64>>
    {
        let chart = ChartBuilder::on(root)
            .margin(MARGIN)
            .build_cartesian_3d(data_range_x, data_range_y, data_range_z)
            .unwrap();

        chart
    }

    pub fn draw_bg(
        canvas: HtmlCanvasElement,
        data: &[f32],
        framesize: usize,
        options: &Chart3dOptions,
    ) {
        if data.is_empty() {
            return;
        }

        let number_of_frames = data.len() / framesize;
        let single_frame = number_of_frames < 2;

        let step = 8;
        let data_downsampled = downsample(data, step);

        let data_range_x = 0.0..(framesize / step) as f64;
        let data_range_y = -2.0..2.0;
        let data_range_z = 0.0..(number_of_frames + single_frame as usize) as f64;

        let root = Self::create_root(canvas);
        let mut chart = Self::create_chart(
            &root,
            data_range_x.clone(),
            data_range_y.clone(),
            data_range_z.clone(),
        );

        Self::modify_projection(&mut chart, &options.pitch, &options.yaw, &options.zoom);

        let mut fill = RGBAColor::from(hex_to_rgb(&options.color));
        fill.3 = 0.05;

        let x_axis = 0..(framesize / step);
        let z_axis = 0..number_of_frames + single_frame as usize;

        chart
            .draw_series(
                SurfaceSeries::xoz(
                    x_axis.map(|x| x as f64),
                    z_axis.map(|z| z as f64 + 1.0),
                    |x, mut z| {
                        z = if single_frame {
                            0.0
                        } else {
                            number_of_frames as f64 - z
                        };

                        let i = ((framesize / step) as f64 * z + x) as usize;
                        let y = data_downsampled.get(i).unwrap_or(&0.0);

                        *y as f64
                    },
                )
                .style(fill),
            )
            .unwrap();
    }

    pub fn draw_frame(
        canvas: HtmlCanvasElement,
        data: &[f32],
        framesize: usize,
        frame: u8,
        options: &Chart3dOptions,
    ) {
        if data.is_empty() {
            return;
        }

        let start_point = frame as usize * framesize;
        let end_point = start_point + framesize;

        if start_point > data.len() {
            return;
        }

        let number_of_frames = data.len() / framesize;
        let data_range_x = 0.0..framesize as f64;
        let data_range_y = -1.0..1.0;
        let data_range_z = number_of_frames as f64..0.0;

        let root = Self::create_root(canvas);
        let mut chart = Self::create_chart(&root, data_range_x, data_range_y, data_range_z);

        Self::modify_projection(&mut chart, &options.pitch, &options.yaw, &options.zoom);

        let stroke = hex_to_rgb(&options.color);

        let data_to_draw: Frame = data[start_point..end_point]
            .iter()
            .enumerate()
            .map(|(x, &y)| (x as f64, y as f64 * options.scale_y, frame as f64))
            .collect();

        let series = LineSeries::new(data_to_draw, stroke);
        chart.draw_series(series).unwrap();
    }
}
