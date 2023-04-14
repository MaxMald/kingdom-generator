import { MapTile } from "./mapTile";

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