// The vendored engine is an IIFE that assigns window.ScrollCraft; it exports nothing.
// This shim lets it be imported for its side effect without editing the vendored file,
// which the skill forbids.
declare const _default: unknown;
export default _default;
