export class TiledMapGeneratorConfiguration
{
  public numColumns: number;

  public numRows: number;

  public textureWidth: number;

  public textureHeight: number;

  public waterLevel: number;

  public forestLevel: number;

  public terrainNumOctaves: number;

  public terrainScalingBias: number;

  public numCities: number;

  public centralCityRadius: number;

  public cityRadius: number;

  public constructor(
    numColumns: number,
    numRows: number,
    textureWidth: number,
    textureHeight: number,
    waterLevel: number,
    forestLevel: number,
    terrainNumOctaves: number,
    terrainScalingBias: number,
    numCities: number,
    centralCityRadius: number,
    cityRadius: number
  )
  {
    this.numColumns = numColumns;
    this.numRows = numRows;
    this.textureWidth = textureWidth;
    this.textureHeight = textureHeight;
    this.waterLevel = waterLevel;
    this.forestLevel = forestLevel;
    this.terrainNumOctaves = terrainNumOctaves;
    this.terrainScalingBias = terrainScalingBias;
    this.numCities = numCities;
    this.centralCityRadius = centralCityRadius;
    this.cityRadius = cityRadius;
  }
}