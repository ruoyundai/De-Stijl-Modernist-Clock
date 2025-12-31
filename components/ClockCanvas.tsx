import React, { useRef, useEffect, useState, useCallback } from 'react';

const myColor = ["#C50802", "#12046F", "#F6C519"];

const ClockCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rectH, setRectH] = useState(1);
  const [rectM, setRectM] = useState(2);
  const [rectS, setRectS] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const width = 600;
    const height = 600;

    const now = new Date();
    const hNum = now.getHours();
    const mNum = now.getMinutes();
    const sNum = now.getSeconds();

    const mouseX = mousePos.x;
    const mouseY = mousePos.y;

    // background(200) -> #C8C8C8
    ctx.fillStyle = '#C8C8C8';
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 6;
    ctx.lineCap = 'square';
    ctx.strokeStyle = '#000000';

    // De stijl drawing frame
    ctx.save();
    // shadow fill(160)
    ctx.fillStyle = 'rgb(160, 160, 160)';
    ctx.fillRect(width / 2 - 275 + 5, height / 2 - 275 + 5, 550, 550);
    // paper color fill(235)
    ctx.fillStyle = 'rgb(235, 235, 235)';
    ctx.fillRect(width / 2 - 270, height / 2 - 270, 540, 540);
    ctx.restore();

    // BLACK CORNER
    ctx.save();
    if (mouseX > sNum * 3 + 270 && mouseX < 570 && mouseY > 30 && mouseY < 90) {
      ctx.fillStyle = 'rgb(235, 235, 235)';
    } else {
      ctx.fillStyle = 'rgb(0, 0, 0)';
    }
    ctx.fillRect(sNum * 3 + 270, 30, 300 - sNum * 3, 60);
    ctx.restore();

    // REAL TIME
    ctx.save();
    ctx.font = '25px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000000';

    const hDisp = hNum < 10 ? '0' + hNum : hNum;
    const mDisp = mNum < 10 ? '0' + mNum : mNum;
    const sDisp = sNum < 10 ? '0' + sNum : sNum;

    ctx.fillText(hDisp + ':' + mDisp + ':' + sDisp, ((sNum * 3 + 270) + 570) / 2, 70);
    ctx.restore();

    // BLUE for Hour
    ctx.fillStyle = myColor[rectH];
    ctx.fillRect(90, 90, 120, 10 * hNum + 60);
    ctx.strokeRect(90, 90, 120, 10 * hNum + 60);

    // Blue motion line
    ctx.beginPath();
    ctx.moveTo(30, 10 * hNum + 150);
    ctx.lineTo(210, 10 * hNum + 150);
    ctx.stroke();

    // YELLOW for Minute
    ctx.save();
    ctx.fillStyle = myColor[rectM];
    const y1_x = 450, y1_y = 570;
    const y2_x = 330 - mNum * 2, y2_y = 510 - mNum * 2;
    ctx.fillRect(y1_x, y1_y, y2_x - y1_x, y2_y - y1_y);
    ctx.strokeRect(y1_x, y1_y, y2_x - y1_x, y2_y - y1_y);
    ctx.restore();

    // Yellow motion line
    ctx.beginPath();
    ctx.moveTo(90, 510 - mNum * 2);
    ctx.lineTo(570, 510 - mNum * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(330 - mNum * 2, sNum * 4 + 150);
    ctx.lineTo(330 - mNum * 2, 570);
    ctx.stroke();

    // RED for Second
    ctx.fillStyle = myColor[rectS];
    ctx.fillRect(210, 90, sNum * 3 + 60, sNum * 4 + 60);
    ctx.strokeRect(210, 90, sNum * 3 + 60, sNum * 4 + 60);

    // Red motion line with red
    ctx.beginPath();
    ctx.moveTo(sNum * 3 + 270, 30);
    ctx.lineTo(sNum * 3 + 270, 570);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(90, sNum * 4 + 150);
    ctx.lineTo(width - 30, sNum * 4 + 150);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(210, (sNum * 4 + 60) / 5 + 90);
    ctx.lineTo(width - 30, (sNum * 4 + 60) / 5 + 90);
    ctx.stroke();

    // motionless lines
    ctx.beginPath();
    ctx.moveTo(30, 90);
    ctx.lineTo(width - 30, 90);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(90, 30);
    ctx.lineTo(90, height - 30);
    ctx.stroke();

    // AM PM
    ctx.save();
    ctx.font = 'bold 30px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText(hNum < 12 ? 'AM' : 'PM', 485, 550 - mNum);
    ctx.restore();

    // ML BLUE increase with YELLOW
    ctx.save();
    if (mouseX > 450 && mouseY > 510 - mNum * 2 && mouseX < 570 && mouseY < 570) {
      // noFill()
    } else {
      ctx.fillStyle = 'rgb(18, 4, 111)';
      ctx.fillRect(450, 510 - mNum * 2, 570 - 450, 570 - (510 - mNum * 2));
      ctx.strokeRect(450, 510 - mNum * 2, 570 - 450, 570 - (510 - mNum * 2));
    }
    ctx.restore();

    // frame
    ctx.strokeRect(30, 30, 540, 540);

  }, [rectH, rectM, rectS, mousePos]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const render = () => {
      draw(ctx);
      animationId = window.requestAnimationFrame(render);
    };
    render();
    return () => window.cancelAnimationFrame(animationId);
  }, [draw]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    if (x < 210 && x > 90 && y > 90 && y < 10 * h + 150) {
      setRectH(prev => (prev + 1) % 3);
    }

    if (x > 210 && x < s * 3 + 270 && y > 90 && y < s * 4 + 150) {
      setRectS(prev => (prev + 1) % 3);
    }

    const minX = Math.min(450, 330 - m * 2);
    const maxX = Math.max(450, 330 - m * 2);
    const minY = Math.min(570, 510 - m * 2);
    const maxY = Math.max(570, 510 - m * 2);
    if (x > minX && x < maxX && y > minY && y < maxY) {
      setRectM(prev => (prev + 1) % 3);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
    />
  );
};

export default ClockCanvas;