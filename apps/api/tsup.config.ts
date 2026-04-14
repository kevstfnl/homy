import { defineConfig } from "tsup"

export default defineConfig({
    external: ["hono"],
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    minify: true,
    
    tsconfig: "tsconfig.json",
    entry: {
        index: "./src/index.ts",
        client: "./src/client.ts",
    },
})