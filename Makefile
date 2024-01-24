.PHONY: dev build build_wasm wasm_gen wasm_compile wasm_move wasm_node preview format lint check test

NODE_MODULES_BIN := ./node_modules/.bin
export PATH := $(NODE_MODULES_BIN):$(PATH)

PROJECT_NAME := online-synth

# development, builds the wasm and starts Vite development server
dev:
	make build_wasm
	vite

# building the project
build:
	make build_wasm
	vite build

# build the WebAssembly modules
build_wasm:
	make wasm_compile
	make wasm_move

# generating WebAssembly files
wasm_gen:
	find target -name '*.wasm' -not -path '*deps*' -exec wasm-bindgen {} --remove-name-section --split-linked-modules --remove-producers-section --out-dir pkg --target $(target) \;

# compiling Rust code to WebAssembly
wasm_compile:
	cargo build --release --target=wasm32-unknown-unknown

# moving generated WebAssembly to specific directories
wasm_move:
	make wasm_gen target=bundler

# generating WebAssembly bindings for Node.js
wasm_node:
	make wasm_gen target=nodejs

# previewing the built project
preview:
	vite preview

# code formatting using Biome and Prettier
format:
	biome format . --write
	prettier . --write .
	cargo fmt

# linting using Biome and ESLint
lint:
	biome lint . --apply-unsafe
	eslint . --fix

# checking Svelte code for accessibility issues
check:
	svelte-check --tsconfig ./tsconfig.json

# running tests
test:
	make wasm_node
	bun test --coverage
	cargo test

# deploy to vercel
deploy:
	vercel build
	build_url=$$(vercel --prebuilt | grep -o -E 'https:\/\/.+\.app'); \
	vercel promote "$$build_url" -y
	vercel remove $(PROJECT_NAME) --safe -y
