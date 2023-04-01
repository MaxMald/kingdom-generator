import 'phaser';
import { PerlinNoise2D } from './perlinNoise2D';
import { HeightMap } from './heightMap';

export default class Demo extends Phaser.Scene
{
  private _m_heightMap: HeightMap;

  private _m_graphics: Phaser.GameObjects.Graphics;

  constructor()
  {
    super('demo');
  }

  preload()
  {
    this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.image('libs', 'assets/libs.png');
    this.load.glsl('bundle', 'assets/plasma-bundle.glsl.js');
    this.load.glsl('stars', 'assets/starfields.glsl.js');
  }

  create()
  {
    this._m_graphics = this.add.graphics();
    let perlinNoise: PerlinNoise2D = new PerlinNoise2D();
    perlinNoise.Init(500, 500);
    
    this._m_heightMap = new HeightMap();
    this._m_heightMap.Init(500, 500, perlinNoise.GeneratePerlinNoise(500, 500, 4, 2));
    
    let cellHeight: number = this.renderer.height / 500;
    let cellWidth: number = cellHeight;

    let black = new Phaser.Display.Color(0, 0, 0);
    let white = new Phaser.Display.Color(255, 255, 255);
    let rect = new Phaser.Geom.Rectangle(0, 0, cellWidth, cellHeight);
    for (let x = 0; x < 500; ++x)
    {
      for (let y = 0; y < 500; ++y)
      {
        rect.setPosition(x * cellWidth, y * cellHeight);
        
        let colorObj = Phaser.Display.Color.Interpolate.ColorWithColor(black, white, 1, this._m_heightMap.Get(x, y));
        let color = new Phaser.Display.Color(colorObj.r, colorObj.g, colorObj.b); 
        this._m_graphics.fillStyle(
          color.color
        );
        this._m_graphics.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
    }

    console.log("ready");
  }
}

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#125555',
  width: 800,
  height: 600,
  scene: Demo
};

const game = new Phaser.Game(config);
