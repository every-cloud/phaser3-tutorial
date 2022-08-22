# phaser3-tutorial 
 

#Part1 : 개발환경설정

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


# Part2 : 게임설정

## 알아야할 개념
### Scene life cycle
- init
- preload
- create
- update


### 1. Game객체 생성
- scr/index.ts에서 초기화
- 매개변수 설정

### 2. Scene 생성
- 최소 한개의 Scene이 필요함

- parameter 설명

title
type
parent
backgroundColor
scale
physics
render
callbacks
canvasStyle
autoFocus
audio
scene


### Typescript의 느낌표 ( ! ) 
- https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html
- 확정할당 어선셜(Definite Assignment Assertions) : 값이 무조건 할당되어있다고 컴파일러에게 전달하여 값이 없어도 변수 또는 개체를 사용할 수 있음





## Game 객체 생성

### src/index.ts
- 실행할 parameter 선언
- 게임창 크기 변경을 위한 sizeChanged() 메소드 추가

~~~
import { Game, Types } from 'phaser';
import { Level1, LoadingScene } from './scenes';

const gameConfig: Types.Core.GameConfig = {

// parameter 설정

	title: 'Phaser game tutorial',
  type: Phaser.WEBGL,
  parent: 'game',
  backgroundColor: '#351f1b',
  scale: {
    mode: Phaser.Scale.ScaleModes.NONE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  render: {
    antialiasGL: false,
    pixelArt: true,
  },
  callbacks: {
    postBoot: () => {
      window.sizeChanged();
    },
  },
  canvasStyle: `display: block; width: 100%; height: 100%;`,
  autoFocus: true,
  audio: {
    disableWebAudio: false,
  },
	scene: [LoadingScene, Level1],

};

window.sizeChanged = () => {
    if (window.game.isBooted) {
      setTimeout(() => {
        window.game.scale.resize(window.innerWidth, window.innerHeight);
        window.game.canvas.setAttribute(
          'style',
          `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`,
        );
      }, 100);
    }
  };
  
  window.onresize = () => window.sizeChanged();

  window.game = new Game(gameConfig);
~~~


### index.d.ts

~~~
interface Window {
    sizeChanged: () => void;
    game: Phaser.Game;
  }
~~~ 


## Scene 생성

### src/scenes/index.ts

~~~
export * from './loading';
~~~


### src/scenes/loading/index.ts

~~~
import { Scene } from 'phaser';
export class LoadingScene extends Scene {
  constructor() {
    super('loading-scene');
  }
  create(): void {
    console.log('Loading scene was created');
  }
}
~~~



## 캐릭터 불러오기
1. src/assets/sprites/king.png 추가
2. preload() method 추가하기
3. sprite 


### src/scenes/loading/index.ts

~~~
import { GameObjects, Scene } from 'phaser';
export class LoadingScene extends Scene {
  private king! : GameObjects.Sprite;

  constructor() {
    super('loading-scene');
  }

  preload(): void {
    this.load.baseURL = 'assets/';
    // key: 'king'
    // path from baseURL to file: 'sprites/king.png'
    this.load.image('king', 'sprites/king.png');
  }

  create(): void {
		this.king = this.add.sprite(100, 100, 'king');
	}

}
~~~


### webpack.config.js
~~~
dev모드에서 실행 시 실행 시 asset 표시되지 않아 plugin 추가
...
const CopyWebpackPlugin = require('copy-webpack-plugin');
...
plugins: [
	...,
	new CopyWebpackPlugin({
      patterns: [
        {
          from: 'assets',
          to: 'assets',
        },
      ],
    }),
	...
]
~~~


