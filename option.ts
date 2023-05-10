import { OptionClass } from "./option-impl.ts";

import { Result } from "./result.ts";

export type Some<A> = { result: true; value: A };
export type None = { result: false; value: never };

export type Option<A> = (Some<A> | None) & IOption<A>;

export const Option = {
    from<A>(value: A | undefined): Option<A> {
        return value === undefined ? None : Some(value as A);
    },

    fromJSON<A>(doc: { result: boolean; value?: A }): Option<A> {
        return doc.result ? Some(doc.value as A) : None;
    },

    /**
     * Test whether an unknown value is an [[Option]].
     */
    is(value: unknown): value is Option<unknown> {
        return value instanceof OptionClass;
    },

    Class: OptionClass,
};

export interface IOption<A> {
    /**
     * The `match` function takes two callbacks, one for each possible state of
     * the [[Option]], and calls the one that matches the actual state.
     */
    match<B>(onSome: (value: A) => B, onNone: () => B): B;

    /**
     * Test if the [[Option]] contains a value.
     */
    isSome(): this is Some<A>;

    /**
     * Test if the [[Option]] is empty.
     */
    isNone(): this is None;

    /**
     * Assert that the [[Option]] contains a value.
     *
     * Throws a [[TypeError]] if it doesn't.
     */
    assertSome(): asserts this is Some<A>;

    /**
     * Assert that the [[Option]] is empty.
     *
     * Throws a [[TypeError]] if it isn't.
     */
    assertNone(): asserts this is None;

    /**
     * Call the provided function with the contained value if the [[Option]]
     * isn't empty.
     */
    ifSome(onSome: (value: A) => void): void;

    /**
     * Call the provided function if the [[Option]] is empty.
     */
    ifNone(onNone: () => void): void;

    /**
     * If the [[Option]] isn't empty, call the provided function with the contained value and
     * return a new [[Option]] containing the result of the function, which must
     * be another [[Option]]. If the [[Option]] is empty, return [[None]]
     * without calling the function.
     */
    chain<B>(f: (value: A) => Option<B>): Option<B>;

    /**
     * If the [[Option]] is empty, call the provided function and return its
     * result, which must be another [[Option]] of `A`. If the [[Option]] is
     * [[Some]], return the [[Some]] value without calling the function.
     */
    chainNone(f: () => Option<A>): Option<A>;

    /**
     * If the [[Option]] isn't empty, transform its contained value using the provided function.
     */
    map<B>(f: (value: A) => B): Option<B>;

    /**
     * If the [[Option]] isn't empty, return the provided [[Option]] of `B`, otherwise return [[None]].
     */
    and<B>(option: Option<B>): Option<B>;

    /**
     * If the [[Option]] is empty, return the provided [[Option]], otherwise return the original [[Option]].
     */
    or(option: Option<A>): Option<A>;

    /**
     * Return the value contained in the [[Option]] if it's not empty, or return `defaultValue` otherwise.
     */
    getOr(defaultValue: A): A;

    /**
     * Return the value contained in the [[Option]] if it's not empty, or call the provided function and return its result otherwise.
     */
    getOrElse(f: () => A): A;

    /**
     * Convert the [[Option]] into a [[Result]], using the provided `error` value if the [[Option]] is empty.
     */
    okOr<E>(error: E): Result<A, E>;

    /**
     * Convert the [[Option]] into a [[Result]], calling the provided function to obtain an error value if the [[Option]] is empty.
     */
    okOrElse<E>(f: () => E): Result<A, E>;

    /**
     * Convert the [[Option]] into an optional value of `A`.
     */
    unwrap(): A | undefined;

    toJSON(): { result: true; value: A } | { result: false };
}

/**
 * Construct an [[Option]] containing the provided value.
 *
 * ```typescript
 * const option: Option<string> = Some("Hello Joe");
 * ```
 */
export function Some<A>(value: A): Option<A> {
    const o = Object.create(OptionClass.prototype);
    o.result = true;
    o.value = value;
    return o;
}

/**
 * An empty [[Option]].
 *
 * ```typescript
 * const option: Option<string> = None;
 * ```
 */
// deno-lint-ignore no-explicit-any
export const None: Option<any> = Object.create(OptionClass.prototype);
None.result = false;
