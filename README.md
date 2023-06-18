# opt

Option types for TypeScript with real gradual typing.

## API Docs

Find the API docs here:

* [github.bodil.org/opt](https://github.bodil.org/opt)

## Rationale

There are several million implementations of option types on NPM. Many of them
are implemented in plain JavaScript with no types. Nearly all of the remainder
don't have very good type inference: their `isSome()` function just returns a
boolean rather than a useful `is` assertion, or they exclusively use some other
mechanism, like callbacks, to decide the type of the wrapped value. The very few
cases remaining implement the option type as a simple object manipulated by
external functions, rather than an object with attached methods, making them a
little too cumbersome to work with.

This package gives you both, as well as a complete and fully documented API
inspired by Rust's `Option` and `Result` types.

## Example

[`Result`](http://github.bodil.lol/opt/types/Result.html) in Node:

```typescript
import { Ok, Result } from "@bodil/opt";

const result: Result<Date, Error> = Ok(new Date());

// result.value is Date | Error here.

if (result.isOk()) {
    // the type checker now knows that result.value must be a Date.
    console.log("Date:", result.value.toLocaleString());
} else {
    // the type checker knows result.value must be an Error in the else branch.
    console.log("Error:", result.value.message);
}
```

[`Option`](http://github.bodil.lol/opt/types/Option.html) in Deno:

```typescript
import { Option, Some } from "https://deno.land/x/opt/option.ts";

const option: Option<Date> = Some(new Date());

// option.value is Date | undefined here.

if (option.isSome()) {
    // the type checker now knows option.value is definitely a Date.
    console.log("Date:", option.value.toLocaleString());
} else {
    console.log("No value!");
}
```

## Licence

Copyright 2023 Bodil Stokke

This software is subject to the terms of the Mozilla Public License, v. 2.0. If
a copy of the MPL was not distributed with this file, You can obtain one at
<http://mozilla.org/MPL/2.0/>.
