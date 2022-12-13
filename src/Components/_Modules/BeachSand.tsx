import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const SandCanvas = styled.canvas`
  background: transparent;
  position: absolute;
  bottom: 0;
  z-index: 99;
`;

interface Coordinate {
  x: number;
  y: number;
}

const BeachSand = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);
  const [isPainting, setIsPainting] = useState(false);

  const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) return;

    const Canvas: HTMLCanvasElement = canvasRef.current;
    return {
      x: event.pageX - Canvas.offsetLeft,
      y: event.pageY - Canvas.offsetTop,
    };
  };

  const drawLine = (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
    if (!canvasRef.current) return;

    const Canvas: HTMLCanvasElement = canvasRef.current;
    const context = Canvas.getContext('2d');

    if (context) {
      context.strokeStyle = '#E2CDA7';
      context.lineJoin = 'round';
      context.lineWidth = 10;

      context.beginPath();
      context.moveTo(originalMousePosition.x, originalMousePosition.y);
      context.lineTo(newMousePosition.x, newMousePosition.y);
      context.closePath();

      context.stroke();
    }
  };

  const startPaint = useCallback((event: MouseEvent) => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setIsPainting(true);
      setMousePosition(coordinates);
    }
  }, []);

  const paint = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (isPainting) {
        const newMousePosition = getCoordinates(event);
        if (mousePosition && newMousePosition) {
          drawLine(mousePosition, newMousePosition);
          setMousePosition(newMousePosition);
        }
      }
    },
    [isPainting, mousePosition]
  );

  const exitPaint = useCallback(() => {
    setIsPainting(false);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const Canvas: HTMLCanvasElement = canvasRef.current;

    Canvas.addEventListener('mousedown', startPaint);
    Canvas.addEventListener('mousemove', paint);
    Canvas.addEventListener('mouseup', exitPaint);
    Canvas.addEventListener('mouseleave', exitPaint);

    return () => {
      Canvas.removeEventListener('mousedown', startPaint);
      Canvas.removeEventListener('mousemove', paint);
      Canvas.removeEventListener('mouseup', exitPaint);
      Canvas.removeEventListener('mouseleave', exitPaint);
    };
  }, [startPaint, paint, exitPaint]);

  return (
    <div>
      <SandCanvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight * 0.4} />
    </div>
  );
};

export default BeachSand;
