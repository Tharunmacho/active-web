import { useEffect, useRef } from 'react';

interface WaveformViewerProps {
  vcdData?: string;
}

export default function WaveformViewer({ vcdData }: WaveformViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#e5e5e5';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = 0; x < canvas.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Sample waveform data
    const signals = [
      { name: 'clk', wave: '010101010101' },
      { name: 'a', wave: '0...1...0..1' },
      { name: 'b', wave: '0.1...0...1.' },
      { name: 'y', wave: '0....1..0..1' }
    ];

    let yOffset = 60;
    const signalHeight = 80;
    const timeScale = 40;

    signals.forEach((signal) => {
      // Draw signal name
      ctx.fillStyle = '#000000';
      ctx.font = '14px monospace';
      ctx.fillText(signal.name, 20, yOffset - 20);

      // Draw waveform
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.beginPath();

      let x = 100;
      let currentValue = 0;

      for (let i = 0; i < signal.wave.length; i++) {
        const value = signal.wave[i];
        
        if (value === '0') {
          if (currentValue === 1) {
            // Falling edge
            ctx.lineTo(x, yOffset - 30);
          }
          ctx.lineTo(x, yOffset);
          ctx.lineTo(x + timeScale, yOffset);
          currentValue = 0;
        } else if (value === '1') {
          if (currentValue === 0) {
            // Rising edge
            ctx.lineTo(x, yOffset - 30);
          }
          ctx.lineTo(x, yOffset - 30);
          ctx.lineTo(x + timeScale, yOffset - 30);
          currentValue = 1;
        } else {
          // Don't change state for '.'
          if (currentValue === 0) {
            ctx.lineTo(x + timeScale, yOffset);
          } else {
            ctx.lineTo(x + timeScale, yOffset - 30);
          }
        }
        
        x += timeScale;
      }

      ctx.stroke();
      yOffset += signalHeight;
    });

    // Draw time markers
    ctx.fillStyle = '#666666';
    ctx.font = '12px monospace';
    for (let i = 0; i < 12; i++) {
      const x = 100 + i * timeScale;
      const time = i * 10;
      ctx.fillText(`${time}`, x - 10, canvas.height - 10);
    }

  }, [vcdData]);

  return (
    <div className="w-full h-full bg-white p-4 overflow-auto">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Signal Waveforms</h3>
        <p className="text-sm text-gray-500">Time scale: 10 ns per division</p>
      </div>
      <canvas
        ref={canvasRef}
        width={1000}
        height={400}
        className="border border-gray-200 rounded"
      />
    </div>
  );
}
