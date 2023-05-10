import { Option } from "./option.ts";
import { ResultClass } from "./result-impl.ts";
export { ResultClass };

export type Ok<A> = { result: true; value: A };
export type Err<E> = { result: false; value: E };

/**
 * A value which can be of either type `A` or type `E`.
 *
 * This is normally used as a return value for operations which can fail: `E` is short for `Error`.
 */
export type Result<A, E> = (Ok<A> | Err<E>) & IResult<A, E>;

export interface IResult<A, E> {
    /**
     * The `match` function takes two callbacks, one for each possible state of
     * the [[Result]], and calls the one that matches the actual state.
     */
    match<B>(onOk: (value: A) => B, onErr: (value: E) => B): B;

    /**
     * Test if the [[Result]] is [[Ok]].
     */
    isOk(): this is Ok<A>;

    /**
     * Test if the [[Result]] is [[Err]].
     */
    isErr(): this is Err<E>;

    /**
     * Assert that the [[Result]] is [[Ok]].
     */
    assertOk(): asserts this is Ok<A>;

    /**
     * Assert that the [[Result]] is [[Err]].
     */
    assertErr(): asserts this is Err<E>;

    /**
     * Call the provided function with the contained value if the [[Result]] is [[Ok]].
     */
    ifOk(onOk: (value: A) => void): void;

    /**
     * Call the provided function with the contained value if the [[Result]] is [[Err]].
     */
    ifErr(onErr: (value: E) => void): void;

    /**
     * If the [[Result]] is [[Ok]], call the provided function with the
     * contained value and return a new [[Result]] containing the result of the
     * function, which must be another [[Result]]. If the [[Result]] is [[Err]],
     * the [[Err]] is returned unchanged and the function is never called.
     */
    chain<B>(f: (value: A) => Result<B, E>): Result<B, E>;

    /**
     * If the [[Result]] is [[Err]], call the provided function and return its
     * result, which must be another [[Result]]. If the [[Result]] is [[Ok]],
     * the [[Ok]] is returned unchanged and the function is never called.
     */
    chainErr<F>(f: (value: E) => Result<A, F>): Result<A, F>;

    /**
     * If the [[Result]] is [[Ok]], transform its contained value using the provided function.
     */
    map<B>(f: (value: A) => B): Result<B, E>;

    /**
     * If the [[Result]] is [[Err]], transform its contained value using the provided function.
     */
    mapErr<F>(f: (value: E) => F): Result<A, F>;

    apply<B>(f: Result<(a: A) => B, E>): Result<B, E>;

    /**
     * If the [[Result]] is [[Ok]], return the provided [[Result]] of `B`,
     * otherwise return the original result (which would be an [[Err]]).
     */
    and<B>(result: Result<B, E>): Result<B, E>;

    /**
     * If the [[Result]] is [[Err]], return the provided [[Result]], otherwise
     * return the original [[Result]] (which would be an [[Ok]]).
     */
    or<F>(result: Result<A, F>): Result<A, F>;

    /**
     * Return the value contained in the [[Result]] if it's [[Ok]], or return `defaultValue` otherwise.
     */
    getOr(defaultValue: A): A;

    /**
     * Return the value contained in the [[Result]] if it's [[Ok]], or call the provided function and return its result otherwise.
     */
    getOrElse(f: () => A): A;

    /**
     * Converts a [[Result]] into an optional value of `A`, discarding any error value and returning `undefined` in place of the error.
     */
    unwrap(): A | undefined;

    /**
     * Converts a [[Result]] into an optional value of `E`, discarding any success value and returning `undefined` in place of the `A` value.
     */
    unwrapErr(): E | undefined;

    /**
     * Converts a [[Result]] into an [[Option]] of the success value, discarding any error value.
     */
    ok(): Option<A>;

    /**
     * Converts a [[Result]] into an [[Option]] of the error value, discarding any success value.
     */
    err(): Option<E>;

    toJSON(): { result: boolean; value: A | E };
}

export const Result = {
    /**
     * Convert a [[Promise]] returning `A` into a [[Promise]] returning a [[Result]] of either `A` or the `Error` type.
     * The new [[Promise]] always succeeds, reflecting an error condition in the `Result` instead of the failure callback.
     */
    await<A, E extends Error>(m: Promise<A>): Promise<Result<A, E>> {
        return m.then(Ok, Err);
    },

    /**
     * Run a function and return its result as an [[Ok]] if it didn't throw any
     * exceptions, or an [[Err]] containing the thrown exception.
     */
    try<A, E = unknown>(f: () => A): Result<A, E> {
        try {
            return Ok(f());
        } catch (e) {
            return Err(e as E);
        }
    },

    fromJSON<A, E>(doc: { result: boolean; value: A | E }): Result<A, E> {
        return doc.result ? Ok(doc.value as A) : Err(doc.value as E);
    },

    /**
     * Test whether an unknown value is a [[Result]].
     */
    is(value: unknown): value is Result<unknown, unknown> {
        return value instanceof ResultClass;
    },

    Class: ResultClass,
};

/**
 * Construct a [[Result]] with a success value of `A`.
 *
 * ```typescript
 * const systemWorking: Result<string, string> = Ok("Seems to be!");
 * ```
 */
// deno-lint-ignore no-explicit-any
export function Ok<A, E = any>(a: A): Result<A, E> {
    const o = Object.create(ResultClass.prototype);
    o.result = true;
    o.value = a;
    return o;
}

/**
 * Construct a [[Result]] with an error value of `E`.
 *
 * ```typescript
 * const systemWorking: Result<string, string> = Err("System down!");
 * ```
 */
// deno-lint-ignore no-explicit-any
export function Err<E, A = any>(e: E): Result<A, E> {
    const o = Object.create(ResultClass.prototype);
    o.result = false;
    o.value = e;
    return o;
}
