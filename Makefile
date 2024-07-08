
.PHONY: clone-tfhe
clone-tfhe:
	@if [ ! -d "tfhe-rs" ]; then \
		git clone https://github.com/fhenixprotocol/tfhe-rs.git; \
		cd tfhe-rs; \
		git checkout origin/fhenixjs-0.3.0-alpha; \
	else \
		echo "Directory tfhe-rs already exists, skipping clone."; \
	fi

.PHONY: gen-tfhe-web-cjs
gen-tfhe-web-cjs: clone-tfhe
	cd tfhe-rs && make build_web_js_api
	cp tfhe-rs/tfhe/pkg/tfhe.js lib/commonjs/sdk/fhe/tfhe-browser.js
	cp tfhe-rs/tfhe/pkg/tfhe.d.ts lib/commonjs/sdk/fhe/tfhe-browser.d.ts
	cp tfhe-rs/tfhe/pkg/tfhe_bg.wasm lib/commonjs/sdk/fhe/tfhe-browser_bg.wasm

.PHONY: gen-tfhe-web-esm
gen-tfhe-node-cjs: clone-tfhe
	cd tfhe-rs && mmake build_node_js_api
	cp tfhe-rs/tfhe/pkg/tfhe.js lib/commonjs/sdk/fhe/tfhe.js
	cp tfhe-rs/tfhe/pkg/tfhe.d.ts lib/commonjs/sdk/fhe/tfhe.d.ts
	cp tfhe-rs/tfhe/pkg/tfhe_bg.wasm lib/commonjs/sdk/fhe/tfhe_bg.wasm

.PHONY: gen-tfhe-node-esm
gen-tfhe-node-esm: clone-tfhe
	cd tfhe-rs && make build_node_esm_js_api
	cp tfhe-rs/tfhe/pkg/tfhe.js lib/esm/sdk/fhe/tfhe.js
	cp tfhe-rs/tfhe/pkg/tfhe.d.ts lib/esm/sdk/fhe/tfhe.d.ts
	cp tfhe-rs/tfhe/pkg/tfhe_bg.js lib/esm/sdk/fhe/tfhe_bg.js
	cp tfhe-rs/tfhe/pkg/tfhe_bg.d.ts lib/esm/sdk/fhe/tfhe_bg.d.ts
	cp tfhe-rs/tfhe/pkg/tfhe_bg.wasm lib/esm/sdk/fhe/tfhe_bg.wasm
