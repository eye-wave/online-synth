#!/bin/bash

if ! command -v amazon-linux-extras &> /dev/null; then
  uname -a
  echo "current enviroment is not amazon-linux-extras"
  exit 1
fi

amazon-linux-extras install rust1
cargo install wasm-bindgen-cli
