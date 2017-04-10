"use strict";

const through = require('through2');
const path = require("path");
const File = require('vinyl');
const DataUri = require("datauri");

const PLUGIN_NAME = 'gulp-sprite-datauri';

/**
 * @param {object} options
 * @param {string} [options.fileName=_sprite.scss] - the name of the output partial
 * @param {[object]} options.colors - an array of colours and their hex codes in the format: { green: '#00ff00' }
 */
function gulpDataUriVariables(options) {
    const outputName = options.fileName || '_sprite.scss';

    let spriteSass = '';

    function writeVariable(name, value) {
        spriteSass += `\$${name}: "${value}";\n\r`;
    }
    
    return through.obj((file, enc, cb) => {
        if (file.isNull()) {
            return cb();
        }

        const fileName = path.basename(file.path);
        const variableName = fileName.substring(0, fileName.indexOf('.'));

        const dataUri = new DataUri();
        const fileExt = fileName.substring(fileName.lastIndexOf('.'), fileName.length);
        dataUri.format(fileExt, file._contents);

        writeVariable(variableName, dataUri.content);
        if (fileName.includes('.colors')) {
            if (fileExt === '.svg') {
                const strippedFileExt = fileName.substring(0, fileName.lastIndexOf('.'));
                const colors = strippedFileExt.substring(fileName.indexOf('.colors') + 8, fileName.length).split('-');

                for (let i = 0; i < colors.length; i++) {
                    const fileContent = file._contents.toString();
                    const colorCode = options.colors[colors[i]];
                    if (!colorCode) { throw new Error(`${PLUGIN_NAME}: No definition for ${colors[i]} in gulpfile`); }

                    const colouredFile = fileContent.replace(/#[0-9A-F]{6}/gi, colorCode);
                    writeVariable(`${variableName}-${colors[i]}`, dataUri.format('.svg', colouredFile).content);
                }
            } else {
                throw new Error(`${PLUGIN_NAME}: can't do colour changes for ${fileName}. Only works on .svg`)
            }
        } 

        cb();
    }, cb => {
        const sassPartial = new File({
            path: outputName,
            contents: new Buffer(spriteSass)
        });

        cb(null, sassPartial);
    });
}

module.exports = gulpDataUriVariables;