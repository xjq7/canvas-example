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

export const drawFns = {
  wavy,
  line,
  arc,
  rect,
};
