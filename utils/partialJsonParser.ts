/**
 * Attempts to parse a potentially incomplete JSON string by auto-closing 
 * braces and brackets. This allows for "streaming" visualization of the UI tree.
 */
export function parsePartialJson(jsonString: string): any {
  // If empty, return null
  if (!jsonString || jsonString.trim() === '') return null;

  try {
    // First, try standard parse
    return JSON.parse(jsonString);
  } catch (e) {
    // If standard parse fails, try to repair
    const repaired = repairJson(jsonString);
    try {
      return JSON.parse(repaired);
    } catch (e2) {
      // If still fails, we might return null or the last valid state 
      // (but here we just return null to indicate wait for more data)
      return null;
    }
  }
}

function repairJson(json: string): string {
  // Basic heuristic: count open braces/brackets and append closing ones
  // This is a naive implementation but works for many streaming cases.
  
  let trimmed = json.trim();
  
  // Remove trailing commas which are invalid in JSON but common in streams before the next item
  trimmed = trimmed.replace(/,\s*$/, '');

  const stack: string[] = [];
  let inString = false;
  let escaped = false;

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === '{') stack.push('}');
      else if (char === '[') stack.push(']');
      else if (char === '}' || char === ']') {
        // If we encounter a closing brace, it matches the last opened one (assuming valid prefix)
        // Ideally we should check if it matches stack.pop(), but for repair we assume prefix is valid.
        if (stack.length > 0) stack.pop();
      }
    }
  }

  // If we ended inside a string, close it
  if (inString) {
    trimmed += '"';
  }

  // Append all missing closing braces/brackets in reverse order
  while (stack.length > 0) {
    trimmed += stack.pop();
  }

  return trimmed;
}