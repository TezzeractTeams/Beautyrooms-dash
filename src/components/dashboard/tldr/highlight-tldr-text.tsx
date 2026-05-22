import type { ReactNode } from "react";

const KEY_PHRASE_SPLIT =
  /(\$[\d,]+(?:\.\d+)?|~\d+(?:\.\d+)?%?|\d+(?:\.\d+)?%|\d+(?:\.\d+)?x|\+\d+(?:\.\d+)?(?:\s*pts?)?|\d+(?:\.\d+)?\+)/;

const KEY_PHRASE_TEST =
  /^(\$[\d,]+(?:\.\d+)?|~\d+(?:\.\d+)?%?|\d+(?:\.\d+)?%|\d+(?:\.\d+)?x|\+\d+(?:\.\d+)?(?:\s*pts?)?|\d+(?:\.\d+)?\+)$/;

/** Bold numbers, currency, percentages, and multipliers inside TLDR copy */
export function highlightTLDRText(text: string): ReactNode[] {
  const parts = text.split(KEY_PHRASE_SPLIT).filter(Boolean);

  return parts.map((part, index) =>
    KEY_PHRASE_TEST.test(part) ? (
      <strong
        key={`${index}-${part}`}
        className="font-normal text-heading"
      >
        {part}
      </strong>
    ) : (
      <span key={`${index}-${part}`}>{part}</span>
    ),
  );
}
