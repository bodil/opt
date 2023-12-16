import { Err, IResult, Ok, Result as ResultType } from "./result.ts";
import { None, Option, Some } from "./option.ts";

class Result<A, E> implements IResult<A, E> {
    readonly result!: boolean;
    readonly value!: A | E;

    match<B>(onOk: (value: A) => B, onErr: (value: E) => B): B {
        return this.isOk() ? onOk(this.value) : onErr(this.value as E);
    }

    isOk(): this is Ok<A> {
        return this.result;
    }

    isErr(): this is Err<E> {
        return !this.result;
    }

    assertOk(): asserts this is Ok<A> {
        if (!this.isOk()) {
            throw new TypeError("Expected Ok but got Err");
        }
    }

    assertErr(): asserts this is Err<E> {
        if (!this.isErr()) {
            throw new TypeError("Expected Err but got Ok");
        }
    }

    ifOk(onOk: (value: A) => void) {
        if (this.isOk()) {
            onOk(this.value);
        }
    }

    ifErr(onErr: (value: E) => void) {
        if (this.isErr()) {
            onErr(this.value);
        }
    }

    chain<B>(f: (value: A) => ResultType<B, E>): ResultType<B, E> {
        if (this.isOk()) {
            return f(this.value);
        }
        return this as unknown as ResultType<B, E>;
    }

    chainErr<F>(f: (value: E) => ResultType<A, F>): ResultType<A, F> {
        if (this.isErr()) {
            return f(this.value);
        }
        return this as unknown as ResultType<A, F>;
    }

    bichain<B, F>(
        ok: (okValue: A) => ResultType<B, F>,
        err: (errValue: E) => ResultType<B, F>,
    ): ResultType<B, F> {
        return this.isOk() ? ok(this.value) : err(this.value as E);
    }

    map<B>(f: (value: A) => B): ResultType<B, E> {
        if (this.isOk()) {
            return Ok(f(this.value));
        }
        return this as unknown as ResultType<B, E>;
    }

    mapErr<F>(f: (value: E) => F): ResultType<A, F> {
        if (this.isErr()) {
            return Err(f(this.value));
        }
        return this as unknown as ResultType<A, F>;
    }

    bimap<B, F>(
        ok: (okValue: A) => B,
        err: (errValue: E) => F,
    ): ResultType<B, F> {
        return this.isOk() ? Ok(ok(this.value)) : Err(err(this.value as E));
    }

    ap<B>(f: ResultType<(a: A) => B, E>): ResultType<B, E> {
        if (f.isErr()) {
            return f as unknown as ResultType<B, E>;
        }
        if (this.isOk()) {
            return Ok(f.value(this.value));
        }
        return this as unknown as ResultType<B, E>;
    }

    and<B>(result: ResultType<B, E>): ResultType<B, E> {
        return this.isOk() ? result : (this as unknown as ResultType<B, E>);
    }

    or<F>(result: ResultType<A, F>): ResultType<A, F> {
        return this.isErr() ? (this as unknown as ResultType<A, F>) : result;
    }

    getOr(defaultValue: A): A {
        return this.isOk() ? this.value : defaultValue;
    }

    getOrElse(f: () => A): A {
        return this.isOk() ? this.value : f();
    }

    unwrap(): A | undefined {
        return this.isOk() ? this.value : undefined;
    }

    unwrapErr(): E | undefined {
        return this.isErr() ? this.value : undefined;
    }

    unwrapExact(): A {
        if (this.isErr()) {
            throw this.value;
        } else {
            return this.value as A;
        }
    }

    ok(): Option<A> {
        return this.isOk() ? Some(this.value) : None;
    }

    err(): Option<E> {
        return this.isErr() ? Some(this.value) : None;
    }

    isAborted(): this is Err<DOMException> {
        return (
            this.isErr() && this.value instanceof DOMException &&
            this.value.name === "AbortError"
        );
    }

    toJSON(): { result: boolean; value: A | E } {
        return { result: this.result, value: this.value };
    }
}

export { Result as ResultClass };
