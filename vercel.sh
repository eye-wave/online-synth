#!/bin/bash

if ! command -v amazon-linux-extras &> /dev/null; then
  uname -a
  echo "current enviroment is not amazon-linux-extras"
  exit 1
fi

amazon-linux-extras install rust1

export PATH=$PATH:/vercel/.cargo/bin

cargo install wasm-bindgen-cli
