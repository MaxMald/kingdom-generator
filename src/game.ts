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
    this._m_heightMap.Init(500, 500, perlinNoise.GeneratePerlinNoise(500, 500, 8, 2));
    //this.UpdateHeightMapVisualization(this._m_heightMap);
    this.UpdateHeightMapVisualization(this.CitiesTerrains());
  }

  private UpdateHeightMapVisualization(heightMap: HeightMap)
  {
    this._m_graphics.clear();

    let cellHeight: number = this.renderer.height / heightMap.Rows;
    let cellWidth: number = cellHeight;
    let black = new Phaser.Display.Color(0, 0, 0);
    let white = new Phaser.Display.Color(255, 255, 255);
    let rect = new Phaser.Geom.Rectangle(0, 0, cellWidth, cellHeight);
    for (let x = 0; x < heightMap.Columns; ++x)
    {
      for (let y = 0; y < heightMap.Rows; ++y)
      {
        rect.setPosition(x * cellWidth, y * cellHeight);        
        let colorObj = Phaser.Display.Color.Interpolate.ColorWithColor(black, white, 1, heightMap.Get(x, y));
        this._m_graphics.fillStyle(
          new Phaser.Display.Color(colorObj.r, colorObj.g, colorObj.b).color
        );
        this._m_graphics.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
    }
  }

  private CitiesTerrains() : HeightMap
  {
    let positions: Phaser.Math.Vector2[];
    positions = [
      new Phaser.Math.Vector2(50, 50),
      new Phaser.Math.Vector2(150, 150)
    ]

    let cityRadious = 30;
    let innerRadious = 15;
    let values: number[] = new Array(240 * 240);

    for (let x = 0; x < 240; ++x)
    {
      for (let y = 0; y < 240; ++y)
      {
        for (let cityPositionIndex = 0; cityPositionIndex < positions.length; ++cityPositionIndex)
        {
          let cityDistance: number = Math.sqrt(
            Math.pow(positions[cityPositionIndex].x - x, 2) + Math.pow(positions[cityPositionIndex].y - y, 2)
          );
          if (cityDistance <= cityRadious)
          {
            if (cityDistance > innerRadious)
            {
              values[x + y * 240] = 1.0 - ((cityDistance - innerRadious) / (cityRadious - innerRadious));  
            }
            else
            {
              values[x + y * 240] = 1.0;  
            }
          }
          else
          {
            if (values[x + y * 240] == null)
            {
              values[x + y * 240] = 0.0;  
            }
          }
        }        
      }
    }

    let heightMap = new HeightMap();
    heightMap.Init(240, 240, values);
    return heightMap;
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
