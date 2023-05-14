import { IOption, None, Option as OptionType, Some } from "./option.ts";
import { Err, Ok, Result } from "./result.ts";

class Option<A> implements IOption<A> {
    readonly result!: boolean;
    readonly value!: A | never;

    match<B>(onSome: (value: A) => B, onNone: () => B): B {
        return this.isSome() ? onSome(this.value) : onNone();
    }

    isSome(): this is Some<A> {
        return this.result;
    }

    assertSome(): asserts this is Some<A> {
        if (!this.isSome()) {
            throw new TypeError("Expected Some but got None");
        }
    }

    isNone(): this is None {
        return !this.result;
    }

    assertNone(): asserts this is None {
        if (!this.isNone()) {
            throw new TypeError("Expected None but got Some");
        }
    }

    ifSome(onSome: (value: A) => void) {
        if (this.isSome()) {
            onSome(this.value);
        }
    }

    ifNone(onNone: () => void) {
        if (this.isNone()) {
            onNone();
        }
    }

    chain<B>(f: (value: A) => OptionType<B>): OptionType<B> {
        return this.isSome() ? f(this.value) : None;
    }

    chainNone(f: () => OptionType<A>): OptionType<A> {
        return this.isNone() ? f() : (this as OptionType<A>);
    }

    map<B>(f: (value: A) => B): OptionType<B> {
        return this.isSome() ? Some(f(this.value)) : None;
    }

    and<B>(option: OptionType<B>): OptionType<B> {
        return this.isNone() ? option : None;
    }

    or(option: OptionType<A>): OptionType<A> {
        return this.isNone() ? this : option;
    }

    getOr(defaultValue: A): A {
        return this.isSome() ? this.value : defaultValue;
    }

    getOrElse(f: () => A): A {
        return this.isSome() ? this.value : f();
    }

    okOr<E>(error: E): Result<A, E> {
        return this.isSome() ? Ok(this.value) : Err(error);
    }

    okOrElse<E>(f: () => E): Result<A, E> {
        return this.isSome() ? Ok(this.value) : Err(f());
    }

    unwrap(): A | undefined {
        return this.isSome() ? this.value : undefined;
    }

    toJSON(): { result: true; value: A } | { result: false } {
        return this.isSome()
            ? { result: true, value: this.value }
            : { result: false };
    }
}

export { Option as OptionClass };
