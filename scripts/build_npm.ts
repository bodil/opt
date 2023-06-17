// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt@0.35.0/mod.ts";

async function getGitTags(): Promise<string[]> {
    const versions = new TextDecoder().decode(
        (await new Deno.Command("git", {
            args: ["tag", "--sort=-version:refname"],
        }).output()).stdout,
    ).split("\n");
    versions.pop();
    return versions;
}

const version = Deno.args[0] !== "auto"
    ? Deno.args[0]
    : (await getGitTags()).shift();
if (
    version !== undefined &&
    /^[0-9]+\.[0-9]+\.[0-9]+$/.exec(version) === null
) {
    console.error("Invalid version provided (or detected):", version);
    Deno.exit(1);
}

await emptyDir("./npm");

await build({
    scriptModule: false,
    entryPoints: ["./mod.ts"],
    outDir: "./npm",
    shims: {
        // see JS docs for overview and more options
        deno: "dev",
    },
    compilerOptions: { lib: ["esnext", "dom"] },
    package: {
        // package.json properties
        name: "@bodil/opt",
        version: version!,
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

if (version !== undefined) {
    Deno.exit(0);
}

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
        "includeVersion": false,
        "plugin": ["typedoc-plugin-mdn-links"],
    })),
);
await new Deno.Command("npm", {
    args: ["add", "-D", "typedoc", "typedoc-plugin-mdn-links"],
    cwd: "./npm",
    stdout: "inherit",
    stderr: "inherit",
}).output();
await new Deno.Command("npm", {
    args: ["exec", "typedoc"],
    cwd: "./npm",
    stdout: "inherit",
    stderr: "inherit",
}).output();
