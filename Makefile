#!make
.PHONY: dev install format lint build analyze preview wasm-build wasm-build-node wasm-compile wasm-gen test deploy

MAKEFLAGS += --silent

export PATH := ./node_modules/.bin:$(PATH)

project_name := "online-synth" # vercel project name

target := "bundler" # wasm target
out_dir := "target/wasm-bundler" # wasm output directory
wasm_target := "wasm32-unknown-unknown" # wasm target for cargo

# builds the wasm and starts Vite development server
dev: wasm-build
	vite

# install node dependencies
install: wasm-clean
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
	NODE_ENV=production vite build

# analyze the size of the project
analyze:
	cargo bloat
	VITE_ANALYZE=true $(MAKE) build
	xdg-open dist/vite_bundle_analytics.html

# previewing the built project
preview:
	vite preview

# build the WebAssembly modules
wasm-build: wasm-compile wasm-gen

# generating WebAssembly bindings for Node.js
wasm-build-node:
	$(MAKE) wasm-compile
	$(MAKE) wasm-gen target=nodejs out_dir=target/wasm-node

# compiling Rust code to WebAssembly
wasm-compile:
	RUSTFLAGS="-C debuginfo=0" cargo build --release --target=$(wasm_target)

# generating WebAssembly files
wasm-gen:
	find target/$(wasm_target) -name '*.wasm' -not -path '*deps*' -exec wasm-bindgen {} \
		--remove-name-section \
		--split-linked-modules \
		--remove-producers-section \
		--out-dir $(out_dir) \
		--target $(target) \;

# running tests
test: wasm-build-node
	bun test --coverage || true
	cargo test

# deploy to vercel
deploy: build
	vercel build
	build_url=$$(vercel --prebuilt | grep -o -E 'https:\/\/.+\.app'); \
	vercel promote "$$build_url" -y
	vercel remove $(project_name) --safe -y
