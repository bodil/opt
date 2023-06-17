// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt@0.35.0/mod.ts";

const version = (Deno.args.length > 0 && Deno.args[0].trim() !== "")
    ? Deno.args[0]
    : new TextDecoder().decode(
        (await new Deno.Command("git", {
            args: ["tag", "--sort=-version:refname"],
        }).output()).stdout,
    ).split("\n").shift();
if (
    version === undefined || version.trim().length < 1 ||
    /^[0-9]+\.[0-9]+\.[0-9]+$/.exec(version) === null
) {
    throw new Error(`Invalid version string provided: "${version}"`);
}

await emptyDir("./npm");

await build({
    scriptModule: false,
    entryPoints: ["./mod.ts"],
    outDir: "./npm",
    packageManager: "pnpm",
    shims: {
        // see JS docs for overview and more options
        deno: "dev",
    },
    compilerOptions: { lib: ["esnext", "dom"] },
    package: {
        // package.json properties
        name: "@bodil/opt",
        version,
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

await Deno.writeFile(
    "./npm/tsconfig.json",
    new TextEncoder().encode(JSON.stringify({
        "compilerOptions": {
            "target": "ES2022",
            "module": "ES2022",
            "moduleResolution": "Node",
            "lib": ["ES2022", "DOM"],
            "noEmit": true,
            "strict": true,
            "forceConsistentCasingInFileNames": true,
            "experimentalDecorators": true,
            "noImplicitAny": true,
            "strictNullChecks": true,
            "noImplicitThis": true,
            "alwaysStrict": true,
            "skipLibCheck": true,
            "allowSyntheticDefaultImports": true,
        },
        "exclude": ["node_modules/**"],
    })),
);
await Deno.writeFile(
    "./npm/typedoc.json",
    new TextEncoder().encode(JSON.stringify({
        "$schema": "https://typedoc.org/schema.json",
        "name": "opt",
        "out": "./doc",
        "entryPoints": [
            "types/mod.d.ts",
        ],
        "excludeNotDocumented": false,
        "excludeInternal": true,
        // "theme": "hierarchy",
        "includeVersion": true,
        "plugin": ["typedoc-plugin-mdn-links"],
    })),
);
await new Deno.Command("pnpm", {
    args: ["add", "-D", "typedoc", "typedoc-plugin-mdn-links"],
    cwd: "./npm",
    stdout: "inherit",
    stderr: "inherit",
}).output();
await new Deno.Command("pnpm", {
    args: ["typedoc"],
    cwd: "./npm",
    stdout: "inherit",
    stderr: "inherit",
}).output();
