# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
