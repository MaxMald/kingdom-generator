import { City } from "./city";
import { Agent } from "./object";
import { TerrainType } from "./terrainType";
import { TiledMap } from "./tiledMap";
import { TiledMapGeneratorConfiguration } from "./tiledMapGeneratorConfiguration";
import { HeightMap } from "./utilities/heightMap";
import { PerlinNoise2D } from "./utilities/perlinNoise2D";
import { SteeringForce } from "./utilities/steeringForce";

export class TiledMapGenerator
{
  public Generate(config: TiledMapGeneratorConfiguration): TiledMap
  {
    let perlinNoise: PerlinNoise2D = new PerlinNoise2D();
    let terrainHeightMap: HeightMap = this.GenerateTerrainHeightMap(
      perlinNoise,
      config.numColumns,
      config.numRows,
      config.terrainNumOctaves,
      config.terrainScalingBias
    );

    let cities: City[] = this.CalculateCitiesDistribution(
      config.numCities,
      config.centralCityRadius,
      config.centralCityRadius * 0.5,
      config.cityRadius,
      config.cityRadius * 0.5,
      config.numColumns,
      config.numRows
    );

    let citiesTerrainHeightMap: HeightMap = this.GenerateCitiesTerrainHeightMap(
      cities,
      config.numColumns,
      config.numRows
    );

    let forestMask: HeightMap = this.GenerateForestMask(
      perlinNoise,
      config.numColumns,
      config.numRows,
      config.terrainNumOctaves,
      config.terrainScalingBias,
      config.forestLevel
    );

    terrainHeightMap.Add(citiesTerrainHeightMap);
    forestMask.Cut(terrainHeightMap, config.waterLevel);
    forestMask.Cut(citiesTerrainHeightMap, 0.1);

    let tiledMap: TiledMap = new TiledMap();
    tiledMap.Init(
      config.numColumns,
      config.numRows,
      config.waterLevel,
      terrainHeightMap,
      forestMask
    );

    let str: String = "";
    for (let row = 0; row < config.numRows; ++row)
    {
      for (let col = 0; col < config.numColumns; ++col)
      {
        switch (tiledMap.GetMapTile(col, row).TerrainType)
        {
          case TerrainType.kForest:
            str += '▩'
            break;
          case TerrainType.kLand:
            str += '▦'
            break;
          case TerrainType.kWater:
            str += '▥'
            break;
        }
      }
      str += '\n';
    }

    console.log(str);
    return tiledMap;
  }

  private GenerateTerrainHeightMap(
    perlin: PerlinNoise2D,
    numColumns: number,
    numRows: number,
    numOctaves: number,
    scalingBias: number
  ) : HeightMap
  {
    perlin.Init(numColumns, numRows);
    let terrainHeightMap: HeightMap = new HeightMap();    
    terrainHeightMap.Init(
      numColumns,
      numRows,
      perlin.GeneratePerlinNoise(
        numColumns,
        numRows,
        numOctaves,
        scalingBias
      )
    );
    return terrainHeightMap;
  }

  private GenerateForestMask(
    perlin: PerlinNoise2D,
    numColumns: number,
    numRows: number,
    numOctaves: number,
    scalingBias: number,
    forestLevel: number
  ) : HeightMap
  {
    perlin.Init(numColumns, numRows);
    let forestMask = new HeightMap();
    forestMask.Init(
      numColumns,
      numRows,
      perlin.GeneratePerlinNoise(
        numColumns,
        numRows,
        numOctaves,
        scalingBias
      )
    );
    forestMask.RoundValues(forestLevel);
    return forestMask;
  }

  private CalculateCitiesDistribution(
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
        let force = SteeringForce.ObjectAvoidance(city, 15, cities);
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

  private GenerateCitiesTerrainHeightMap(cities: City[], numColumns: number, numRows: number) : HeightMap
  {
    let values: number[] = new Array(numColumns * numRows);

    for (let x = 0; x < numColumns; ++x)
    {
      for (let y = 0; y < numRows; ++y)
      {
        values[x + y * numColumns] = 0;
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

          values[x + y * numColumns] = Math.min(1.0, values[x + y * numColumns] + value);
        }
      }
    }

    let heightMap = new HeightMap();
    heightMap.Init(numColumns, numRows, values);
    return heightMap;
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
}