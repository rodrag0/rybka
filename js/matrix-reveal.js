(function () {
  "use strict";

  class MatrixReveal {
    constructor(options) {
      this.viewport = options.viewport;
      this.scaleLayer = options.scaleLayer;
      this.mask = options.mask;
      this.frame = options.frame;
      this.canvas = options.canvas;
      this.signal = options.signal;
      this.error = options.error;
      this.ctx = this.canvas.getContext("2d", { alpha: true });
      this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      this.phase = "idle";
      this.paused = false;
      this.rafId = 0;
      this.lastTime = 0;
      this.revealStartedAt = 0;
      this.revealDuration = 3800;
      this.resolveReveal = null;
      this.pausedAt = 0;
      this.streams = [];
      this.sourceWidth = 1;
      this.sourceHeight = 1;
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.viewport);
    }

    async loadPortrait(url) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Portrait request failed with ${response.status}`);
        }

        const markup = await response.text();
        const documentFragment = new DOMParser().parseFromString(markup, "text/html");
        const portrait = documentFragment.querySelector("pre");

        if (!portrait) {
          throw new Error("No portrait <pre> was found");
        }

        portrait.setAttribute("aria-hidden", "true");
        this.scaleLayer.replaceChildren(portrait);

        const lines = portrait.textContent.replace(/^\n|\n$/g, "").split(/\r?\n/);
        const longestLine = lines.reduce((longest, line) => Math.max(longest, line.length), 1);
        const measuringContext = document.createElement("canvas").getContext("2d");
        measuringContext.font = '700 9px "Cascadia Mono", Consolas, monospace';
        const characterWidth = measuringContext.measureText("0").width;
        const measuredWidth = Math.ceil(longestLine * characterWidth);
        const measuredHeight = Math.ceil(lines.length * 9 * 1.08);

        portrait.style.width = `${measuredWidth}px`;
        this.scaleLayer.style.width = `${measuredWidth}px`;
        this.scaleLayer.style.height = `${measuredHeight}px`;

        await new Promise((resolve) => requestAnimationFrame(resolve));
        this.sourceWidth = Math.max(measuredWidth, 1);
        this.sourceHeight = Math.max(measuredHeight, 1);
        this.scaleLayer.style.height = `${this.sourceHeight}px`;
        this.viewport.style.aspectRatio = `${this.sourceWidth} / ${this.sourceHeight}`;
        this.resize();
        return true;
      } catch (error) {
        console.error(error);
        this.error.hidden = false;
        return false;
      }
    }

    resize() {
      const rect = this.viewport.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const scale = Math.min(rect.width / this.sourceWidth, rect.height / this.sourceHeight);
      this.scaleLayer.style.setProperty("--portrait-scale", String(scale));

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.round(rect.width * dpr);
      this.canvas.height = Math.round(rect.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.width = rect.width;
      this.height = rect.height;
      this.buildStreams();

      if (this.phase === "idle") {
        this.clear();
      }
    }

    buildStreams() {
      if (!this.width || !this.height) return;

      const fontSize = Math.max(10, Math.min(14, this.width / 46));
      const columnCount = Math.ceil(this.width / fontSize);
      this.fontSize = fontSize;
      this.streams = Array.from({ length: columnCount }, (_, index) => ({
        x: index * fontSize + fontSize / 2,
        y: this.height + Math.random() * this.height,
        speed: 38 + Math.random() * 82,
        trail: 3 + Math.floor(Math.random() * 10),
        seed: Math.floor(Math.random() * 1000),
        alpha: 0.22 + Math.random() * 0.5
      }));
    }

    reset() {
      cancelAnimationFrame(this.rafId);
      this.phase = "idle";
      this.paused = false;
      this.lastTime = 0;
      this.mask.style.setProperty("--portrait-inset", "100%");
      this.frame.style.setProperty("--reveal-y", "100%");
      this.frame.classList.remove("is-revealing");
      this.signal.textContent = "0%";
      this.buildStreams();
      this.clear();
    }

    reveal(duration = 3800) {
      this.revealDuration = duration;
      this.phase = "revealing";
      this.paused = false;
      this.revealStartedAt = performance.now();
      this.lastTime = this.revealStartedAt;
      this.frame.classList.add("is-revealing");

      if (this.reducedMotion) {
        this.completeReveal();
        return Promise.resolve();
      }

      cancelAnimationFrame(this.rafId);
      this.rafId = requestAnimationFrame((time) => this.tick(time));
      return new Promise((resolve) => {
        this.resolveReveal = resolve;
      });
    }

    finishReveal() {
      if (this.phase === "idle") {
        this.phase = "revealing";
      }
      this.completeReveal();
    }

    completeReveal() {
      this.mask.style.setProperty("--portrait-inset", "0%");
      this.frame.style.setProperty("--reveal-y", "0%");
      this.frame.classList.remove("is-revealing");
      this.signal.textContent = "100%";
      this.phase = this.reducedMotion ? "complete" : "ambient";

      if (this.resolveReveal) {
        this.resolveReveal();
        this.resolveReveal = null;
      }

      if (!this.reducedMotion && !this.paused) {
        this.lastTime = performance.now();
        cancelAnimationFrame(this.rafId);
        this.rafId = requestAnimationFrame((time) => this.tick(time));
      } else {
        this.clear();
      }
    }

    setPaused(paused) {
      if (paused === this.paused) return;
      this.paused = paused;
      if (paused) {
        this.pausedAt = performance.now();
        cancelAnimationFrame(this.rafId);
      } else if (this.phase === "revealing" || this.phase === "ambient") {
        const resumedAt = performance.now();
        if (this.phase === "revealing" && this.pausedAt) {
          this.revealStartedAt += resumedAt - this.pausedAt;
        }
        this.pausedAt = 0;
        this.lastTime = resumedAt;
        this.rafId = requestAnimationFrame((time) => this.tick(time));
      }
    }

    tick(time) {
      if (this.paused) return;

      const delta = Math.min((time - this.lastTime) / 1000, 0.05);
      this.lastTime = time;

      if (this.phase === "revealing") {
        const rawProgress = Math.min((time - this.revealStartedAt) / this.revealDuration, 1);
        const progress = rawProgress * rawProgress * (3 - 2 * rawProgress);
        const boundary = 100 - progress * 100;
        this.mask.style.setProperty("--portrait-inset", `${boundary}%`);
        this.frame.style.setProperty("--reveal-y", `${boundary}%`);
        this.signal.textContent = `${Math.round(progress * 100)}%`;
        this.draw(delta, time, progress, false);

        if (rawProgress >= 1) {
          this.completeReveal();
          return;
        }
      } else if (this.phase === "ambient") {
        this.draw(delta, time, 1, true);
      }

      this.rafId = requestAnimationFrame((nextTime) => this.tick(nextTime));
    }

    draw(delta, time, progress, ambient) {
      this.clear();
      const activeRatio = ambient ? 0.17 : 0.12 + progress * 0.88;
      const activeCount = Math.max(2, Math.floor(this.streams.length * activeRatio));
      const tick = Math.floor(time / 110);

      this.ctx.save();
      this.ctx.font = `700 ${this.fontSize}px "Cascadia Mono", Consolas, monospace`;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";

      for (let index = 0; index < activeCount; index += 1) {
        const stream = this.streams[index];
        stream.y -= stream.speed * delta * (ambient ? 0.28 : 1);

        if (stream.y < -stream.trail * this.fontSize) {
          stream.y = this.height + Math.random() * this.height * 0.28;
          stream.speed = 38 + Math.random() * 82;
        }

        for (let tail = 0; tail < stream.trail; tail += 1) {
          const y = stream.y + tail * this.fontSize;
          if (y < -this.fontSize || y > this.height + this.fontSize) continue;

          const fade = 1 - tail / stream.trail;
          const alpha = stream.alpha * fade * (ambient ? 0.18 : 0.78);
          const bit = (stream.seed + tail + tick) % 2;
          this.ctx.fillStyle = tail === 0
            ? `rgba(220, 255, 229, ${Math.min(alpha + 0.2, 0.9)})`
            : `rgba(117, 255, 155, ${alpha})`;
          this.ctx.fillText(String(bit), stream.x, y);
        }
      }

      if (!ambient) {
        const boundaryY = this.height * (1 - progress);
        const gradient = this.ctx.createLinearGradient(0, boundaryY - 36, 0, boundaryY + 36);
        gradient.addColorStop(0, "rgba(117, 255, 155, 0)");
        gradient.addColorStop(0.5, "rgba(117, 255, 155, 0.13)");
        gradient.addColorStop(1, "rgba(117, 255, 155, 0)");
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, boundaryY - 36, this.width, 72);
      }

      this.ctx.restore();
    }

    clear() {
      if (this.width && this.height) {
        this.ctx.clearRect(0, 0, this.width, this.height);
      }
    }
  }

  window.MatrixReveal = MatrixReveal;
}());
