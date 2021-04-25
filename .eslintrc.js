// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
    },
    env: {
        browser: true,
    },
    extends: [
        // https://cn.vuejs.org/v2/style-guide/#%E4%BC%98%E5%85%88%E7%BA%A7-B-%E7%9A%84%E8%A7%84%E5%88%99%EF%BC%9A%E5%BC%BA%E7%83%88%E6%8E%A8%E8%8D%90-%E5%A2%9E%E5%BC%BA%E5%8F%AF%E8%AF%BB%E6%80%A7
        // https://github.com/vuejs/eslint-plugin-vue#priority-b-strongly-recommended-improving-readability
        'plugin:vue/strongly-recommended',
        // 英文：https://github.com/airbnb/javascript
        // 中文：https://github.com/sivan/javascript-style-guide/blob/master/es5/README.md
        'airbnb-base',
    ],
    settings: {
        'import/resolver': {
            webpack: {
                config: 'build/webpack.base.conf.js',
            },
        },
        'jsdoc': {
            tagNamePreference: {
                returns: 'return',
            },
        },
    },
    plugins: [
        'jsdoc',
        'vue',
    ],
    rules: {
        'no-shadow': [
            'error',
            {
                'allow': [
                    'state',
                ],
            },
        ],
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
        'no-param-reassign': 'off',
        'consistent-return': 'off',
        'global-require': 'off',
        'import/no-dynamic-require': 'off',
        'import/no-extraneous-dependencies': 'off',
        'no-restricted-syntax': 'off',
        "no-console": 0,
        // 4 行空格缩进
        'vue/html-indent': ['error', 4],
        'indent': ['error', 4],
        'jsdoc/check-param-names': 1,
        'jsdoc/check-tag-names': 1,
        'jsdoc/check-types': 1,
        'jsdoc/newline-after-description': 1,
        'jsdoc/require-description-complete-sentence': 0,
        'jsdoc/require-example': 0,
        'jsdoc/require-hyphen-before-param-description': 0,
        'jsdoc/require-param': 1,
        'jsdoc/require-param-description': 1,
        'jsdoc/require-param-name': 1,
        'jsdoc/require-param-type': 1,
        'jsdoc/require-returns-description': 0,
        'jsdoc/require-returns-type': 1,
        // 关闭语句强制分号结尾
        "semi": [0],
        "vue/html-self-closing": "off",

        "max-len": ["error", { "code": 150 }],

        // 关闭兼容 iview 的组件问题
        "vue/html-indent": "off",
        "vue/no-parsing-error": [2, { "x-invalid-end-tag": false }],
        "camelcase":"off",
        "comma-dangle":"off",
        "no-underscore-dangle": 0
    }
}
