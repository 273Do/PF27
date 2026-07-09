// 参考：https://github.com/niccolofanton/dithering-shader

uniform float ditheringEnabled;
uniform vec2 resolution;
uniform float gridSize;
uniform float luminanceMethod;
uniform float invertColor;
uniform float pixelSizeRatio;
uniform vec3 foregroundColor;
uniform vec3 backgroundColor;

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

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

  // ジオメトリがないピクセルは透過
  if (inputColor.a < 0.01) {
    outputColor = vec4(0.0);
    return;
  }

  vec2 fragCoord = uv * resolution;
  vec3 baseColor;

  // グリッドサイズと比率に基づいて、ピクセル化
  float pixelSize = gridSize * pixelSizeRatio;
  vec2 pixelatedUV = floor(fragCoord / pixelSize) * pixelSize / resolution;
  baseColor = texture2D(inputBuffer, pixelatedUV).rgb;

  // 輝度計算
  float luminance = dot(baseColor, vec3(1., 1., 1.));

  // Dither 判定
  bool dithered = getValue(luminance, fragCoord);

  // Dither パターン割り当て
  vec3 ditherColor = dithered ? foregroundColor : backgroundColor;

  // ピクセルブロック内に統一適用
  vec2 currentPixel = floor(fragCoord / pixelSize);
  vec2 originalPixel = floor(uv * resolution / pixelSize);
  baseColor = ditherColor;

  // 出力
  outputColor = vec4(baseColor, inputColor.a);
}
