// Shorthand aliases for database enums.
// Kept out of types.ts because that file is overwritten by `npm run db:types`.
import type { Enums } from "./types";

export type TechniqueCategory = Enums<"technique_category">;
export type TechniqueLevel = Enums<"technique_level">;
