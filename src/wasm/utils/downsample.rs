/*
 * The MIT License

Copyright (c) 2013 by Sveinn Steinarsson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
pub fn lttb_downsample(data: &[f32], threshold: usize) -> Vec<f32> {
    let data_length = data.len();
    if threshold >= data_length || threshold == 0 {
        return data.to_vec();
    }

    if threshold == 1 {
        return vec![data[0]];
    }

    let mut sampled = Vec::<f32>::new();

    // Bucket size. Leave room for start and end data points
    let every = (data_length - 2) as f32 / (threshold - 2) as f32;

    let mut a = 0; // Initially a is the first point in the triangle
    let mut max_area_point = vec![];
    let mut max_area: f32;
    let mut area: f32;
    let mut next_a = 0;

    sampled.push(data[a]); // Always add the first point

    for i in 0..threshold - 2 {
        // Calculate point average for next bucket (containing c)
        let mut avg_x = 0.0;
        let mut avg_y = 0.0;
        let avg_range_start = ((i + 1) as f32 * every).floor() as usize + 1;
        let avg_range_end = ((i + 2) as f32 * every).floor() as usize + 1;
        let avg_range_end = if avg_range_end < data_length {
            avg_range_end
        } else {
            data_length
        };

        let avg_range_length = avg_range_end - avg_range_start;

        for (avg_range_start, _) in data
            .iter()
            .enumerate()
            .take(avg_range_end)
            .skip(avg_range_start)
        {
            avg_x += avg_range_start as f32;
            avg_y += data[avg_range_start];
        }
        avg_x /= avg_range_length as f32;
        avg_y /= avg_range_length as f32;

        // Get the range for this bucket
        let range_offs = (i as f32 * every).floor() as usize + 1;
        let range_to = ((i + 1) as f32 * every).floor() as usize + 1;

        // Point a
        let point_a_x = a as f32;
        let point_a_y = data[a];

        max_area = -1.0;

        for (range_offs, _) in data.iter().enumerate().take(range_to).skip(range_offs) {
            // Calculate triangle area over three buckets
            area = ((point_a_x - avg_x) * (data[range_offs] - point_a_y)
                - (point_a_x - range_offs as f32) * (avg_y - point_a_y))
                .abs()
                * 0.5;
            if area > max_area {
                max_area = area;
                max_area_point = vec![range_offs as f32, data[range_offs]];
                next_a = range_offs; // Next a is this b
            }
        }

        sampled.push(max_area_point[1]); // Pick this point from the bucket
        a = next_a; // This a is the next a (chosen b)
    }

    sampled.push(data[data_length - 1]); // Always add last

    sampled
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn lttb_panic_test() {
        let test_data: &[f32] = &(0..10).map(|i| i as f32).collect::<Vec<f32>>();
        let test_thresholds = [0, 1, 2, 3, 4, 5, 6, 100, 2000, usize::MAX, usize::MIN];

        for threshold in test_thresholds.iter() {
            let downsampled = lttb_downsample(test_data, *threshold);
            println!("{:?}", downsampled);
        }
    }
}
