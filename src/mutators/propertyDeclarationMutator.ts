import * as tsutils from "tsutils";
import * as ts from "typescript";

import { IMutation } from "automutate";
import { canNodeBeFixedForNoImplicitAny, getNoImplicitAnyMutations } from "../mutations/codeFixes/noImplicitAny";
import { createTypeAdditionMutation, createTypeCreationMutation } from "../mutations/creators";
import { findNodeByStartingPosition } from "../shared/nodes";
import { isNodeWithType } from "../shared/nodeTypes";
import { FileMutationsRequest, FileMutator } from "./fileMutator";

export const propertyDeclarationMutator: FileMutator = (request: FileMutationsRequest): ReadonlyArray<IMutation> => {
    const mutations: IMutation[] = [];

    const visitNode = (node: ts.Node) => {
        if (ts.isPropertyDeclaration(node)) {
            const mutation = visitPropertyDeclaration(node, request);

            if (mutation !== undefined) {
                mutations.push(mutation);
            }
        }

        ts.forEachChild(node, visitNode);
    };

    ts.forEachChild(request.sourceFile, visitNode);

    return mutations;
};

const visitPropertyDeclaration = (node: ts.PropertyDeclaration, request: FileMutationsRequest): IMutation | undefined => {
    // If the property violates --noImplicitAny (has no type or initializer), this can only be a --noImplicitAny fix
    if (canNodeBeFixedForNoImplicitAny(node)) {
        return getNoImplicitAnyMutations(node, request);
    }

    // If we don't add missing types, there's nothing else to do
    if (!request.options.fixes.incompleteTypes) {
        return undefined;
    }

    // Collect types later assigned to the property, and types initially declared by or inferred on the property
    const assignedTypes = collectPropertyAssignedTypes(node, request);
    const declaredType = request.services.program.getTypeChecker().getTypeAtLocation(node);

    // If the property already has a declared type, add assigned types to it if necessary
    if (isNodeWithType(node)) {
        return createTypeAdditionMutation(request, node, declaredType, assignedTypes);
    }

    // Since the parameter doesn't have its own type, give it one if necessary
    return createTypeCreationMutation(request, node, declaredType, assignedTypes);
};

const collectPropertyAssignedTypes = (node: ts.PropertyDeclaration, request: FileMutationsRequest): ReadonlyArray<ts.Type> => {
    const assignedTypes: ts.Type[] = [];

    // If the property has an initial value, consider that an assignment
    if (node.initializer !== undefined) {
        assignedTypes.push(request.services.program.getTypeChecker().getTypeAtLocation(node.initializer));
    }

    // If the property is marked as readonly, don't bother checking for more types
    if (tsutils.isModifierFlagSet(node, ts.ModifierFlags.Readonly)) {
        return assignedTypes;
    }

    // Find everything else referencing the property, since non-private properties can be assigned to in other files
    // https://github.com/JoshuaKGoldberg/TypeStat/issues/4 tracks shortcutting this for private properties
    const referencedSymbols = request.services.languageService.findReferences(
        request.sourceFile.fileName,
        node.getStart(request.sourceFile),
    );
    if (referencedSymbols === undefined) {
        return assignedTypes;
    }

    // Each reference symbol can have multiple references that update the missing types
    for (const referenceSymbol of referencedSymbols) {
        for (const reference of referenceSymbol.references) {
            updateAssignedTypesForReference(reference, assignedTypes, request);
        }
    }

    return assignedTypes;
};
 
/**
 * Adds missing tyes for a reference to a property.
 * 
 * @param reference   Source code reference to a property.
 * @param assignedTypes   In-progress collection of types assigned to a property.
 * @param request   Metadata and settings to collect mutations in a file.
 */
const updateAssignedTypesForReference = (
    reference: ts.ReferenceEntry,
    assignedTypes: ts.Type[],
    request: FileMutationsRequest,
): void => {
    // Make sure the reference is in a non-definition file and doesn't just (re-)define the property
    if (!reference.isWriteAccess || reference.isDefinition) {
        return;
    }

    // Grab the source file containing the reference
    const referencingSourceFile = request.services.program.getSourceFile(reference.fileName);
    if (referencingSourceFile === undefined) {
        return;
    }

    // In order to write a new type, the referencing node should be an identifier...
    const identifier = findNodeByStartingPosition(referencingSourceFile, reference.textSpan.start);
    if (!ts.isIdentifier(identifier)) {
        return;
    }

    // ...contained as a name inside a property access...
    const propertyAccess = identifier.parent;
    if (!ts.isPropertyAccessExpression(propertyAccess) || propertyAccess.name !== identifier) {
        return;
    }

    // ...contained as the left-hand side of an "=" binary expression
    const binaryExpression = propertyAccess.parent;
    if (
        !ts.isBinaryExpression(binaryExpression) ||
        binaryExpression.left !== propertyAccess ||
        binaryExpression.operatorToken.kind !== ts.SyntaxKind.EqualsToken
    ) {
        return;
    }

    // Mark the type of the right-hand side of the "=" expression as being assigned
    assignedTypes.push(request.services.program.getTypeChecker().getTypeAtLocation(binaryExpression.right));
};