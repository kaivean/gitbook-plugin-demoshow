
var fs = require('fs');
var Q = require('q');
var htmlencode = require('htmlencode');
var path = require('path');

module.exports = {
    /**
     * string format
     *
     * @param {string} source 模板字符串
     * @param {Object} obj   替换的变量对象，对象的key就是模板变量
     * @return {string}       目标代码
     * @example
     *     util.format('my name is {name}', {name: 'xiaowang'});
     */
    format: function (source, obj) {
        source = String(source);

        obj = obj || {};

        return source.replace(/\{(.+?)\}/g, function (match, variable) {
            var variables = variable.split('.');

            var value = obj;

            for (var i = 0; i < variables.length; i++) {
                var key = variables[i].trim();

                value = value[key] || '';
                if (value == null) {
                    break;
                }
            }

            if (exports.type(value) === 'function') {
                value = value(variable);
            }

            return value == null ? match : value;
        });
    }
};
