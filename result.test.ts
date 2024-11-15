import {
    assertInstanceOf,
    assertStrictEquals,
    assertThrows,
    assertType,
    type IsExact,
} from "./test_deps.ts";

import { Err, type ErrType, Ok, type OkType, Result } from "./result.ts";
import { assertIsErr, assertOk } from "./asserts.ts";

Deno.test("type inference", () => {
    const a: Result<string, Error> = Ok("frob");
    assertType<IsExact<typeof a.value, string | Error>>(true);
    if (a.isOk()) {
        assertType<IsExact<typeof a.value, string>>(true);
    } else {
        assertType<IsExact<typeof a.value, Error>>(true);
    }

    const e: Result<string, Error> = Err(new Error());
    assertType<IsExact<typeof a.value, string | Error>>(true);
    if (e.isErr()) {
        assertType<IsExact<typeof e.value, Error>>(true);
    } else {
        assertType<IsExact<typeof e.value, string>>(true);
    }

    assertStrictEquals(a.isOk(), true);
    assertStrictEquals(a.isErr(), false);
    assertStrictEquals(e.isOk(), false);
    assertStrictEquals(e.isErr(), true);
});

Deno.test("await", async () => {
    {
        const p = Promise.resolve("frob");
        const pr = Result.await(p);
        const r = await pr;
        r.assertOk();
        assertStrictEquals(r.value, "frob");
    }
    {
        const p = Promise.reject(new Error("frob"));
        const pr = Result.await(p);
        const r = await pr;
        r.assertErr();
        assertInstanceOf(r.value, Error);
        assertStrictEquals(r.value.message, "frob");
    }
});

Deno.test("try", () => {
    const a = Result.try(() => "frob");
    assertStrictEquals(a.isOk(), true);
    assertStrictEquals(a.value, "frob");

    const e = Result.try(() => {
        throw new Error("frob");
    });
    assertStrictEquals(e.isErr(), true);
    assertInstanceOf(e.value, Error);
    assertStrictEquals((e.value as Error).message, "frob");
});

Deno.test("runtime type check", () => {
    assertStrictEquals(Result.is(Ok("welp")), true);
    assertStrictEquals(Result.is(Err("welp")), true);
    assertStrictEquals(Result.is("welp"), false);
});

Deno.test("class name", () => {
    const a = Ok(null);
    assertStrictEquals(Object.getPrototypeOf(a).constructor.name, "Result");

    const e = Err(null);
    assertStrictEquals(Object.getPrototypeOf(e).constructor.name, "Result");
});

Deno.test("lift function", () => {
    function div(n: number, by: number): number {
        if (by === 0) {
            throw new RangeError("division by zero");
        }
        return n / by;
    }
    assertStrictEquals(div(4, 2), 2);
    assertThrows(() => div(4, 0));

    const liftedDiv: (n: number, by: number) => Result<number, RangeError> =
        Result.lift(div);
    assertOk(liftedDiv(4, 2), 2);
    assertIsErr(liftedDiv(4, 0));
});

Deno.test("unwrapExact", () => {
    const a = Ok(5);
    assertStrictEquals(a.unwrapExact(), 5);
    const b = Err(new Error());
    assertThrows(() => b.unwrapExact());
});

Deno.test("OkType | ErrType", () => {
    type testType = Result<"yes" | "no" | boolean, "oops" | Error>;
    assertType<IsExact<OkType<testType>, "yes" | "no" | boolean>>(true);
    assertType<IsExact<ErrType<testType>, "oops" | Error>>(true);
});

Deno.test("await type", () => {
    function foo(_p: Promise<Result<void, Error>>) {}
    const p = Result.await(Promise.resolve());
    foo(p);
});
