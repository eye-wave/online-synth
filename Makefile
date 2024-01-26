.PHONY: dev install format lint build preview wasm-build wasm-clean wasm-compile wasm-gen wasm-gen-node test deploy

NODE_MODULES_BIN := ./node_modules/.bin
export PATH := $(NODE_MODULES_BIN):$(PATH)

PROJECT_NAME := online-synth
target := bundler

# builds the wasm and starts Vite development server
dev: wasm-build
	vite

# install node dependencies
install:
	bun install

# code formatting using Biome, Prettier and Cargo
format:
	biome format . --write
	prettier . --write .
	cargo fmt

# linting using Biome, ESLint, Clippy and svelte-check
lint:
	biome lint . --apply-unsafe || true
	eslint . --fix || true
	cargo clippy || true
	svelte-check --tsconfig ./tsconfig.json

# building the project
build: wasm-build
	vite build

# previewing the built project
preview:
	vite preview

# build the WebAssembly modules
wasm-build: wasm-clean wasm-compile wasm-gen

# clean directory with generated WebAssembly files
wasm-clean:
	mkdir -p pkg && rm -rf pkg/*

# compiling Rust code to WebAssembly
wasm-compile:
	cargo build --release --target=wasm32-unknown-unknown

# generating WebAssembly files
wasm-gen:
	find target -name '*.wasm' -not -path '*deps*' -exec wasm-bindgen {} \
		--remove-name-section \
		--split-linked-modules \
		--remove-producers-section \
		--out-dir pkg \
		--target $(target) \;

# generating WebAssembly bindings for Node.js
wasm-gen-node: 
	$(MAKE) wasm-gen target=nodejs

# running tests
test: wasm-gen-node
	bun test --coverage
	cargo test

# deploy to vercel
deploy:
	vercel build
	build_url=$$(vercel --prebuilt | grep -o -E 'https:\/\/.+\.app'); \
	vercel promote "$$build_url" -y
	vercel remove $(PROJECT_NAME) --safe -y
