self.onmessage = (e) => {
  const { markdown } = e.data;
  const html = markdown
    .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

  self.postMessage({ html });
};
