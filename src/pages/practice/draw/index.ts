function line(ctx: CanvasRenderingContext2D) {
  // 画个头
  ctx.moveTo(220, 50);
  ctx.lineTo(280, 50);
  ctx.lineTo(280, 100);
  ctx.lineTo(220, 100);
  ctx.lineTo(220, 50);
  ctx.stroke();

  // 脖子跟左手
  ctx.moveTo(250, 100);
  ctx.lineTo(250, 120);
  ctx.lineTo(200, 150);
  ctx.stroke();

  // 右手
  ctx.moveTo(250, 120);
  ctx.lineTo(300, 150);
  ctx.stroke();

  // 身子跟左腿
  ctx.moveTo(250, 120);
  ctx.lineTo(250, 180);
  ctx.lineTo(250, 180);
  ctx.lineTo(200, 230);
  ctx.stroke();

  // 右腿
  ctx.moveTo(250, 180);
  ctx.lineTo(300, 230);
  ctx.stroke();

  // 左眼
  ctx.moveTo(235, 70);
  ctx.lineTo(242, 70);
  ctx.stroke();

  // 右眼
  ctx.moveTo(260, 70);
  ctx.lineTo(267, 70);
  ctx.stroke();

  // 嘴
  ctx.moveTo(246, 90);
  ctx.lineTo(254, 90);
  ctx.stroke();
}

function arc(ctx: CanvasRenderingContext2D) {
  // 脸
  ctx.beginPath();
  ctx.arc(200, 200, 50, 0, Math.PI * 2);
  ctx.stroke();

  // 左眼
  ctx.beginPath();
  ctx.arc(185, 185, 5, Math.PI, Math.PI * 2);
  ctx.stroke();

  // 右眼
  ctx.beginPath();
  ctx.arc(216, 185, 5, Math.PI, Math.PI * 2);
  ctx.stroke();

  // 嘴
  ctx.beginPath();
  ctx.arc(200, 215, 10, Math.PI / 8, (Math.PI * 7) / 8);
  ctx.stroke();
}

function rect(ctx: CanvasRenderingContext2D) {
  // 绘制顶部 tab
  for (let i = 0; i < 7; i++) {
    ctx.strokeRect(i * 80 + (i + 1) * 8, 10, 80, 30);
  }

  // 绘制四个空心方块
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(i * 30 + (i + 1) * 8, 58, 16, 16);
    ctx.clearRect(i * 30 + (i + 1) * 8 + 4, 62, 8, 8);
  }

  // 绘制搜索栏
  ctx.strokeRect(160, 50, 400, 30);
}

function wavy(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#4096ff';
  ctx.beginPath();
  ctx.moveTo(30, 30);
  ctx.bezierCurveTo(80, 90, 180, -30, 220, 30);
  ctx.lineTo(220, 90);
  ctx.lineTo(30, 90);
  ctx.closePath();
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#a0d911';
  ctx.stroke();
}

function histogram(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 500, 500);

  ctx.fillStyle = 'blue';

  ctx.fillStyle = 'black';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(30, 10);
  ctx.lineTo(30, 460);
  ctx.lineTo(490, 460);
  ctx.stroke();

  ctx.fillStyle = 'black';
  for (let i = 0; i < 6; i++) {
    ctx.fillText(String((5 - i) * 20), 4, i * 80 + 62);
    ctx.beginPath();
    ctx.moveTo(25, i * 80 + 60);
    ctx.lineTo(30, i * 80 + 60);
    ctx.stroke();
  }

  const labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY'];
  for (let i = 0; i < 5; i++) {
    ctx.fillText(labels[i], 50 + i * 100, 475);
  }

  ctx.fillStyle = 'blue';
  const data = [16, 68, 20, 30, 54];
  for (let i = 0; i < data.length; i++) {
    ctx.fillRect(40 + i * 100, 460 - data[i] * 5, 45, data[i] * 5);
  }
}

function pieChart(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, 500, 500);

  const colors = ['orange', 'green', 'blue', 'yellow', 'teal'];
  let total = 0;
  const data = [100, 68, 20, 30, 100];
  for (let i = 0; i < data.length; i++) {
    total += data[i];
  }

  let preAngle = 0;
  for (let i = 0; i < data.length; i++) {
    const fraction = data[i] / total;
    const angle = preAngle + fraction * Math.PI * 2;

    // ctx.fillStyle = colors[i];
    const grad = ctx.createRadialGradient(250, 250, 5, 250, 250, 100);
    grad.addColorStop(0, 'white');
    grad.addColorStop(1, colors[i]);
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 100, preAngle, angle, false);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();

    preAngle = angle;
  }

  ctx.fillStyle = 'black';
  ctx.font = '24pt sans-serif';

  const text = 'Sales Data from 2025';
  const metrics = ctx.measureText(text);

  ctx.fillText(text, 250 - metrics.width / 2, 400);
}

function ticTac(ctx: CanvasRenderingContext2D) {
  // 绘制网格
  ctx.lineWidth = 1;
  ctx.rect(50, 50, 300, 300);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(50, 150);
  ctx.lineTo(350, 150);

  ctx.moveTo(50, 250);
  ctx.lineTo(350, 250);

  ctx.moveTo(150, 50);
  ctx.lineTo(150, 350);

  ctx.moveTo(250, 50);
  ctx.lineTo(250, 350);

  ctx.stroke();

  // 绘制 ❌
  const drawX = (x: number, y: number) => {
    ctx.beginPath();
    ctx.moveTo(x, x);
    ctx.lineTo(y, y);
    ctx.moveTo(y, x);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // 绘制圆
  const drawArc = (x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.stroke();
  };

  const steps = [
    {
      type: 'arc',
      x: 100,
      y: 200,
    },
    {
      type: 'arc',
      x: 300,
      y: 100,
    },
    {
      type: 'x',
      x: 175,
      y: 225,
    },
    {
      type: 'x',
      x: 75,
      y: 125,
    },
    {
      type: 'arc',
      x: 300,
      y: 300,
    },
  ];
  steps.forEach((step) => {
    const { type, x, y } = step;
    if (type === 'arc') {
      drawArc(x, y);
    } else if (type == 'x') {
      drawX(x, y);
    }
  });
}

function brick(ctx: CanvasRenderingContext2D) {
  const createRgbVal = (r: number, g: number, b: number) => {
    return `rgb(${r},${g},${b})`;
  };

  const w = 15;

  const drawRect = (x: number, y: number) => {
    ctx.beginPath();
    ctx.rect(x * w, y * w, w, w);
    const colorW = w + 5;

    if (
      (x % 3 === 0 && x !== 0 && (y === 0 || y === n - 1)) ||
      (y % 3 === 0 && y !== 0 && (x === 0 || x === n - 1))
    ) {
      ctx.fillStyle = 'white';
    } else if (x % 3 === (y + 2) % 3) {
      ctx.fillStyle = createRgbVal(
        170,
        0 + (x * colorW) / 2 - 8,
        0 + (y * colorW) / 2 - 8
      );
    } else {
      ctx.fillStyle = createRgbVal(
        170,
        0 + (x * colorW) / 2,
        0 + (y * colorW) / 2
      );
    }

    ctx.fill();
  };

  const n = 25;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      drawRect(i, j);
    }
  }
}

function test(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createRadialGradient(200, 300, 10, 200, 0, 100);

  gradient.addColorStop(0, 'blue');
  gradient.addColorStop(0.25, 'white');
  gradient.addColorStop(0.5, 'purple');
  gradient.addColorStop(0.75, 'red');
  gradient.addColorStop(1, 'yellow');

  ctx.fillStyle = gradient;
  ctx.rect(0, 0, 400, 300);
  ctx.fill();
}

function love(ctx: CanvasRenderingContext2D) {
  const drawLeft = () => {
    ctx.beginPath();

    const p0 = [200, 200];
    const p1 = [110, 170];
    const p2 = [143, 260];
    const p3 = [200, 300];
    ctx.moveTo(p0[0], p0[1]);
    ctx.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
    ctx.fillStyle = 'red';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.lineWidth = 1;
    [p1, p2, p3].forEach((p) => {
      ctx.lineTo(p[0], p[1]);
    });
    ctx.strokeStyle = 'blue';
    ctx.stroke();
  };

  const drawRight = () => {
    ctx.beginPath();
    const p0 = [200, 200];
    const p1 = [290, 165];
    const p2 = [257, 260];
    const p3 = [200, 300];
    ctx.moveTo(p0[0], p0[1]);
    ctx.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]);
    ctx.fillStyle = 'red';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.lineWidth = 1;
    [p1, p2, p3].forEach((p) => {
      ctx.lineTo(p[0], p[1]);
    });
    ctx.strokeStyle = 'blue';
    ctx.stroke();
  };
  drawLeft();
  drawRight();
}

export const drawFns = {
  love,
  brick,
  'pie-chart': pieChart,
  histogram,
  wavy,
  line,
  arc,
  rect,
  ticTac,
  test,
};
