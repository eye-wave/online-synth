#!make
.PHONY: dev install format lint build preview wasm-build wasm-build-node wasm-clean wasm-compile wasm-gen test deploy

MAKEFLAGS += --silent

export PATH := ./node_modules/.bin:$(PATH)

project_name := online-synth # vercel project name

target := bundler # wasm target
out_dir := pkg/bundler # wasm output directory

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

# previewing the built project
preview:
	vite preview

# build the WebAssembly modules
wasm-build: wasm-compile wasm-gen

# generating WebAssembly bindings for Node.js
wasm-build-node:
	$(MAKE) wasm-compile
	$(MAKE) wasm-gen target=nodejs out_dir=pkg/node

# clean directory with generated WebAssembly files
wasm-clean:
	mkdir -p pkg/node
	mkdir -p pkg/bundler
	
	rm -rf pkg/node/*
	rm -rf pkg/bundler/*

# compiling Rust code to WebAssembly
wasm-compile:
	RUSTFLAGS="-C debuginfo=0" cargo build --release --target=wasm32-unknown-unknown

# generating WebAssembly files
wasm-gen:
	find target -name '*.wasm' -not -path '*deps*' -exec wasm-bindgen {} \
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
