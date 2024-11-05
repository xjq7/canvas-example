import { useEffect, useRef } from 'react';

export default function Clock() {
  const canvasRef = useRef<HTMLCanvasElement>();

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvasRef.current.getContext('2d');

    function drawClock() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawFace(ctx, centerX, centerY, 150);
      drawNumbers(ctx, centerX, centerY, 150);
      drawTime(ctx, centerX, centerY, hours, minutes, seconds);
      drawTicks(ctx, centerX, centerY, 150);
    }

    function drawFace(ctx: CanvasRenderingContext2D, x, y, radius) {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.fillStyle = 'black';
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    function drawTicks(ctx, x, y, radius) {
      for (let i = 0; i < 60; i++) {
        const angle = i * (Math.PI / 30);
        const isHour = i % 5 === 0;
        const len = isHour ? 15 : 10;
        if (isHour) {
          ctx.lineWidth = 2;
        } else {
          ctx.lineWidth = 1;
        }
        const innerX = x + (radius - len) * Math.sin(angle);
        const innerY = y - (radius - len) * Math.cos(angle);
        const outerX = x + radius * Math.sin(angle);
        const outerY = y - radius * Math.cos(angle);

        ctx.beginPath();
        ctx.moveTo(innerX, innerY);
        ctx.lineTo(outerX, outerY);
        ctx.stroke();
      }
    }

    function drawNumbers(ctx, x, y, radius) {
      ctx.font = `${radius / 10}px Arial`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      for (let num = 1; num <= 12; num++) {
        const angle = num * (Math.PI / 6);
        const dx = x + radius * 0.8 * Math.sin(angle);
        const dy = y - radius * 0.8 * Math.cos(angle);
        ctx.fillText(num.toString(), dx, dy);
      }
    }

    function drawTime(ctx, x, y, hours, minutes, seconds) {
      hours = hours % 12;
      hours = (hours * Math.PI) / 6 + (minutes * Math.PI) / 360;
      drawHand(ctx, x, y, hours, 50, 6); // Hour hand

      minutes = (minutes * Math.PI) / 30 + (seconds * Math.PI) / 1800;
      drawHand(ctx, x, y, minutes, 70, 4); // Minute hand

      seconds = (seconds * Math.PI) / 30;
      drawHand(ctx, x, y, seconds, 90, 2); // Second hand
    }

    function drawHand(ctx, x, y, angle, length, width) {
      ctx.beginPath();
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.moveTo(x, y);
      ctx.lineTo(x + length * Math.sin(angle), y - length * Math.cos(angle));
      ctx.stroke();
    }

    setInterval(drawClock, 1000);
    drawClock();
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
