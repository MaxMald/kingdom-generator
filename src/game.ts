import 'phaser';
import { PerlinNoise2D } from './perlinNoise2D';
import { HeightMap } from './heightMap';
import { Agent } from './object';
import { City } from './city';

export default class Demo extends Phaser.Scene
{
  private _m_heightMap: HeightMap;

  private _m_graphics: Phaser.GameObjects.Graphics;

  private _m_forestGraphics: Phaser.GameObjects.Graphics;

  private _m_citiesGraphics: Phaser.GameObjects.Graphics;

  private _m_colorRed: Phaser.Display.Color;

  private _m_colorGreen: Phaser.Display.Color;

  private _m_colorDarkGreen: Phaser.Display.Color;

  private _m_colorBlue: Phaser.Display.Color;

  private _m_scaleX: number;
  
  private _m_scaleY: number;

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
    let width: number = 180;
    let height: number = 180;

    this._m_scaleY = this.renderer.height / height;
    this._m_scaleX = this._m_scaleY;

    this._m_colorRed = new Phaser.Display.Color(255, 0, 0);
    this._m_colorGreen = new Phaser.Display.Color(0, 255, 0);
    this._m_colorBlue = new Phaser.Display.Color(0, 0, 255);
    this._m_colorDarkGreen = new Phaser.Display.Color(1, 50, 32);

    this._m_graphics = this.add.graphics();
    this._m_forestGraphics = this.add.graphics();
    this._m_citiesGraphics = this.add.graphics();

    let perlinNoise: PerlinNoise2D = new PerlinNoise2D();
    perlinNoise.Init(500, 500);    
    this._m_heightMap = new HeightMap();
    this._m_heightMap.Init(width, height, perlinNoise.GeneratePerlinNoise(width, height, 7, 1.1));
    
    perlinNoise.Init(500, 500);
    let forestMap = new HeightMap();
    forestMap.Init(width, height, perlinNoise.GeneratePerlinNoise(width, height, 7, 1.1));

    let cities: City[] = this.GenerateCitiesDistribution(4, 35, 15, 20, 10, width, height);
    let citiesTerrainElevationMask = this.CitiesTerrains(cities, width, height);
    this._m_heightMap = HeightMap.Add(this._m_heightMap, citiesTerrainElevationMask);
    let maskedForestMap = HeightMap.Cut(forestMap, this._m_heightMap, 0.5, true);
    maskedForestMap = HeightMap.Mask(maskedForestMap, citiesTerrainElevationMask, true);
    //this.UpdateHeightMapVisualization();
    this.UpdateTerrainElevationVisualiztion(this._m_heightMap, 0.5);
    this.UpdateForest(this._m_forestGraphics, maskedForestMap, 0.5, this._m_scaleX, this._m_scaleY);
    for (let i = 0; i < cities.length; ++i)
    {
      this.PaintCity(this._m_citiesGraphics, cities[i], this._m_scaleX);  
    }

    //this.UpdateHeightMapVisualization();

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

  private UpdateTerrainElevationVisualiztion(heightMap: HeightMap, waterLevel: number)
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
        
        if (heightMap.Get(x, y) < waterLevel)
        {
          this._m_graphics.fillStyle(this._m_colorBlue.color);
        }
        else
        {
          this._m_graphics.fillStyle(this._m_colorGreen.color);  
        }
        
        this._m_graphics.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
    }
  }

  private UpdateForest(
    graphics: Phaser.GameObjects.Graphics,
    heightMap: HeightMap,
    threshold: number,
    cellWidth: number,
    cellHeight: number
  )
  {
    graphics.clear();
    let rect = new Phaser.Geom.Rectangle(0, 0, cellWidth, cellHeight);
    for (let x = 0; x < heightMap.Columns; ++x)
    {
      for (let y = 0; y < heightMap.Rows; ++y)
      {
        rect.setPosition(x * cellWidth, y * cellHeight);
        
        if (heightMap.Get(x, y) > threshold)
        {
          this._m_graphics.fillStyle(this._m_colorDarkGreen.color);
          this._m_graphics.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        }
      }
    }
  }

  private GenerateCitiesDistribution(
    numCities: number,
    centralCityRadius: number,
    centralCityInnerRadius: number,
    citiesRadius: number,
    citiesInnerRadius: number,
    width: number,
    height: number
  ): City[]
  {
    let cities: City[] = new Array<City>();
    
    let centralCity: City = new City();
    centralCity.Init(
      new Phaser.Math.Vector2(Math.random() * width, Math.random() * height),
      centralCityRadius
    );
    centralCity.SetInnerRadius(centralCityInnerRadius);
    cities.push(centralCity);

    for (let i = 0; i < numCities; ++i)
    {
      let city = new City();
      city.Init(
        new Phaser.Math.Vector2(Math.random() * width, Math.random() * height),
        citiesRadius
      );
      city.SetInnerRadius(citiesInnerRadius);
      cities.push(city);  
    }
    
    let citiesListSize: number = cities.length;
    for (let i = 0; i < 500; ++i)
    {
      for (let cityIndex = 0; cityIndex < citiesListSize; ++cityIndex)
      {
        let city: City = cities[cityIndex];
        let force = this.ObjectAvoidance(city, 15, cities);
        force.setLength(Math.min(force.length(), 15));
        city.SetPosition(city.Position.add(force));
        this.KeepAgentInBounds(
          city,
          width * 0.1,
          height * 0.1,
          width * 0.9,
          height * 0.9);
      }
    }

    return cities;
  }

  private KeepAgentInBounds(agent: Agent, x: number, y: number, x2: number, y2: number)
  {
    agent.SetPosition(
      new Phaser.Math.Vector2(
        Math.min(Math.max(x, agent.Position.x), x2 - 1),
        Math.min(Math.max(y, agent.Position.y), y2 - 1)
      )
    );
  }

  private CitiesTerrains(cities: City[], width: number, height: number) : HeightMap
  {
    let values: number[] = new Array(width * height);

    for (let x = 0; x < width; ++x)
    {
      for (let y = 0; y < height; ++y)
      {
        values[x + y * width] = 0;
        for (let cityPositionIndex = 0; cityPositionIndex < cities.length; ++cityPositionIndex)
        {
          let city: City = cities[cityPositionIndex];
          let cityDistance: number = Math.sqrt(
            Math.pow(city.Position.x - x, 2) + Math.pow(city.Position.y - y, 2)
          );
          let value = 0.0;
          if (cityDistance <= city.Radius)
          {
            if (cityDistance > city.InnerRadius)
            {
              value = 1.0 - ((cityDistance - city.InnerRadius) / (city.Radius - city.InnerRadius));  
            }
            else
            {
              value = 1.0;  
            }
          }

          values[x + y * width] = Math.min(1.0, values[x + y * width] + value);
        }
      }
    }

    let heightMap = new HeightMap();
    heightMap.Init(width, height, values);
    return heightMap;
  }

  private ObjectAvoidance(
    agent: Agent,
    maxForce: number,
    objects: Agent[]
  ): Phaser.Math.Vector2
  {
    let force = new Phaser.Math.Vector2(0, 0);
    let numObjects = objects.length;
    for (let i = 0; i < numObjects; ++i)
    {
      let object = objects[i];
      if (object.Id == agent.Id)
      {
        continue;  
      }

      let toAgent = new Phaser.Math.Vector2(agent.Position.x - object.Position.x, agent.Position.y - object.Position.y);
      let distanceToAgent = toAgent.length();
      if (distanceToAgent < (agent.Radius + object.Radius))
      {
        let forceScale = 1 - distanceToAgent / (agent.Radius + object.Radius);
        force = force.add(toAgent.setLength(maxForce * forceScale));
      }
    }

    return force;
  }

  private PaintCity(graphics: Phaser.GameObjects.Graphics, city: Agent, scale: number)
  {
    graphics.fillStyle(this._m_colorRed.color);
    graphics.fillCircle(city.Position.x * scale, city.Position.y * scale, 2 * scale);
    graphics.lineStyle(1, this._m_colorBlue.color);
    graphics.strokeCircle(city.Position.x * scale, city.Position.y * scale, city.Radius * scale);
  }
}

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#125555',
  width: 900,
  height: 900,
  scene: Demo
};

const game = new Phaser.Game(config);
