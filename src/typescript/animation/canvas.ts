interface Point {
  x: number;
  y: number;
}

interface Triangle {
  points: Point[];
  color: string;
  borderColor: string;
}

interface Settings {
  triangleOpacity: number;
  highlightOpacity: number;
  highlightColor: string;
  highlightWidth: number;
  borderColor: string;
  hueRange: [number, number];
  saturation: number;
  lightnessRange: [number, number];
}

export class BackgroundCanvas {
  private canvas: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private trianglesCount: number = 80;
  private highlightRadius: number = 20;
  private triangles: Triangle[] = [];
  private mouseX: number = -1000;
  private mouseY: number = -1000;
  private isMobile!: boolean;
  private animationFrameId: number | null = null;

  private settings: Settings = {
    triangleOpacity: 0.05,
    highlightOpacity: 0.5,
    highlightColor: 'rgb(0, 118, 139)',
    highlightWidth: 2,
    borderColor: 'rgba(0,0,0,0.01)',
    hueRange: [160, 200],
    saturation: 25,
    lightnessRange: [25, 45]
  };

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!this.canvas) return;

    // Проверяем, является ли устройство мобильным
    this.isMobile = window.matchMedia('(max-width: 768px)').matches ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    this.ctx = context;

    this.init();
  }

  private init(): void {
    this.resizeCanvas();
    this.createTriangles();

    if (this.isMobile) {
      // На мобильных просто рисуем один раз
      this.drawStatic();
    } else {
      // На десктопах запускаем анимацию
      this.startAnimation();
      this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      this.canvas.addEventListener('mouseout', () => {
        this.mouseX = -1000;
        this.mouseY = -1000;
      });
    }

    window.addEventListener('resize', () => {
      this.resizeCanvas();
      if (this.isMobile) {
        this.drawStatic();
      }
    });
  }

  private startAnimation(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.drawFrame();
  }

  private drawStatic(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.triangles.forEach(tri => {
      this.drawTriangle(tri);
    });
  }

  private resizeCanvas(): void {
    // Используем document.documentElement.clientWidth для правильного расчета ширины
    const width = Math.min(
      document.documentElement.clientWidth,
      window.innerWidth
    );
    this.canvas.width = width;
    this.canvas.height = window.innerHeight;

    // Пересоздаем треугольники при изменении размера
    this.createTriangles();
  }

  private createTriangles(): void {
    this.triangles = [];
    for (let i = 0; i < this.trianglesCount; i++) {
      this.triangles.push(this.createTriangle());
    }
  }

  private createTriangle(): Triangle {
    const x = Math.random() * this.canvas.width;
    const y = Math.random() * this.canvas.height;
    const size = 60 + Math.random() * 120;
    const angles = Array(3).fill(0).map(() => Math.random() * Math.PI * 2);

    const hue = this.settings.hueRange[0] + Math.random() * (this.settings.hueRange[1] - this.settings.hueRange[0]);
    const lightness = this.settings.lightnessRange[0] +
      Math.random() * (this.settings.lightnessRange[1] - this.settings.lightnessRange[0]);

    return {
      points: angles.map(angle => ({
        x: x + size * Math.cos(angle),
        y: y + size * Math.sin(angle)
      })),
      color: `hsla(${hue}, ${this.settings.saturation}%, ${lightness}%, ${this.settings.triangleOpacity})`,
      borderColor: this.settings.borderColor
    };
  }

  private drawFrame(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw all triangles
    this.triangles.forEach(tri => {
      this.drawTriangle(tri);
    });

    // 2. Draw highlights for nearby edges
    if (this.mouseX >= 0 && this.mouseY >= 0) {
      this.ctx.save();
      this.ctx.strokeStyle = this.settings.highlightColor;
      this.ctx.lineWidth = this.settings.highlightWidth;
      this.ctx.globalAlpha = this.settings.highlightOpacity;

      // For each triangle check all its edges
      this.triangles.forEach(tri => {
        for (let i = 0; i < 3; i++) {
          const p1 = tri.points[i];
          const p2 = tri.points[(i + 1) % 3];

          // Find nearest point on the edge
          const nearest = this.getNearestPointOnLine(p1.x, p1.y, p2.x, p2.y, this.mouseX, this.mouseY);
          const distance = Math.sqrt((nearest.x - this.mouseX) ** 2 + (nearest.y - this.mouseY) ** 2);

          // If edge is within highlight radius
          if (distance <= this.highlightRadius) {
            // Calculate length of highlighted segment
            const length = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
            const segmentLength = Math.min(this.highlightRadius * 2, length);

            // Find t parameter for nearest point
            const t = ((this.mouseX - p1.x) * (p2.x - p1.x) + (this.mouseY - p1.y) * (p2.y - p1.y)) / (length * length);
            const clampedT = Math.max(0, Math.min(1, t));

            // Calculate start and end of highlighted segment
            const startT = Math.max(0, clampedT - segmentLength / length / 2);
            const endT = Math.min(1, clampedT + segmentLength / length / 2);

            // Draw highlighted segment
            this.ctx.beginPath();
            this.ctx.moveTo(
              p1.x + startT * (p2.x - p1.x),
              p1.y + startT * (p2.y - p1.y)
            );
            this.ctx.lineTo(
              p1.x + endT * (p2.x - p1.x),
              p1.y + endT * (p2.y - p1.y)
            );
            this.ctx.stroke();
          }
        }
      });

      this.ctx.restore();
    }

    this.animationFrameId = requestAnimationFrame(() => this.drawFrame());
  }

  private drawTriangle(tri: Triangle): void {
    this.ctx.fillStyle = tri.color;
    this.ctx.beginPath();
    this.ctx.moveTo(tri.points[0].x, tri.points[0].y);
    tri.points.slice(1).forEach(p => this.ctx.lineTo(p.x, p.y));
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.strokeStyle = tri.borderColor;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  private getNearestPointOnLine(x1: number, y1: number, x2: number, y2: number, x: number, y: number): Point {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;

    if (len_sq !== 0) param = dot / len_sq;

    return {
      x: x1 + Math.max(0, Math.min(1, param)) * C,
      y: y1 + Math.max(0, Math.min(1, param)) * D
    };
  }

  private handleMouseMove(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
  }

  public destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', () => this.resizeCanvas());
    this.canvas.removeEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.removeEventListener('mouseout', () => {
      this.mouseX = -1000;
      this.mouseY = -1000;
    });
  }
}