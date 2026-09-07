interface Props {
  width: number;
  height: number;
  unit?: string;
  maxSize?: number;
}

/** A live scaled drawing that redraws as the surveyor types in dimensions. */
export function MeasurementDrawing({ width, height, unit = "mm", maxSize = 160 }: Props) {
  if (!width || !height || width <= 0 || height <= 0) {
    return (
      <div className="drawing-placeholder">
        Enter width &amp; height to preview
      </div>
    );
  }

  const scale = maxSize / Math.max(width, height);
  const rectW = Math.max(width * scale, 4);
  const rectH = Math.max(height * scale, 4);
  const pad = 20;
  const svgW = rectW + pad * 2;
  const svgH = rectH + pad * 2;

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      role="img"
      aria-label={`Scaled drawing, ${width}${unit} by ${height}${unit}`}
    >
      <rect
        x={pad}
        y={pad}
        width={rectW}
        height={rectH}
        fill="var(--drawing-fill)"
        stroke="var(--drawing-stroke)"
        strokeWidth={2}
      />
      <text x={svgW / 2} y={pad - 6} fontSize={11} textAnchor="middle" fill="var(--drawing-stroke)">
        {width}
        {unit}
      </text>
      <text
        x={pad - 6}
        y={svgH / 2}
        fontSize={11}
        textAnchor="middle"
        fill="var(--drawing-stroke)"
        transform={`rotate(-90 ${pad - 6} ${svgH / 2})`}
      >
        {height}
        {unit}
      </text>
    </svg>
  );
}
