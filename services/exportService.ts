export const exportElementAsPng = async (element: HTMLElement, fileName: string): Promise<void> => {
  const module = await import("html2canvas");
  const html2canvas = module.default;

  const canvas = await html2canvas(element, {
    backgroundColor: "#f9f8f5",
    scale: window.devicePixelRatio > 1 ? 2 : 1,
    useCORS: true
  });

  const dataUrl = canvas.toDataURL("image/png");
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = fileName;
  anchor.click();
};
