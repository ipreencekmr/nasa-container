/* eslint-disable import/no-extraneous-dependencies -- desc */
const fs = require('fs-extra');
const fetch = require('node-fetch');
const { name, version } = require('../package.json');

// This is created during the build process within the deploy action
const bundleIntegrity = require('../bundle.integrity.manifest.json');

const moduleMapUrl = 'https://module-map.vercel.app/module-map.json'; // This is the module map URL you got in the previous step i.e. https://example-module-map.vercel.app

const STATIC_ASSETS_URL = 'https://nasa-container.vercel.app'; // example 'https://my-module.vercel.app'

const updateModuleMap = async () => {
  try {
    const response = await fetch(moduleMapUrl); // download the current module map

    const moduleMapContent = await response.json();
    const dir = 'statics';

    moduleMapContent.modules[name] = {
      browser: {
        url: `${STATIC_ASSETS_URL}/${version}/${name}.browser.js`,
        integrity: bundleIntegrity.browser,
      },
      legacyBrowser: {
        url: `${STATIC_ASSETS_URL}/${version}/${name}.legacy.browser.js`,
        integrity: bundleIntegrity.legacyBrowser,
      },
      node: {
        url: `${STATIC_ASSETS_URL}/${version}/${name}.node.js`,
        integrity: bundleIntegrity.node,
      },
    };

    await fs.ensureDir(dir);
    // write the updated module map to a temporary folder
    // so it can be re-uploaded by the deploy action
    await fs.writeFile(
      `./${dir}/module-map.json`, JSON.stringify(moduleMapContent, null, 2)
    );

    fs.copySync(`./build/${version}`, `./${dir}/modules/${name}/${version}/`, { overwrite: true });
  } catch (error) {
    // eslint-disable-next-line no-console -- desc
    console.error(error);
  }
};

updateModuleMap().catch((err) => {
  // eslint-disable-next-line no-console -- desc
  console.log(err);
});
