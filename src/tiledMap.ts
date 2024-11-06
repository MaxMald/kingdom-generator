import { MapTile } from "./mapTile";
import { Vector2 } from "./math/vector2";
import { TerrainType } from "./terrainType";
import { HeightMap } from "./utilities/heightMap";

export class TiledMap 
{
  /**
   * MapTiles instances of this TiledMap.
   */
  private _m_tiles: MapTile[];

  /**
   * Number of columns.
   */
  private _m_numColumns: number;

  /**
   * Number of rows.
   */
  private _m_numRows: number;

  /**
   * The width of the tile texture.
   */
  private _m_textureWidth: number;

  /**
   * The height of the tile texture.
   */
  private _m_textureHeight: number;

  /**
   * Get the number of columns of this TiledMap.
   */
  public get NumColumns()
  {
    return this._m_numColumns;
  }

  /**
   * Get the number of rows of this TiledMap.
   */
  public get NumRows()
  {
    return this._m_numRows;
  }

  /**
   * The width of the texture of the tiles.
   */
  public get TextureWidth()
  {
    return this._m_textureWidth;
  }

  /**
   * The height of the texture of the tiles.
   */
  public get TextureHeight()
  {
    return this._m_textureHeight;
  }

  /**
   * Constructor.
   */
  public constructor()
  {
    this._m_tiles = new Array();
    this._m_numColumns = 0;
    this._m_numRows = 0;
  }

  public Init(
    scene: Phaser.Scene,
    numColumns: number,
    numRows: number,
    waterLevel: number,
    textureWidth: number,
    textureHeight: number,
    terrainHeightMap: HeightMap,
    forestMask: HeightMap,
  )
  {
    this._m_numColumns = numColumns;
    this._m_numRows = numRows;
    this._m_textureWidth = textureWidth;
    this._m_textureHeight = textureHeight;
    this._m_tiles = new Array<MapTile>(numColumns * numRows);
    
    let halfTextureWidth = textureWidth * 0.5;
    let halfTextureHeight = textureHeight * 0.5;
    for (let col = 0; col < numColumns; ++col)
    {
      for (let row = 0; row < numColumns; ++row)
      {
        this._m_tiles[col + row * this._m_numColumns] = new MapTile();
        if (terrainHeightMap.Get(col, row) <= waterLevel)
        {
          this.CreateMapTile(
            scene,
            col,
            row,
            TerrainType.kWater,
            halfTextureWidth,
            halfTextureHeight
          );
        }
        else if (forestMask.Get(col, row) == 1.0)
        {
          this.CreateMapTile(
            scene,
            col,
            row,
            TerrainType.kForest,
            halfTextureWidth,
            halfTextureHeight
          );
        }
        else
        {
          this.CreateMapTile(
            scene,
            col,
            row,
            TerrainType.kLand,
            halfTextureWidth,
            halfTextureHeight
          );
        }
      }  
    }
  }

  /**
   * Get a MapTile by its coordinates.
   * 
   * @param column The column index. 
   * @param row The row index.
   * 
   * @returns The MapTile located in the given coordinates.
   */
  public GetMapTile(column: number, row: number): MapTile
  {
    if (
      column < 0
      || column >= this.NumColumns
      || row < 0
      || row >= this.NumRows
    )
    {
      throw new Error("Invalid coordinates.");  
    }

    return this._m_tiles[column + (this._m_numColumns * row)];
  }

  private CreateMapTile(
    scene: Phaser.Scene,
    column: number,
    row: number,
    type: TerrainType,
    halfTextureWidth: number,
    halfTextureHeight: number
  ): MapTile
  {
    const tx = (column - row) * halfTextureWidth;
    const ty = (column + row) * halfTextureHeight;
    
    const tileSprite = scene.add.image(
      tx,
      ty,
      (type == TerrainType.kWater ? "water": "land") // TODO
    );
    tileSprite.depth = ty;

    const mapTile = new MapTile();
    mapTile.Init(
      new Vector2(column, row),
      type,
      tileSprite
    );

    return mapTile;
  }
}