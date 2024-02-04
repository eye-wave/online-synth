#[macro_export]
macro_rules! web_log {
    ($($arg:tt)*) => {{
        use web_sys::console;

        let msg = format!($($arg)*);

        console::log_1(&msg.into());
    }};
}
