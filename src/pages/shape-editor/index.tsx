import { useEffect } from 'react';
import { useWindowSize } from 'react-use';
import ShapeEditor from './shapeEditor';

export default function Component() {
  const { width, height } = useWindowSize();
  const centerX = width / 2,
    centerY = height / 2;

  const initPoints = [
    { x: centerX - 40, y: centerY - 80 },
    { x: centerX + 80, y: centerY },
    { x: centerX + 80, y: centerY + 80 },
    { x: centerX - 40, y: centerY + 160 },
    { x: centerX - 160, y: centerY + 160 },
    { x: centerX - 200, y: centerY + 80 },
    { x: centerX - 200, y: centerY },
  ];

  useEffect(() => {
    const shapeEditor = new ShapeEditor({
      points: initPoints.reduce((acc, point) => {
        acc.push(point.x, point.y);
        return acc;
      }, []),
    });
    return () => {
      shapeEditor.destroy();
    };
  }, []);

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center background-[#aaa] flex-col"></div>
  );
}