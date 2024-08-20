# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.2.4] - 2024-08-20

### ADDED

- The NPM package is now backwards compatible with CommonJS modules. (#2, #3 by
  @mjwsteenbergen)

## [0.2.3] - 2024-08-20

### ADDED

- Added utility types `SomeType<T>`, `OkType<T>` and `ErrType<T>` to extract
  type arguments from an `Option` or `Result` type signature.

## [0.2.2] - 2023-12-16

### ADDED

- Added an `unwrapExact()` method to both `Option` and `Result`, which works
  like `unwrap()` except that it throws an error when the value isn't `Some`/`Ok`.

## [0.2.1] - 2023-06-25

### ADDED

- Added `Option.lift()` for turning a function that returns `A | undefined` into
  a function that returns `Option<A>` and `Result.lift()` for turning a function
  that returns `A` and can throw an exception `E` into a function that returns
  `Result<A, E>`. These are the higher order function equivalents of
  `Option.from()` and `Result.try()` respectively.
- Asserts for `deno test` are now available in `asserts.ts`. These are not
  exported to the NPM package.

## [0.2.0] - 2023-06-19

### CHANGED

- The `apply()` method on both `Result` and `Option` has been renamed to `ap()`
  in order to avoid conflicting with the JS built-in `Function.apply()` method.
  This was causing unexpected type errors in unexpected places.

## [0.1.5] - 2023-06-17

### ADDED

- We're now using [Typedoc](https://typedoc.org/) to generate docs for the
  latest release at [https://github.bodil.lol/opt](https://github.bodil.lol/opt).
- Added the `bichain()` method to `Result`, to match `bimap()`. Now you can
  `chain()` and `chainErr()` in a single function! I'd call it a "bimonad" just
  like `bimap()` makes it a bifunctor but that's apparently not a thing.

## [0.1.4] - 2023-06-15

### FIXED

- Removed the interface declaration for static methods on `Option` and `Result`,
  which was added because `deno doc` doesn't render the docs for the static
  object well, because it ended up confusing the type checker to the point of
  unusability.

## [0.1.3] - 2023-05-14

- Added `apply()` to `Option`.
- Added `bimap()` to `Result`.

## [0.1.2] - 2023-05-14

### ADDED

- `Result` now has an `isAborted()` method to check if the result is a
  `DOMException` caused by an `AbortController` being aborted. This is useful
  for checking whether something like `fetch()` has been explicitly aborted
  rather than having failed with an error.

## [0.1.1] - 2023-05-11

### FIXED

- Documentation is now only using JSDoc tags instead of Typedoc syntax.

## [0.1.0] - 2023-05-10

Initial release.
