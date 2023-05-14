import { assertStrictEquals, assertType, IsExact } from "./test_deps.ts";

import { None, Option, Some } from "./option.ts";

Deno.test("type inference", () => {
    const a: Option<string> = Some("frob");
    assertType<IsExact<typeof a.value, string | never>>(true);
    if (a.isSome()) {
        assertType<IsExact<typeof a.value, string>>(true);
    } else {
        assertType<IsExact<typeof a.value, never>>(true);
    }

    const e: Option<string> = None;
    assertType<IsExact<typeof a.value, string | never>>(true);
    if (e.isNone()) {
        assertType<IsExact<typeof e.value, never>>(true);
    } else {
        assertType<IsExact<typeof e.value, string>>(true);
    }

    assertStrictEquals(a.isSome(), true);
    assertStrictEquals(a.isNone(), false);
    assertStrictEquals(e.isSome(), false);
    assertStrictEquals(e.isNone(), true);
});

Deno.test("runtime type check", () => {
    assertStrictEquals(Option.is(Some("welp")), true);
    assertStrictEquals(Option.is(None), true);
    assertStrictEquals(Option.is("welp"), false);
});

Deno.test("class name", () => {
    const a = Some(null);
    assertStrictEquals(Object.getPrototypeOf(a).constructor.name, "Option");

    const e = None;
    assertStrictEquals(Object.getPrototypeOf(e).constructor.name, "Option");
});
