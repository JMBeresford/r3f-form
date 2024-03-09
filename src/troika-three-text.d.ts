declare module "troika-three-text" {
  declare type SelectionRect = {
    bottom: number;
    top: number;
    left: number;
    right: number;
  };

  declare type AnchorXValue = number | "left" | "center" | "right";

  declare type AnchorYValue =
    | number
    | "top"
    | "top-baseline"
    | "top-cap"
    | "top-ex"
    | "middle"
    | "bottom-baseline"
    | "bottom";

  declare type TypesetParams = {
    text?: string;
    fontSize?: number;
    font?: unknown;
    lang?: string;
    sdfGlyphSize?: number;
    fontWeight?: number | "normal" | "bold";
    fontStyle?: "normal" | "italic";
    letterSpacing?: number;
    lineHeight?: number | "normal";
    maxWidth?: number;
    direction?: "ltr" | "rtl";
    textAlign?: "left" | "right" | "center" | "justify";
    textIndent?: number;
    whiteSpace?: "normal" | "nowrap";
    overflowWrap?: "normal" | "break-word";
    anchorX?: AnchorXValue;
    anchorY?: AnchorYValue;
    metricsOnly?: boolean;
    unicodeFontsURL?: string;
    preResolveFonts?: unknown;
    includeCaretPositions?: boolean;
    chunkedBoundsSize?: number;
    colorRanges?: unknown;
  };

  declare type BoundingRect = [minX: number, minY: number, maxX: number, maxY: number];

  declare type ChunkedBounds = {
    start: number;
    end: number;
    rect: BoundingRect;
  };

  declare type TextRenderInfo = {
    parameters?: TypesetParams;
    sdfTexture?: Texture;
    sdfGlyphSize?: number;
    sdfExponent?: number;

    // List of [minX, minY, maxX, maxY] quad bounds for each glyph.
    glyphBounds?: number[];

    // List holding each glyph's index in the SDF atlas.
    glyphAtlasIndices?: number[];

    // List holding each glyph's [r, g, b] color, if `colorRanges` was supplied.
    glyphColors?: number[];

    // A list of caret positions for all characters in the string; each is
    // four elements: the starting X, the ending X, the bottom Y, and the top Y for the caret.
    caretPositions?: number[];

    // An appropriate height for all selection carets.
    caretHeight?: number;

    // The font's ascender metric.
    ascender?: number;

    // The font's descender metric.
    descender?: number;

    // The font's cap height metric, based on the height of Latin capital letters.
    capHeight?: number;

    // The font's x height metric, based on the height of Latin lowercase letters.
    xHeight?: number;

    // The final computed lineHeight measurement.
    lineHeight?: number;

    // The y position of the top line's baseline.
    topBaseline?: number;

    // The total [minX, minY, maxX, maxY] rect of the whole text block;
    // this can include extra vertical space beyond the visible glyphs due to lineHeight.
    // Equivalent to the dimensions of a block-level text element in CSS.
    blockBounds?: number[];

    // The total [minX, minY, maxX, maxY] rect of the whole text block;
    // unlike `blockBounds` this is tightly wrapped to the visible glyph paths.
    // Equivalent to the dimensions of an inline text element in CSS.
    visibleBounds?: number[];

    // List of bounding rects for each consecutive set of N glyphs,
    // in the format `{start:N, end:N, rect:[minX, minY, maxX, maxY]}`.
    chunkedBounds?: ChunkedBounds[];

    // Timing info for various parts of the rendering logic including SDF
    // generation, typesetting, etc.
    timings?: object;
  };
  declare function getCaretAtPoint(troikaText: TextRenderInfo, x: number, y: number): { charIndex: number };
  declare function getSelectionRects(troikaText: TextRenderInfo, start: number, end: number): SelectionRect[];
}
