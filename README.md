# phaser3-tutorial
 



## 프로젝트 생성
- npm 사용
- 작업폴더에 package.json 파일 생성 (사용하는 모듈과 해당 모듈의 버전 관리)

```
npm init
```


## 패키지 설치

### phaser 
```
npm add phaser
```

## webpack typescript 
- webpack plugin 5.x 버전

```
npm add -D typescript @types/node cross-env webpack webpack-cli webpack-dev-server html-webpack-plugin clean-webpack-plugin copy-webpack-plugin terser-webpack-plugin ts-loader babel-loader @babel/core @babel/preset-env html-loader css-loader  style-loader json-loader
```

{: .notice

npm5부터 --save 옵션이 기본으로 적용되어 생략해도 dependencies 항목에 추가됨
-P or --save-prod : package.json의 dependencies에 패키지를 등록 (default)
-D or --save-dev : package.json의 devDepndencies에 패키지를 등록
-O or --save-optional : package.json의 optionalDependencies에 패키지를 등록
--no-save : dependencies에 패키지를 등록하지 않음
}



### eslint 플러그인 설치
~~~
npm add -D eslint eslint-config-prettier eslint-plugin-prettier prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
~~~


### 폴더 생성

~~~
├── src
    ├── assets
    ├── classes
    └── scenes
~~~
- assets
- classes
- scenes


###src/index.html

~~~
http-server에서 인식될 메인 문서
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0">
  <style>
    html,
    body {
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <div id="game"></div>
</body>
</html>
~~~


### tsconfig.json 생성
- 타입스크립트 설정 파일 
- https://www.typescriptlang.org/docs/handbook/tsconfig-json.html

~~~
{
  "compilerOptions": {
    "sourceMap": true,
    "strict": true,
    "noImplicitReturns": true,
    "noImplicitAny": true,
    "module": "es6",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "target": "es5",
    "allowJs": true,
    "baseUrl": ".",
  },
  "include": [
    "./index.d.ts",
    "**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "./dist/"
  ]
}
~~~


### .eslintrc.js
~~~
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-object-literal-type-assertion': 0,
    'sort-imports': [
      'warn',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
  },
};
~~~

### .prettierrc.js
~~~
module.exports = {
  printWidth: 100,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
};
~~~

### .vscode/settings.json
~~~
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "eslint.autoFixOnSave": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    {
      "language": "typescript",
      "autoFix": true
    },
  ],
  "[javascript]": {
    "editor.formatOnSave": false
  },
  "[typescript]": {
    "editor.formatOnSave": false
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
}
~~~

### webpack.config.js 생성
~~~
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

const babelOptions = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: 'last 2 versions, ie 11',
        modules: false,
      },
    ],
  ],
};

const config = {
  mode: isProd ? 'production' : 'development',
  context: path.resolve(__dirname, './src'),
  entry: './index.ts',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions,
          },
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: true,
      title: 'Phaser Webpack Template',
      appMountId: 'app',
      filename: 'index.html',
      inlineSource: '.(js|css)$',
      minify: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'assets',
          to: 'assets',
        },
      ],
    }),
  ],

  devServer: {
    static:{ 
    directory: path.join(__dirname, 'dist'),  // webpack plugin 5.x 버전
    },
    port: 5000,
    hot: true,
  },
};

module.exports = config;
~~~

### package.json 에 아래 사항 추가
~~~
"scripts": {
	"dev": "cross-env NODE_ENV=development webpack serve",
	"build": "cross-env NODE_ENV=production webpack --progress --hide-modules"
},
~~~

### src/index.ts
- 테스트 목적
~~~
console.log('Hello world!');
~~~

### dev-server 실행
~~~
npm run dev
~~~
