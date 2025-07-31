export function extractTimedSteps(
  description: string
): { text: string; minutes: number | null }[] {
  const regex = /(\d+)\s*(minutos|minuts|minutes|min|mins)/i;
  const lines = description.split(/\n|(?=\d+\\.)/);
  const seen = new Set<string>();
  return lines
    .map((line) => {
      const match = line.match(regex);
      const minutes = match ? parseInt(match[1]) : null;
      return { text: line.trim(), minutes };
    })
    .filter(
      (step) =>
        step.text.length > 0 && !seen.has(step.text) && seen.add(step.text)
    );
}
