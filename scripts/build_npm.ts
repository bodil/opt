// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt@0.35.0/mod.ts";

await emptyDir("./npm");

await build({
    scriptModule: false,
    entryPoints: ["./mod.ts"],
    outDir: "./npm",
    shims: {
        // see JS docs for overview and more options
        deno: true,
    },
    package: {
        // package.json properties
        name: "@bodil/opt",
        version: Deno.args[0],
        description: "Option types for TypeScript with real gradual typing.",
        license: "MPL-2.0+",
        repository: {
            type: "git",
            url: "git+https://github.com/bodil/opt.git",
        },
        bugs: {
            url: "https://github.com/bodil/opt/issues",
        },
    },
    postBuild() {
        // steps to run after building and before running the tests
        Deno.copyFileSync("LICENSE", "npm/LICENSE");
        Deno.copyFileSync("README.md", "npm/README.md");
    },
});
