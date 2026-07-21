/**
 * Parses and extracts a standard array of items from diverse JSON structures
 * robustly handling legacy arrays and `{ items: [...] }` wrappers.
 *
 * @param data The raw data returned by the API
 * @returns An array of items
 * @throws Error if the data structure is unrecognized or invalid
 */
export function parseCollectionData(data: any): any[] {
  if (!data) {
    throw new Error("Received empty or null data from API.");
  }

  // 1. Direct array (e.g. legacy data format)
  if (Array.isArray(data)) {
    return data;
  }

  // 2. Object with an items array (e.g. current standard format: { meta: {...}, items: [...] })
  if (typeof data === "object" && data !== null) {
    if ("items" in data) {
      if (Array.isArray(data.items)) {
        return data.items;
      } else {
        throw new Error("Invalid structure: 'items' field exists but is not an array.");
      }
    }
    
    // In some edge cases, an empty object might be returned for a completely new file
    if (Object.keys(data).length === 0) {
      return [];
    }
  }

  throw new Error(
    "Invalid collection structure: Expected an array or an object containing an 'items' array."
  );
}
