// src/lib/tagger.ts
export function componentTagger() {
  return {
    name: "component-tagger",
    transform(code: string) {
      return code; // no-op
    },
  };
}
export default componentTagger;
