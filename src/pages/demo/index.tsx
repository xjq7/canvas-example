import { useEffect, useRef } from 'react';

export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement>();

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvasRef.current.getContext('2d');
    console.log(canvas, ctx);
  };

  useEffect(() => {
    draw();
  }, []);

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center background-[#aaa] flex-col">
      <canvas width={600} height={600} ref={canvasRef}></canvas>
    </div>
  );
}
