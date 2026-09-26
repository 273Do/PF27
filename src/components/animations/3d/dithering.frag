// 参考：https://github.com/niccolofanton/dithering-shader

uniform float ditheringEnabled;
uniform vec2 resolution;
uniform float gridSize;
uniform float luminanceMethod;
uniform float invertColor;
uniform float pixelSizeRatio;
uniform float coverageThreshold;
uniform vec3 foregroundColor;
uniform vec3 backgroundColor;

// 1ブロックあたりのサンプリング数）
const int BLOCK_SAMPLES = 3;

/**
 * Ordered dithering matrix lookup
 * Returns true if the pixel should be colored based on its position in the dither matrix
 * @param brightness - Normalized brightness value (0.0 to 1.0)
 * @param pos - Pixel position in screen space
 * @return boolean - Whether the pixel should be colored or not
 */
bool getValue(float brightness, vec2 pos) {
  // Early return for extreme values
  if (brightness > 16.0 / 17.0) return false;
  if (brightness < 1.0 / 17.0) return true;

  // 4x4 Ditherマトリックス内の位置を計算する
  vec2 pixel = floor(mod(pos.xy / gridSize, 4.0));
  int x = int(pixel.x);
  int y = int(pixel.y);

  // 4x4 ベイヤー行列の閾値マップ
  if (x == 0) {
    if (y == 0) return brightness < 16.0 / 17.0;
    if (y == 1) return brightness < 5.0 / 17.0;
    if (y == 2) return brightness < 13.0 / 17.0;
    return brightness < 1.0 / 17.0; // y == 3
  }
  else if (x == 1) {
    if (y == 0) return brightness < 8.0 / 17.0;
    if (y == 1) return brightness < 12.0 / 17.0;
    if (y == 2) return brightness < 4.0 / 17.0;
    return brightness < 9.0 / 17.0; // y == 3
  }
  else if (x == 2) {
    if (y == 0) return brightness < 14.0 / 17.0;
    if (y == 1) return brightness < 2.0 / 17.0;
    if (y == 2) return brightness < 15.0 / 17.0;
    return brightness < 3.0 / 17.0; // y == 3
  }
  else { // x == 3
    if (y == 0) return brightness < 6.0 / 17.0;
    if (y == 1) return brightness < 10.0 / 17.0;
    if (y == 2) return brightness < 7.0 / 17.0;
    return brightness < 11.0 / 17.0; // y == 3
  }
}

/**
 * ブロック内を格子状にサンプリングし、平均色と被覆率を求める
 * ピクセル単位ではなくブロック単位でジオメトリの有無を判定するため、輪郭もモザイクになる
 * @param blockOrigin - ブロック左下のピクセル座標
 * @param pixelSize - ブロック1辺のピクセル数
 * @return vec4 - rgb: アルファで重み付けした平均色, a: ブロックの被覆率
 */
vec4 sampleBlock(vec2 blockOrigin, float pixelSize) {
  vec4 acc = vec4(0.0);
  float stride = pixelSize / float(BLOCK_SAMPLES);

  for (int y = 0; y < BLOCK_SAMPLES; y++) {
    for (int x = 0; x < BLOCK_SAMPLES; x++) {
      vec2 pos = blockOrigin + (vec2(float(x), float(y)) + 0.5) * stride;
      vec4 texel = texture2D(inputBuffer, pos / resolution);
      acc += vec4(texel.rgb * texel.a, texel.a);
    }
  }

  return acc / float(BLOCK_SAMPLES * BLOCK_SAMPLES);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 fragCoord = uv * resolution;

  // グリッドサイズと比率に基づいて、ピクセル化（モザイクの1マス）
  float pixelSize = gridSize * pixelSizeRatio;
  vec2 blockOrigin = floor(fragCoord / pixelSize) * pixelSize;

  // ブロック単位に平均化した色と被覆率
  vec4 block = sampleBlock(blockOrigin, pixelSize);
  float coverage = block.a;

  // 背景の上にブロックを合成し、ジオメトリの縁もモザイクの一部として扱う
  vec3 baseColor = block.rgb + backgroundColor * (1.0 - coverage);

  // 輝度計算
  float luminance = dot(baseColor, vec3(1., 1., 1.));

  // Dither 判定
  bool dithered = getValue(luminance, fragCoord);

  // 被覆率の低いブロックは透過（輪郭がブロック単位に量子化される）
  if (!dithered && coverage < coverageThreshold) {
    outputColor = vec4(0.0);
    return;
  }

  // Dither パターン割り当て
  baseColor = dithered ? foregroundColor : backgroundColor;

  // 出力
  outputColor = vec4(baseColor, 1.0);
}
