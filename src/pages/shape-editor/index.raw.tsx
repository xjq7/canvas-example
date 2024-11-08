// import { useEffect, useRef } from 'react';

// const canvasWidth = 800;
// const canvasHeight = 800;

// export default function ShapeEditor() {
//   const canvasRef = useRef<HTMLCanvasElement>();

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvasRef.current.getContext('2d');

//     const points = [
//       [300, 300],
//       [240, 400],
//       [300, 500],
//       [400, 500],
//       [460, 400],
//       [400, 400],
//     ];

//     const radius = 8;

//     const drawArc = (x, y) => {
//       ctx.beginPath();
//       ctx.arc(x, y, radius, 0, Math.PI * 2);
//       ctx.strokeStyle = 'lime';
//       ctx.lineWidth = 2;
//       ctx.stroke();
//     };

//     const drawPol = () => {
//       ctx.clearRect(0, 0, canvasWidth, canvasHeight);
//       ctx.beginPath();

//       ctx.moveTo(points[0][0], points[0][1]);

//       const P1 = points[0];
//       const P2 = points[1];
//       const P3 = points[2];

//       const AC = { x: P3[0] - P1[0], y: P3[1] - P1[1] };

//       const ACLen = Math.sqrt(AC.x ** 2 + AC.y ** 2);

//       const u = { x: AC.x / ACLen, y: AC.y / ACLen };

//       const P21 = { x: P2[0] - 100 * u.x, y: P2[1] - 100 * u.y };
//       const P22 = { x: P2[0] + 50 * u.x, y: P2[1] + 50 * u.y };

//       drawArc(P21.x, P21.y);
//       drawArc(P22.x, P22.y);

//       ctx.moveTo(P1[0], P1[1]);
//       ctx.quadraticCurveTo(P21.x, P21.y, P2[0], P2[1]);
//       ctx.quadraticCurveTo(P22.x, P22.y, P3[0], P3[1]);

//       points.slice(3).forEach((point) => {
//         ctx.lineTo(point[0], point[1]);
//       });
//       ctx.strokeStyle = 'red';
//       ctx.lineWidth = 1;
//       ctx.closePath();
//       ctx.stroke();

//       points.forEach((point) => {
//         drawArc(point[0], point[1]);
//       });
//     };

//     let isEnter = false;
//     let isDown = false;

//     let moveX = null,
//       moveY = null;

//     let movePoint = null;

//     const handleMousemove = (e) => {
//       const rect = canvas.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;

//       if (isDown) {
//         canvas.style.cursor = 'pointer';
//         if (!movePoint || moveX === null || moveY === null) return;
//         movePoint[0] = movePoint[0] - moveX + x;
//         movePoint[1] = movePoint[1] - moveY + y;
//         moveX = movePoint[0];
//         moveY = movePoint[1];
//         drawPol();
//       } else if (isEnter) {
//         canvas.style.cursor = 'pointer';
//       } else {
//         for (const point of points) {
//           const dx = x - point[0];
//           const dy = y - point[1];
//           const _isEnter = Math.sqrt(dx * dx + dy * dy) <= radius;

//           if (_isEnter) {
//             isEnter = _isEnter;
//             canvas.style.cursor = 'pointer';
//             return;
//           }
//         }
//       }
//       canvas.style.cursor = 'default';
//     };

//     const handleMouseDown = (e) => {
//       if (!isEnter) return;
//       isDown = true;
//       const rect = canvas.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;

//       for (const point of points) {
//         const dx = x - point[0];
//         const dy = y - point[1];
//         const _isEnter = Math.sqrt(dx * dx + dy * dy) <= radius;

//         if (_isEnter) {
//           moveX = x;
//           moveY = y;
//           movePoint = point;
//           break;
//         }
//       }
//     };
//     const handleMouseUp = (e) => {
//       isDown = false;
//       moveX = null;
//       moveY = null;
//       movePoint = null;
//     };

//     canvas.addEventListener('mousemove', handleMousemove);
//     canvas.addEventListener('mousedown', handleMouseDown);
//     canvas.addEventListener('mouseup', handleMouseUp);

//     drawPol();

//     return () => {
//       canvas.removeEventListener('mousemove', handleMousemove);
//       canvas.removeEventListener('mousedown', handleMouseDown);
//       canvas.removeEventListener('mouseup', handleMouseUp);
//     };
//   }, []);

//   return (
//     <div className="w-[100vw] h-[100vh] flex items-center justify-center background-[#aaa] flex-col">
//       <canvas
//         width={canvasWidth}
//         height={canvasHeight}
//         ref={canvasRef}
//       ></canvas>
//     </div>
//   );
// }
