# Custom Mutators

TypeStat allows adding custom mutators after the built-in mutators, similar to [custom TSLint rules](https://palantir.github.io/tslint/develop/custom-rules).

## Usage

Use the `-a`/`--add` CLI flag and/or `mutators` configuration setting to add `require`-style paths of mutators to add.

```shell
typestat --add my-mutator-module
```

```json
{
    "mutators": [
        "my-mutator-module"
    ]
}
```

These will be run in order of inclusion, starting with mutators specified on the CLI.

## Development

In order to create a custom mutator included by an added path, that added path must resolve from Node's `require` to a file that exports a `.mutator` function.

That `mutator` will receive a single `request` parameter of type [`FileMutationsRequest`](../src/mutators/fileMutator).
It should return an array of Automutate `IMutation` objects.

For example, if you run `typestat --add ./src/mutators/myMutator`, there should exist a `./src/mutators/myMutator.js` file _(or `./src/mutators/myMutator/index.js`)_:

```typescript
import { IMutation } from "automutate";
import { FileMutationsRequest } from "typestat";

export const mutator = (request: FileMutationsRequest): IMutation[] => {
    // TODO: Implement!
    return [];
};
```

Mutators must be compiled to JavaScript to be run.
