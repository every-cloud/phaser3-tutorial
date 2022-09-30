# Part1 : 개발환경설정


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

> npm5부터 --save 옵션이 기본으로 적용되어 생략해도 dependencies 항목에 추가됨
> -P or --save-prod : package.json의 dependencies에 패키지를 등록 (default)
> -D or --save-dev : package.json의 devDepndencies에 패키지를 등록
> -O or --save-optional : package.json의 optionalDependencies에 패키지를 등록
> --no-save : dependencies에 패키지를 등록하지 않음




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


### src/index.html

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
import { LoadingScene } from './scenes';

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
	scene: [LoadingScene],

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

> index.d.ts
> d.ts 파일은 TypeScript 코드로 작성한 선언 파일 (d는 declaration, 선언을 의미)
> 라이브러리는 자바스크립트 파일로 동작하는데 이 라이브러리를 타입스크립트 코드에서 사용하려면 타입을 추론할 수 없는 문제가 발생함
> 에러가 발생하지 않도록 d.ts 선언파일을 만들어 라이브러리에 사용되는 변수들의 타입을 선언해놓음




## Scene 생성



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

### src/scenes/index.ts

~~~
export * from './loading';
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
- dev모드에서 실행 시 실행 시 asset 표시되지 않아 plugin 추가

~~~
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


# Part3 : 캐릭터 애니메이션, 이동 기능, 키 바인딩


### src/scenes/level-1/index.ts

~~~
import { Scene } from 'phaser';
export class Level1 extends Scene {
  constructor() {
    super('level-1-scene');
  }
  create(): void {
		...
	}
}
~~~

### src/scenes/index.ts
~~~
export * from './loading';
export * from './level-1';
~~~

gameConfig scene array 에 level-1 scene 추가하기
### src/index.ts
~~~
import { Level1, LoadingScene } from './scenes';
...
const gameConfig = {
	...
	scene: [LoadingScene, Level1],
	...
};
~~~

king을 Loading scene 에서 Level1 Secene 으로 옮기기

### src/scenes/level-1/index.ts
~~~
import { GameObjects, Scene } from 'phaser';
export class Level1 extends Scene {
  private king!: GameObjects.Sprite;
  constructor() {
    super('level-1-scene');
  }
  create(): void {
    this.king = this.add.sprite(100, 100, 'king');
  }
}
~~~

Loading scene 에서 로딩이 끝난 후 다음 scene이 실행되도록 설정
### src/scenes/loading/index.ts
~~~
...
preload(): void {
  this.load.baseURL = 'assets/';
  this.load.image('king', 'sprites/king.png');
}
...
create(): void {
  this.scene.start('level-1-scene');
}
...
~~~


# Creating an actor


일반적인 속성과 메소드를 포함한 actor 클래스 만들기(player 와 enemy 모두 적용 가능)
> 이후 player 클래스 생성
### src/classes/actor.ts
~~~
import { Physics } from 'phaser';
export class Actor extends Physics.Arcade.Sprite {
	protected hp = 100;
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.getBody().setCollideWorldBounds(true);
  }
	public getDamage(value?: number): void {
    this.scene.tweens.add({
      targets: this,
      duration: 100,
      repeat: 3,
      yoyo: true,
      alpha: 0.5,
      onStart: () => {
        if (value) {
          this.hp = this.hp - value;
        }
      },
      onComplete: () => {
        this.setAlpha(1);
      },
    });
  }
	public getHPValue(): number {
    return this.hp;
  }
	protected checkFlip(): void {
    if (this.body.velocity.x < 0) {
      this.scaleX = -1;
    } else {
      this.scaleX = 1;
    }
  }
  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body;
  }
}
~~~

- this.getBody().setCollideWorldBounds(true) : "box" 스프라이트에 반응
- protected checkFlip() : actor 가 왼쪽이나 오른쪽으로 이동 시 회전하도록
- public getDamage() : actor를 공격하기 위한 메소드
- scene.tweens : 대상 object의 일부 속성을 조작하여 애니메이션과 같은 효과 적용
 : onStart : 깜빡이는 애니메이션 시작 시, hp 감소
 : onComplete : 애니메이션이 끝나면 현재 불투명도 값을 this.setAlpha(1)로 강제 설정 
   - Alpha 값은 0-1
   - 값이 낮을수록 더 투명


# Creating a player character

### src/classes/player.ts
~~~
import { Actor } from './actor';
export class Player extends Actor {
  private keyW: Phaser.Input.Keyboard.Key;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyS: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'king');
    // KEYS
    this.keyW = this.scene.input.keyboard.addKey('W');
    this.keyA = this.scene.input.keyboard.addKey('A');
    this.keyS = this.scene.input.keyboard.addKey('S');
    this.keyD = this.scene.input.keyboard.addKey('D');
    // PHYSICS
    this.getBody().setSize(30, 30);
    this.getBody().setOffset(8, 0);
  }
  update(): void {
    this.getBody().setVelocity(0);
    if (this.keyW?.isDown) {
      this.body.velocity.y = -110;
    }
    if (this.keyA?.isDown) {
      this.body.velocity.x = -110;
      this.checkFlip();
      this.getBody().setOffset(48, 15);
    }
    if (this.keyS?.isDown) {
      this.body.velocity.y = 110;
    }
    if (this.keyD?.isDown) {
      this.body.velocity.x = 110;
      this.checkFlip();
      this.getBody().setOffset(15, 15);
    }
  }
} 

~~~

- 키 동작
private keyW: Phaser.Input.Keyboard.Key;
this.keyW = this.scene.input.keyboard.addKey('W');

- 키 눌렸을 때 이동 속도 적용, 
- 키 안눌릴 경우 속도 0
- 좌우 이동 시 회전 여부
update(): void {
    this.getBody().setVelocity(0);
    if (this.keyW?.isDown) {
      this.body.velocity.y = -110;
    }
    if (this.keyA?.isDown) {
      this.body.velocity.x = -110;
      this.checkFlip();
      this.getBody().setOffset(48, 15);
    }
    
    - 스프라이트 물리적 model(box) 설정
    this.getBody().setSize(30, 30);
this.getBody().setOffset(8, 0);


# Adding a player character
- 캐릭터 class 만들었으니, 첫 번째 level scene에서 캐릭터 생성

### src/scenes/level-1/index.ts
~~~
import { Scene } from 'phaser';
import { Player } from '../../classes/player';
export class Level1 extends Scene {
  private player!: Player;
  constructor() {
    super('level-1-scene');
  }
  create(): void {
    this.player = new Player(this, 100, 100);
  }
  update(): void {
    this.player.update();
  }
}
~~~

- update method 에서 각 프레임마다 player character를 호출하여 위치 변경함
  update(): void {
    this.player.update();
  }
  
 
 
 # Part 4: Sprite sheets and movement animation
 
## Sprite sheet
- sprite sheet는 sprite의 모음으로 sprite sheet의 프레임으로 애니메이션 만들 수 있음



## Downloading the atlas
atlas를 key로 사용하려면 asset 처럼 불러와야 함
Loading scene 에서 altas와 json 불러오기

### src/scenes/loading/index.ts
~~~
preload(): void {
	this.load.baseURL = 'assets/';
	// Our king texture
	this.load.image('king', 'sprites/king.png');
	// Our king atlas
	this.load.atlas('a-king', 'spritesheets/a-king.png', 'spritesheets/a-king_atlas.json');
}

- a-king texture key로 atlas 사용할 수 있음


캐릭터에 애니메이션 적용하기 위해 player class에 애니메이션 method 생성

### src/classes/player.ts

~~~
export class Player extends Actor {
...
	constructor(...) {
		...
		this.initAnimations();
	}
...
	private initAnimations(): void {
    this.scene.anims.create({
      key: 'run',
      frames: this.scene.anims.generateFrameNames('a-king', {
        prefix: 'run-',
        end: 7,
      }),
      frameRate: 8,
    });
    this.scene.anims.create({
      key: 'attack',
      frames: this.scene.anims.generateFrameNames('a-king', {
        prefix: 'attack-',
        end: 2,
      }),
      frameRate: 8,
    });
	}
...
~~~




