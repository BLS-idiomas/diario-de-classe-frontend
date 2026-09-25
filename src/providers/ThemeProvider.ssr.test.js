import React from 'react';
import { renderToString } from 'react-dom/server';
import { ThemeProvider } from './ThemeProvider';
import { parseThemeCookie, serializeThemeCookie } from '@/utils/themeCookie';
import {
  lerPreferenciaSemGuard,
  gravarPreferenciaSemGuard,
} from '@/utils/__fixtures__/regressaoHidratacao.fixture';

describe('ThemeProvider — ausência de I/O de browser em funções puras', () => {
  it('parseThemeCookie/serializeThemeCookie nunca tocam Storage.prototype', () => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    parseThemeCookie('dark');
    serializeThemeCookie('dark');

    expect(getItemSpy).not.toHaveBeenCalled();
    expect(setItemSpy).not.toHaveBeenCalled();

    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
  });
});

describe('ThemeProvider — a rede de teste pega a regressão (NFR-001-001/002, AC-001-009/010)', () => {
  it('regressão fixture: um getter de tema sem guard É detectado pelo mesmo spy de Storage.prototype.getItem', () => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');

    lerPreferenciaSemGuard();

    expect(getItemSpy).toHaveBeenCalled();

    getItemSpy.mockRestore();
  });

  it('regressão fixture: uma gravação sem guard É detectada pelo mesmo spy de Storage.prototype.setItem (controle positivo da ausência afirmada acima)', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    gravarPreferenciaSemGuard();

    expect(setItemSpy).toHaveBeenCalled();

    setItemSpy.mockRestore();
  });
});

describe('ThemeProvider — paridade real de SSR (renderToString)', () => {
  // Fixture discriminante: se alguém reintroduzir getInitialTheme() como
  // inicializador lazy de useState, renderToString sempre produziria 'light'
  // independente de initialTheme, e este teste passaria a falhar.
  it('renderToString com initialTheme="dark" produz data-theme="dark"', () => {
    const html = renderToString(
      <ThemeProvider initialTheme="dark">
        <span>x</span>
      </ThemeProvider>
    );

    expect(html).toContain('data-theme="dark"');
  });

  it('renderToString com initialTheme="light" não produz data-theme="dark"', () => {
    const html = renderToString(
      <ThemeProvider initialTheme="light">
        <span>x</span>
      </ThemeProvider>
    );

    expect(html).not.toContain('data-theme="dark"');
  });
});
