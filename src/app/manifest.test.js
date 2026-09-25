import fs from 'node:fs';
import path from 'node:path';

const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

// Lê width/height reais gravados no chunk IHDR do PNG (bytes 16-19 e 20-23,
// depois dos 8 bytes de assinatura + 4 de tamanho + 4 do tipo "IHDR") — nunca
// confia só no `sizes` declarado no manifest, que é exatamente o que a
// regressão corrigida por esta TASK deixava mentir (src apontando de volta
// para bls.png 225x224 com sizes 192x192/512x512).
function readPngDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

describe('manifest.json', () => {
  it('declara exatamente 3 ícones reais, com tamanhos e purpose corretos', () => {
    expect(manifest.icons).toHaveLength(3);

    const [icon192, icon512, iconMaskable] = manifest.icons;

    expect(icon192).toMatchObject({ sizes: '192x192', purpose: 'any' });
    expect(icon512).toMatchObject({ sizes: '512x512', purpose: 'any' });
    expect(iconMaskable).toMatchObject({
      sizes: '512x512',
      purpose: 'maskable',
    });

    expect(manifest.display).toBe('standalone');
    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.theme_color).toBeTruthy();
  });

  it.each(manifest.icons)(
    '$src existe em public/ e suas dimensões reais (lidas do PNG) batem com sizes ($sizes)',
    ({ src, sizes }) => {
      const iconPath = path.join(process.cwd(), 'public', src);
      expect(fs.existsSync(iconPath)).toBe(true);

      const [expectedWidth, expectedHeight] = sizes.split('x').map(Number);
      const { width, height } = readPngDimensions(iconPath);

      expect(width).toBe(expectedWidth);
      expect(height).toBe(expectedHeight);
    }
  );
});
