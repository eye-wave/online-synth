pub fn downsample(data: &[f32], step: usize) -> Vec<f32> {
    let mut result = vec![];

    if step > data.len() {
        return vec![];
    }

    for i in (0..data.len()).step_by(step) {
        if let Some(value) = data.get(i) {
            result.push(*value);
        }
    }

    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_downsample() {
        let data1 = vec![1.0, 2.0, 3.0, 4.0, 5.0];
        let result1 = downsample(&data1, 2);
        assert_eq!(result1, vec![1.0, 3.0, 5.0]);

        let data2 = vec![1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0];
        let result2 = downsample(&data2, 3);
        assert_eq!(result2, vec![1.0, 4.0, 7.0]);

        let data3 = vec![1.0, 2.0, 3.0, 4.0, 5.0];
        let result3 = downsample(&data3, 1);
        assert_eq!(result3, vec![1.0, 2.0, 3.0, 4.0, 5.0]);

        let data4 = vec![1.0, 2.0, 3.0, 4.0, 5.0];
        let result4 = downsample(&data4, 6);
        assert_eq!(result4, Vec::<f32>::new());
    }
}
