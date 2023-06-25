import { Option } from "./option.ts";
import { Result } from "./result.ts";
import { assert, assertEquals, assertInstanceOf } from "./test_deps.ts";

export function assertIsSome(actual: unknown, msg?: string) {
    assertInstanceOf(actual, Option.Class, msg);
    const msgSuffix = msg ? `: ${msg}` : "";
    assert(actual.isSome(), `Option is None${msgSuffix}`);
}

export function assertIsNone(actual: unknown, msg?: string) {
    assertInstanceOf(actual, Option.Class, msg);
    const msgSuffix = msg ? `: ${msg}` : "";
    assert(actual.isNone(), `Option is Some${msgSuffix}`);
}

export const assertNone = assertIsNone;

export function assertSome(actual: unknown, expected: unknown, msg?: string) {
    assertInstanceOf(actual, Option.Class, msg);
    const msgSuffix = msg ? `: ${msg}` : "";
    assert(actual.isSome(), `Option is None${msgSuffix}`);
    assertEquals(
        actual.value,
        expected,
        `Option values aren't equal${msgSuffix}`,
    );
}

export function assertIsOk(actual: unknown, msg?: string) {
    assertInstanceOf(actual, Result.Class, msg);
    const msgSuffix = msg ? `: ${msg}` : "";
    assert(actual.isOk(), `Result is Err${msgSuffix}`);
}

export function assertIsErr(actual: unknown, msg?: string) {
    if (Result.is(actual) && actual.isErr()) {
        return;
    }
    assertInstanceOf(actual, Result.Class, msg);
    const msgSuffix = msg ? `: ${msg}` : "";
    assert(actual.isErr(), `Result is Ok${msgSuffix}`);
}

export function assertOk(actual: unknown, expected: unknown, msg?: string) {
    assertInstanceOf(actual, Result.Class, msg);
    const msgSuffix = msg ? `: ${msg}` : "";
    assert(actual.isOk(), `Result is Err${msgSuffix}`);
    assertEquals(
        actual.value,
        expected,
        `Result values aren't equal${msgSuffix}`,
    );
}

export function assertErr(actual: unknown, expected: unknown, msg?: string) {
    assertInstanceOf(actual, Result.Class, msg);
    const msgSuffix = msg ? `: ${msg}` : "";
    assert(actual.isErr(), `Result is Ok${msgSuffix}`);
    assertEquals(
        actual.value,
        expected,
        `Result values aren't equal${msgSuffix}`,
    );
}
