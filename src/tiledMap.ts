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
   * Constructor.
   */
  public constructor()
  {
    this._m_tiles = new Array();
    this._m_numColumns = 0;
    this._m_numRows = 0;
  }

  public Init(
    numColumns: number,
    numRows: number,
    waterLevel: number,
    terrainHeightMap: HeightMap,
    forestMask: HeightMap,
  )
  {
    this._m_numColumns = numColumns;
    this._m_numRows = numRows;    
    this._m_tiles = new Array<MapTile>(numColumns * numRows);
    for (let col = 0; col < numColumns; ++col)
    {
      for (let row = 0; row < numColumns; ++row)
      {
        this._m_tiles[col + row * this._m_numColumns] = new MapTile();
        if (terrainHeightMap.Get(col, row) <= waterLevel)
        {
          this._m_tiles[col + row * this._m_numColumns].Init(
            new Vector2(col, row),
            TerrainType.kWater
          );
        }
        else if (forestMask.Get(col, row) == 1.0)
        {
          this._m_tiles[col + row * this._m_numColumns].Init(
            new Vector2(col, row),
            TerrainType.kForest
          );
        }
        else
        {
          this._m_tiles[col + row * this._m_numColumns].Init(
            new Vector2(col, row),
            TerrainType.kLand
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
}