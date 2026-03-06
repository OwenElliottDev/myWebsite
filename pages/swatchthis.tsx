import Head from 'next/head';
import { useState, useRef, useCallback, useEffect } from 'react';

type Swatch = {
  hex: string;
  r: number;
  g: number;
  b: number;
  population: number;
};

const SwatchThis = () => {
  const [swatches, setSwatches] = useState<Swatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [numSwatches, setNumSwatches] = useState(5);
  const [colorSpace, setColorSpace] = useState<'lab' | 'lab-ciede2000' | 'rgb'>('lab');
  const [initMethod, setInitMethod] = useState<'kmeans++' | 'random'>('kmeans++');
  const [error, setError] = useState<string | null>(null);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wasmRef = useRef<{ generateSwatches: any } | null>(null);
  const rgbaDataRef = useRef<Uint8Array | null>(null);

  const loadWasm = useCallback(async () => {
    if (wasmRef.current) return wasmRef.current;
    const cdnUrl = 'https://cdn.jsdelivr.net/gh/OwenElliottDev/swatchthis@wasm-0.1.0/swatchthis.js';
    const mod = await (new Function('url', 'return import(url)') as (url: string) => Promise<any>)(
      cdnUrl,
    );
    const { default: init, generateSwatches } = mod;
    await init();
    wasmRef.current = { generateSwatches };
    return wasmRef.current;
  }, []);

  const runExtraction = useCallback(
    async (rgba: Uint8Array, count: number, space: string, method: string) => {
      setError(null);
      setLoading(true);
      try {
        const wasm = await loadWasm();
        const t0 = performance.now();
        const result = wasm.generateSwatches(rgba, count, space, method, BigInt(42));
        const t1 = performance.now();
        setProcessingTime(t1 - t0);
        const parsed: Swatch[] = JSON.parse(result);
        parsed.sort((a, b) => b.population - a.population);
        setSwatches(parsed);
      } catch (e: any) {
        setError(e.message || 'Failed to process image');
      } finally {
        setLoading(false);
      }
    },
    [loadWasm],
  );

  const handleImage = useCallback(
    async (file: File) => {
      setError(null);
      setSwatches([]);

      const url = URL.createObjectURL(file);
      setImagePreview(url);

      const img = new Image();
      img.src = url;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const rgba = new Uint8Array(imageData.data.buffer);
      rgbaDataRef.current = rgba;

      runExtraction(rgba, numSwatches, colorSpace, initMethod);
    },
    [runExtraction, numSwatches, colorSpace, initMethod],
  );

  useEffect(() => {
    if (rgbaDataRef.current) {
      runExtraction(rgbaDataRef.current, numSwatches, colorSpace, initMethod);
    }
  }, [numSwatches, colorSpace, initMethod, runExtraction]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) handleImage(file);
    },
    [handleImage],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleImage(file);
    },
    [handleImage],
  );

  const totalPopulation = swatches.reduce((sum, s) => sum + s.population, 0);

  return (
    <div className="page">
      <Head>
        <title>swatchthis demo</title>
        <meta name="description" content="Demo of swatchthis color extraction library" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="swatch-demo">
        <h1>swatchthis</h1>
        <p className="swatch-subtitle">
          Extract dominant color swatches from images using k-means clustering in WebAssembly.
          <br />
          <a href="https://github.com/OwenElliottDev/swatchthis" target="_blank" rel="noreferrer">
            View on GitHub
          </a>
        </p>

        <div className="swatch-top">
          <div className="swatch-controls">
            <label>
              Swatches
              <select value={numSwatches} onChange={(e) => setNumSwatches(Number(e.target.value))}>
                {[3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Color Space
              <select
                value={colorSpace}
                onChange={(e) => setColorSpace(e.target.value as 'lab' | 'lab-ciede2000' | 'rgb')}
              >
                <option value="lab">CIELAB</option>
                <option value="lab-ciede2000">CIELAB (CIEDE2000)</option>
                <option value="rgb">RGB</option>
              </select>
            </label>
            <label>
              Init Method
              <select
                value={initMethod}
                onChange={(e) => setInitMethod(e.target.value as 'kmeans++' | 'random')}
              >
                <option value="kmeans++">k-means++</option>
                <option value="random">Random</option>
              </select>
            </label>
          </div>

          <div
            className="swatch-dropzone"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('swatch-file-input')?.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Uploaded" className="swatch-preview-img" />
            ) : (
              <div className="swatch-dropzone-text">
                <p>Drop an image here or click to upload</p>
              </div>
            )}
            <input
              id="swatch-file-input"
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {loading && <p className="swatch-loading">Extracting colors...</p>}
        {error && <p className="swatch-error">{error}</p>}
        {processingTime !== null && !loading && (
          <p className="swatch-time">Processed in {processingTime.toFixed(1)}ms</p>
        )}

        <div className="swatch-results">
          <div className="swatch-palette-bar">
            {swatches.map((s, i) => (
              <div
                key={i}
                className="swatch-bar-segment"
                style={{
                  backgroundColor: s.hex,
                  flexGrow: s.population,
                }}
              />
            ))}
          </div>
          <div className="swatch-grid">
            {swatches.map((s, i) => (
              <div key={i} className="swatch-card">
                <div className="swatch-color" style={{ backgroundColor: s.hex }} />
                <div className="swatch-info">
                  <span className="swatch-hex">{s.hex}</span>
                  <span className="swatch-rgb">
                    rgb({s.r}, {s.g}, {s.b})
                  </span>
                  <span className="swatch-pop">
                    {((s.population / totalPopulation) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default SwatchThis;
