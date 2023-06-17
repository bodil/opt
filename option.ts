import { OptionClass } from "./option-impl.ts";

import { Result } from "./result.ts";

/**
 * An {@link Option} containing a value.
 */
export type Some<A> = { result: true; value: A };

/**
 * An empty {@link Option}, containing no value.
 */
export type None = { result: false; value: never };

/**
 * `Option<A>` provides a nullable value of type `A`. It's essentially the same
 * as `A | undefined` but with a lot of useful methods attached.
 *
 * You can construct an {@link Option} using either the {@link Some} function to
 * wrap a present value of `A`, or the value {@link None} to signify a null
 * value. You can also convert a value that's `A | undefined` into an
 * {@link Option} by calling {@link Option.from}.
 *
 * @template A The type of the contained value.
 *
 * @see {@link IOption} for methods on {@link Option} objects
 * @see {@link Option} for static methods in the {@link Option} namespace
 */
export type Option<A> = (Some<A> | None) & IOption<A>;

/**
 * Methods available on {@link Option} objects.
 *
 * @template A The type of the contained value.
 */
export interface IOption<A> {
    /**
     * Test if the {@link Option} contains a value.
     */
    isSome(): this is Some<A>;

    /**
     * Test if the {@link Option} is empty.
     */
    isNone(): this is None;

    /**
     * Assert that the {@link Option} contains a value.
     *
     * Throws a {@link TypeError} if it doesn't.
     */
    assertSome(): asserts this is Some<A>;

    /**
     * Assert that the {@link Option} is empty.
     *
     * Throws a {@link TypeError} if it isn't.
     */
    assertNone(): asserts this is None;

    /**
     * The `match` function takes two callbacks, one for each possible state of
     * the {@link Option}, and calls the one that matches the actual state.
     */
    match<B>(onSome: (value: A) => B, onNone: () => B): B;

    /**
     * Call the provided function with the contained value if the {@link Option}
     * isn't empty.
     */
    ifSome(onSome: (value: A) => void): void;

    /**
     * Call the provided function if the {@link Option} is empty.
     */
    ifNone(onNone: () => void): void;

    /**
     * If the {@link Option} isn't empty, call the provided function with the contained value and
     * return a new {@link Option} containing the result of the function, which must
     * be another {@link Option}. If the {@link Option} is empty, return {@link None}
     * without calling the function.
     *
     * This is the monadic bind function, for those who celebrate.
     */
    chain<B>(f: (value: A) => Option<B>): Option<B>;

    /**
     * If the {@link Option} is empty, call the provided function and return its
     * result, which must be another {@link Option} of `A`. If the {@link Option} is
     * {@link Some}, return the {@link Some} value without calling the function.
     */
    chainNone(f: () => Option<A>): Option<A>;

    /**
     * If the {@link Option} isn't empty, transform its contained value using the provided function.
     */
    map<B>(f: (value: A) => B): Option<B>;

    /**
     * Given another {@link Option} containing a function from `A` to `B`, if
     * both {@link Option}s are {@link Some}, call that function with the value
     * of this {@link Option} and return an `Option<B>` containing the
     * function's return value. If either {@link Option} is {@link None}, return
     * {@link None}.
     */
    apply<B>(f: Option<(a: A) => B>): Option<B>;

    /**
     * If the {@link Option} isn't empty, return the provided {@link Option} of `B`, otherwise return {@link None}.
     */
    and<B>(option: Option<B>): Option<B>;

    /**
     * If the {@link Option} is empty, return the provided {@link Option}, otherwise return the original {@link Option}.
     */
    or(option: Option<A>): Option<A>;

    /**
     * Return the value contained in the {@link Option} if it's not empty, or return `defaultValue` otherwise.
     */
    getOr(defaultValue: A): A;

    /**
     * Return the value contained in the {@link Option} if it's not empty, or call the provided function and return its result otherwise.
     */
    getOrElse(f: () => A): A;

    /**
     * Convert the {@link Option} into a {@link Result}, using the provided `error` value if the {@link Option} is empty.
     */
    okOr<E>(error: E): Result<A, E>;

    /**
     * Convert the {@link Option} into a {@link Result}, calling the provided function to obtain an error value if the {@link Option} is empty.
     */
    okOrElse<E>(f: () => E): Result<A, E>;

    /**
     * Convert the {@link Option} into an optional value of `A`.
     */
    unwrap(): A | undefined;

    /**
     * Convert an {@link Option} into a JSON structure for serialisation.
     */
    toJSON(): { result: true; value: A } | { result: false };
}

/**
 * Static methods on the {@link Option} object.
 */
export const Option = {
    /**
     * Create an {@link Option} from a value that's either `A` or `undefined`.
     *
     * If the provided value is `undefined`, it will create a {@link None}.
     * Otherwise, it will create a {@link Some} containing the value.
     *
     * @see IOption.unwrap
     *
     * @example
     * // Guarded index lookup:
     * function getIndex<A>(array: A[], index: number): Option<A> {
     *     return Option.from(array[index]);
     * }
     */
    from<A>(value: A | undefined): Option<A> {
        return value === undefined ? None : Some(value as A);
    },

    /**
     * Create an {@link Option} from the output of {@link IOption.toJSON}.
     */
    fromJSON<A>(doc: { result: boolean; value?: A }): Option<A> {
        return doc.result ? Some(doc.value as A) : None;
    },

    /**
     * Test whether an unknown value is an {@link Option}.
     *
     * @example
     * function assertOption(value: unknown): void {
     *     if (Option.is(value)) {
     *         value.assertSome();
     *     }
     * }
     */
    is(value: unknown): value is Option<unknown> {
        return value instanceof OptionClass;
    },

    /**
     * The class constructor of {@link Option}s. You should never use this to
     * construct {@link Option}s directly, preferring instead {@link Some} and
     * {@link None}. It's exposed for use in `instanceof` checks, though
     * calling {@link Option.is} to decide resultiness is preferred.
     *
     * @example
     * import { expect } from "chai";
     * expect(Some("pony")).to.be.an.instanceof(Option.Class);
     */
    Class: OptionClass,
};

/**
 * Construct an {@link Option} containing the provided value.
 *
 * @example
 * const option: Option<string> = Some("Hello Joe");
 */
export function Some<A>(value: A): Option<A> {
    const o = Object.create(OptionClass.prototype);
    o.result = true;
    o.value = value;
    return o;
}

/**
 * An empty {@link Option}.
 *
 * @example
 * const option: Option<string> = None;
 */
// deno-lint-ignore no-explicit-any
export const None: Option<any> = Object.create(OptionClass.prototype);
None.result = false;
