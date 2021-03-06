const path = require('path');
const glob = require('glob');
const fs = require('fs-extra');
const parseMd = require('../utils/parseMarkdown');
const Prism = require('prismjs');

module.exports = function(rootDir) {
  const demos = [];
  // read demos
  glob.sync(path.resolve(rootDir, 'demo/*.{js,jsx,md}')).forEach(filePath => {
    const name = filePath.substring(
      filePath.lastIndexOf('/') + 1,
      Math.max(filePath.indexOf('.js'), filePath.indexOf('.md'))
    );
    const demo = {
      name,
      filePath,
      title: name,
      order: 0,
      js: '',
      desc: ''
    };

    if (/\.md$/.test(filePath)) {
      const result = parseMd(name, filePath);

      demo.title = result.meta.title;
      demo.js = result.js;
      demo.order = result.meta.order;
      demo.desc = result.body;
    } else {
      demo.js = fs.readFileSync(filePath, 'utf-8');
    }

    demos.push({
      ...demo,
      code: Prism.highlight(demo.js, Prism.languages.javascript, 'javascript')
    });
  });

  return demos.sort((demo1, demo2) => {
    return demo1.order > demo2.order ? 1 : -1;
  });
};
