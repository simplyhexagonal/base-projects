import { promisify } from 'util';
import { readFile, access } from 'fs';
import { resolve } from 'path';

import glob from 'glob';
import { defineConfig, PluginOption } from 'vite';
import marked from 'marked';
import Logger from '@simplyhexagonal/logger';
import MonoContext from '@simplyhexagonal/mono-context';
import I18N from '@simplyhexagonal/i18n';
import { multiReplaceSync, MultiReplaceSyncPatterns } from '@simplyhexagonal/multi-replace';
import { parse } from 'node-html-parser';
import beautify from 'simply-beautiful';

import {
  name,
  version,
} from './package.json';

const readFilePromise = promisify(readFile);
const accessPromise = promisify(access);

const logger = new Logger({});

MonoContext.setState({
  logger,
});

const isProduction = process.env.STAGE === 'production';

const lang = ((process.argv[4] === '--') ? process.argv[5] : process.argv[4]) || 'en';

const resources = require(`./src/i18n/${lang}.json`);

const i18n = new I18N({
  resources,
});

const htmlContentPlugin: PluginOption = {
  name: 'htmlContent',
  transformIndexHtml: async (html: string, ctx) => {
    await i18n.initPromise;

    const markdownFilename = ctx.filename.replace(/\.html$/, `.${lang}.md`);
    const markdownContent = await readFilePromise(markdownFilename).then(
      (b) => b.toString()
    ).catch(
      () => i18n.apply('__("missingContent")')
    );

    const replacePatterns: MultiReplaceSyncPatterns = [
      [/\/assets/g, `/${lang}/assets`],
      [
        '<div id="md"></div>',
        () => `<div id="md">${marked(markdownContent)}</div>`,
      ],
    ];

    return multiReplaceSync(html, replacePatterns);
  },
};

const htmlSeoPlugin: PluginOption = {
  name: 'htmlSeo',
  transformIndexHtml: async (html: string, ctx) => {
    const metaFilename = ctx.filename.replace(/index\.html$/, `meta.${lang}.json`);
    const metaExists = await accessPromise(metaFilename).then(() => true).catch(() => false);

    if (!metaExists) {
      return beautify.html(html, { indent_size: 2 });
    }

    let meta;
    
    try {
      meta = await readFilePromise(metaFilename).then(
        (b) => JSON.parse(b.toString())
      );
    } catch (error) {
      await logger.error(error);
      process.exit(1);
    }

    const document = parse(html);

    const title = document.getElementsByTagName('title')[0];

    title.textContent = meta.headline || '';

    title.insertAdjacentHTML(
      'afterend',
      `
      <meta name="description" content="${meta.description || ''}">
      <meta name="keywords" content="${meta.keywords || ''}">
      <script type="application/ld+json">${JSON.stringify(meta)}</script>`
    );

    return beautify.html(document.toString(), { indent_size: 2 });
  },
};

const input = glob.sync(`${__dirname}/src/pages/**/index.html`, {}).reduce((a, b) => {
    const pathParts = b.split(/\/|\\/);
    const pageName = pathParts[pathParts.length - 2];

    // eslint-disable-next-line no-param-reassign
    a[pageName] = b;

    return a;
}, {} as any);

logger.info(`Building "${lang}" content for ${name}`);

// https://vitejs.dev/config/
export default defineConfig(async () => {
  await i18n.changeLanguage(lang);

  return {
    root: resolve(__dirname, 'src/pages'),
    publicDir: false,
    envDir: resolve(__dirname, '..', '..'),
    build: {
      rollupOptions: {
        input,
        output: (isProduction) ? {} : {
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name][extname]',
        },
      },
      emptyOutDir: false,
      outDir: resolve(__dirname, 'dist', lang),
      minify: isProduction,
    },
    plugins: [
      i18n.plugins.vite,
      htmlContentPlugin,
      htmlSeoPlugin,
    ],
    define: {
      'process.env.APP_VERSION': JSON.stringify(version),
      'process.env.LANGUAGE': JSON.stringify(lang),
    },
  };
});
