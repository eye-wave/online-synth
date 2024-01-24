.PHONY: dev build wasm-build wasm-gen wasm-compile wasm-move wasm-node preview format lint check test

NODE_MODULES_BIN := ./node_modules/.bin
export PATH := $(NODE_MODULES_BIN):$(PATH)

PROJECT_NAME := online-synth

# builds the wasm and starts Vite development server
dev: wasm-build
	vite

# install node dependencies
install:
	bun install

# building the project
build: wasm-build
	vite build

# build the WebAssembly modules
wasm-build: wasm-clean wasm-compile wasm-move

# clean pkg directory
wasm-clean:
	rm -rf pkg/*

# generating WebAssembly files
wasm-gen:
	find target -name '*.wasm' -not -path '*deps*' -exec wasm-bindgen {} --remove-name-section --split-linked-modules --remove-producers-section --out-dir pkg --target $(target) \;

# compiling Rust code to WebAssembly
wasm-compile:
	cargo build --release --target=wasm32-unknown-unknown

# moving generated WebAssembly to specific directories
wasm-move: 
	$(MAKE) wasm-gen target=bundler

# generating WebAssembly bindings for Node.js
wasm-node: 
	$(MAKE) wasm-gen target=nodejs

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
test: wasm-node
	bun test --coverage
	cargo test

# deploy to vercel
deploy:
	vercel build
	build_url=$$(vercel --prebuilt | grep -o -E 'https:\/\/.+\.app'); \
	vercel promote "$$build_url" -y
	vercel remove $(PROJECT_NAME) --safe -y
