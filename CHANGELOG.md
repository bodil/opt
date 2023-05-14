# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
