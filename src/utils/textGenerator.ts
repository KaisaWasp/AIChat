type ChunkCallback = (chunk: string) => void;
type CompleteCallback = () => void;

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

export const generateText = (
  totalWords: number,
  onChunk: ChunkCallback,
  onComplete?: CompleteCallback,
) => {
  let generatedWords = 0;
  const chunkSize = 50;
  const interval = 20;

  const id = setInterval(() => {
    if (generatedWords >= totalWords) {
      clearInterval(id);
      onComplete?.();
      return;
    }

    const chunk = Array(chunkSize)
      .fill(0)
      .map(
        () =>
          lorem.split(" ")[Math.floor(Math.random() * lorem.split(" ").length)],
      )
      .join(" ");

    generatedWords += chunkSize;
    onChunk(chunk);
  }, interval);

  return () => clearInterval(id);
};
