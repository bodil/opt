import { Option } from "./option.ts";
import { ResultClass } from "./result-impl.ts";

/**
 * A {@link Result} containing a success value.
 */
export type Ok<A> = { result: true; value: A };
/**
 * A {@link Result} containing an error value.
 */
export type Err<E> = { result: false; value: E };

/**
 * A value which can be of either type `A` or type `E`.
 *
 * This is normally used as a return value for operations which can fail: `E` is short for `Error`.
 * `A` can be thought of as the success value, and `E` is the
 * error value. This is reflected in their constructors: to construct a success
 * value, you call {@link Ok}, and to construct an error value, you call {@link Err}.
 *
 * @see IResult
 */
export type Result<A, E> = (Ok<A> | Err<E>) & IResult<A, E>;

/**
 * @external Promise
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise}
 */

/**
 * @external DOMException
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMException}
 */

/**
 * @external AbortController
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortController}
 */

/**
 * Methods available on {@link Result} objects.
 */
export interface IResult<A, E> {
    /**
     * The `match` function takes two callbacks, one for each possible state of
     * the {@link Result}, and calls the one that matches the actual state.
     */
    match<B>(onOk: (value: A) => B, onErr: (value: E) => B): B;

    /**
     * Test if the {@link Result} is {@link Ok}.
     */
    isOk(): this is Ok<A>;

    /**
     * Test if the {@link Result} is {@link Err}.
     */
    isErr(): this is Err<E>;

    /**
     * Assert that the {@link Result} is {@link Ok}.
     */
    assertOk(): asserts this is Ok<A>;

    /**
     * Assert that the {@link Result} is {@link Err}.
     */
    assertErr(): asserts this is Err<E>;

    /**
     * Call the provided function with the contained value if the {@link Result} is {@link Ok}.
     */
    ifOk(onOk: (value: A) => void): void;

    /**
     * Call the provided function with the contained value if the {@link Result} is {@link Err}.
     */
    ifErr(onErr: (value: E) => void): void;

    /**
     * If the {@link Result} is {@link Ok}, call the provided function with the
     * contained value and return a new {@link Result} containing the result of the
     * function, which must be another {@link Result}. If the {@link Result} is {@link Err},
     * the {@link Err} is returned unchanged and the function is never called.
     */
    chain<B>(f: (value: A) => Result<B, E>): Result<B, E>;

    /**
     * If the {@link Result} is {@link Err}, call the provided function and return its
     * result, which must be another {@link Result}. If the {@link Result} is {@link Ok},
     * the {@link Ok} is returned unchanged and the function is never called.
     */
    chainErr<F>(f: (value: E) => Result<A, F>): Result<A, F>;

    /**
     * If the {@link Result} is {@link Ok}, transform its contained value using the provided function.
     */
    map<B>(f: (value: A) => B): Result<B, E>;

    /**
     * If the {@link Result} is {@link Err}, transform its contained value using the provided function.
     */
    mapErr<F>(f: (value: E) => F): Result<A, F>;

    apply<B>(f: Result<(a: A) => B, E>): Result<B, E>;

    /**
     * If the {@link Result} is {@link Ok}, return the provided {@link Result} of `B`,
     * otherwise return the original result (which would be an {@link Err}).
     */
    and<B>(result: Result<B, E>): Result<B, E>;

    /**
     * If the {@link Result} is {@link Err}, return the provided {@link Result}, otherwise
     * return the original {@link Result} (which would be an {@link Ok}).
     */
    or<F>(result: Result<A, F>): Result<A, F>;

    /**
     * Return the value contained in the {@link Result} if it's {@link Ok}, or return `defaultValue` otherwise.
     */
    getOr(defaultValue: A): A;

    /**
     * Return the value contained in the {@link Result} if it's {@link Ok}, or call the provided function and return its result otherwise.
     */
    getOrElse(f: () => A): A;

    /**
     * Converts a {@link Result} into an optional value of `A`, discarding any error value and returning `undefined` in place of the error.
     */
    unwrap(): A | undefined;

    /**
     * Converts a {@link Result} into an optional value of `E`, discarding any success value and returning `undefined` in place of the `A` value.
     */
    unwrapErr(): E | undefined;

    /**
     * Converts a {@link Result} into an {@link Option} of the success value, discarding any error value.
     */
    ok(): Option<A>;

    /**
     * Converts a {@link Result} into an {@link Option} of the error value, discarding any success value.
     */
    err(): Option<E>;

    /**
     * Test if the {@link Result} is an {@link Err} containing a
     * {@link DOMException} caused by an
     * {@link AbortController} aborting.
     */
    isAborted(): this is Err<DOMException>;

    /**
     * Convert a {@link Result} into a JSON structure for serialisation.
     */
    toJSON(): { result: boolean; value: A | E };
}

export const Result = {
    /**
     * Convert a {@link Promise} returning `A` into a {@link Promise} returning a {@link Result} of either `A` or the `Error` type.
     * The new {@link Promise} always succeeds, reflecting an error condition in the `Result` instead of the failure callback.
     */
    await<A, E extends Error>(m: Promise<A>): Promise<Result<A, E>> {
        return m.then(Ok, Err);
    },

    /**
     * Run a function and return its result as an {@link Ok} if it didn't throw any
     * exceptions, or an {@link Err} containing the thrown exception.
     */
    try<A, E = unknown>(f: () => A): Result<A, E> {
        try {
            return Ok(f());
        } catch (e) {
            return Err(e as E);
        }
    },

    /**
     * Create a {@link Result} from the output of {@link Result#toJSON}.
     */
    fromJSON<A, E>(doc: { result: boolean; value: A | E }): Result<A, E> {
        return doc.result ? Ok(doc.value as A) : Err(doc.value as E);
    },

    /**
     * Test whether an unknown value is a {@link Result}.
     */
    is(value: unknown): value is Result<unknown, unknown> {
        return value instanceof ResultClass;
    },

    /**
     * The class constructor of {@link Result}s. You should never use this to
     * construct {@link Result}s directly, preferring instead {@link Ok} and
     * {@link Err}. It's exposed for use in `instanceof` checks, though
     * calling {@link Result.is} to decide resultiness is preferred.
     */
    Class: ResultClass,
};

/**
 * Construct a {@link Result} with a success value of `A`.
 *
 * @example
 * const systemWorking: Result<string, string> = Ok("Seems to be!");
 */
// deno-lint-ignore no-explicit-any
export function Ok<A, E = any>(a: A): Result<A, E> {
    const o = Object.create(ResultClass.prototype);
    o.result = true;
    o.value = a;
    return o;
}

/**
 * Construct a {@link Result} with an error value of `E`.
 *
 * @example
 * const systemWorking: Result<string, string> = Err("System down!");
 */
// deno-lint-ignore no-explicit-any
export function Err<E, A = any>(e: E): Result<A, E> {
    const o = Object.create(ResultClass.prototype);
    o.result = false;
    o.value = e;
    return o;
}
