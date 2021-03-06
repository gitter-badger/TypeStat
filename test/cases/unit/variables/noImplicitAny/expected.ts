{
    // Primitives

    let givenUndefined = "";
    givenUndefined = undefined;

    let givenUndefinedAsString: string = "";
    givenUndefinedAsString = undefined;

    let givenUndefinedHasNull: string | null = "";
    givenUndefinedHasNull = undefined;

    let givenNullAndUndefinedHasNull: string | null = "";
    givenNullAndUndefinedHasNull = null;
    givenNullAndUndefinedHasNull = undefined;

    let givenNull = "";
    givenNull = null;

    let givenNullAsString: string = "";
    givenNullAsString = null;

    let givenNullHasUndefined: string | undefined = "";
    givenNullHasUndefined = null;

    let givenNullAndUndefinedHasUndefined: string | undefined = "";
    givenNullAndUndefinedHasUndefined = null;
    givenNullHasUndefined = undefined;

    let givenString: string;
    givenString = "";

    let givenStringAsString: string = "";
    givenStringAsString = "";

    let givenStringHasNull: string | null = "";
    givenStringHasNull = "";

    let givenStringHasUndefined: string | undefined = "";
    givenStringHasNull = "";

    let setToUndefined: string = undefined;

    let setToUndefinedHasNull: string | null = undefined;

    let setToNull: string = null;

    let setToNullAsNull = null;

    let setToNullHasUndefined: string | undefined = null;

    let setToString = "";

    let setToStringAsString: string = "";

    let setToStringHasUndefined: string | undefined = "";

    let setToStringHasNull: string | null = "";

    // Any

    let startsAnyWithString: any = "";

    let startsAnyGivenString: any;
    startsAnyGivenString = "";

    let startsAnyWithStringGivenString: any = "";
    startsAnyWithStringGivenString = "";

    let startsStringWithAny: string = {} as any;

    let startsStringGivenAny: string;
    startsStringGivenAny = {} as any;

    // Void and undefined

    let startsUndefinedWithVoid: undefined = ((): void => {})();

    let startsUndefinedGivenVoid: undefined;
    startsUndefinedGivenVoid = ((): void => {})();

    let startsVoidWithUndefined: void = undefined;

    let startsVoidGivenUndefined: void;
    startsVoidGivenUndefined = undefined;

    let resolveDeclaredVoid: (v: void) => void;
    new Promise<void>((_resolve) => {
        resolve = _resolve;
    });

    // Interfaces and classes

    interface SampleInterface {
        readonly optional?: boolean;
        readonly required: number;
    }

    class SampleClassOne implements SampleInterface {
        readonly required = 1;
    }

    class SampleClassTwo implements SampleInterface {
        readonly optional = false;
        readonly required = 1;
    }

    let onlyInterfaceImplicit = { required: 1 };
    let onlyInterfaceExplicit: SampleInterface = { required: 1 };

    let onlyClassOneImplicit = new SampleClassOne();
    let onlyClassOneExplicitClass: SampleClassOne = new SampleClassOne();
    let onlyClassOneExplicitInterface: SampleInterface = new SampleClassOne();

    let eitherClassImplicit = new SampleClassOne();
    eitherClassImplicit = new SampleClassTwo();

    let eitherClassExplicit: SampleInterface = new SampleClassOne();
    eitherClassExplicit = new SampleClassTwo();

    let eitherClassNeedsUnionImplicit = new SampleClassOne();
    eitherClassNeedsUnionImplicit = new SampleClassTwo();

    let eitherClassNeedsUnionExplicit: SampleClassOne = new SampleClassOne();
    eitherClassNeedsUnionExplicit = new SampleClassTwo();

    let eitherClassNeedsUnionExplicitInterface: SampleInterface = new SampleClassOne();
    eitherClassNeedsUnionExplicit = new SampleClassTwo();

    let eitherClassNeedsNullImplicit = new SampleClassOne();
    eitherClassNeedsNullImplicit = new SampleClassTwo();
    eitherClassNeedsNullImplicit = null;

    let eitherClassNeedsNullAndClassExplicit: SampleClassOne | null = new SampleClassOne();
    eitherClassNeedsNullAndClassExplicit = new SampleClassTwo();
    eitherClassNeedsNullImplicit = null;

    let eitherClassNeedsUndefinedExplicit: SampleClassOne = new SampleClassOne();
    eitherClassNeedsUndefinedExplicit = new SampleClassTwo();
    eitherClassNeedsUndefinedExplicit = undefined;

    let eitherClassNeedsUndefinedExplicitInterface: SampleInterface = new SampleClassOne();
    eitherClassNeedsUndefinedExplicit = new SampleClassTwo();
    eitherClassNeedsUndefinedExplicit = undefined;

    let eitherClassNeedsUndefinedAndClassExplicit: SampleClassOne | undefined = new SampleClassOne();
    eitherClassNeedsUndefinedAndClassExplicit = new SampleClassTwo();
    eitherClassNeedsUndefinedAndClassExplicit = undefined;

    // Array setting
    let numberImplicit = [1];
    numberImplicit = [1];

    let numberExplicitPrimitive: number[] = [1];
    numberExplicitPrimitive = [1];

    let numberExplicitTemplated: Array<number> = [1];
    numberExplicitTemplated = [1] as Array<number>;

    // Array pushes

    let numberEmptyImplicit = [];
    numberImplicit.push(1);

    let numberEmptyExplicit: number[] = [];
    numberEmptyExplicit.push(1);

    let numberFilledImplicit = [1];
    numberFilledImplicit.push(1);

    let numberFilledExplicit: (number | string)[] = [1];
    numberFilledExplicit.push(1);
    numberFilledExplicit.push("");

    let numberFilledExplicitAddedString: number[] = [1];
    numberFilledExplicitAddedString.push(1);
    numberFilledExplicitAddedString.push("");

    let numberOrStringEmptyImplicit = [];
    numberOrStringEmptyImplicit.push(1);
    numberOrStringEmptyImplicit.push("");

    let numberOrStringEmptyExplicit: number[] = [];
    numberOrStringEmptyExplicit.push(1);
    numberOrStringEmptyExplicit.push("");

    let numberOrStringFilledImplicit = [1];
    numberOrStringFilledImplicit.push(1);
    numberOrStringFilledImplicit.push("");

    let numberOrStringFilledExplicit: (number | string)[] = [1];
    numberOrStringFilledExplicit.push(1);
    numberOrStringFilledExplicit.push("");

    let numberOrStringFilledExplicitAddedString: number[] = [1];
    numberOrStringFilledExplicitAddedString.push(1);
    numberOrStringFilledExplicitAddedString.push("");

    // Array Iteration

    const iterableStrings = ["abc", "def", "ghi"];
    for (const string of iterableStrings) {
    }

    const iterableStringOrUndefineds: (string | undefined)[] = ["abc", "def", "ghi"];
    for (const stringOrUndefined of iterableStringOrUndefineds) {
    }

    // Object iteration

    const containsStrings = { a: "a", b: "b" };
    for (const key in containsStrings) {
    }

    const containsStringOrUndefineds: { [i: string]: string | undefined } = {};
    for (const key in containsStringOrUndefineds) {
    }

    // Functions

    let resolve: () => void;
    resolve = () => {};

    new Promise<void>((_resolve) => {
        resolve = _resolve;
    });
}
