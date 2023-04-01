export class HeightMap 
{
  /**
   * The height matrix values.
   */
  private _m_heightMatrix: number[];

  /**
   * Number of rows of this HeightMap.
   */
  private _m_rows: number;

  /**
   * Number of columns of this HeightMap.
   */
  private _m_columns: number;

  /**
   * Get the number of rows of this HeightMap.
   */
  public get Rows()
  {
    return this._m_rows;
  }

  /**
   * Get the number of columns of this HeightMap.
   */
  public get Columns()
  {
    return this._m_columns;
  }

  /**
   * Instantiates a HeightMap instance.
   */
  public constructor()
  { 
    this._m_columns = 0;
    this._m_rows = 0;
  }

  public static Add(lvalue: HeightMap, rValue: HeightMap): HeightMap
  {
    if (lvalue.Columns != rValue.Columns || lvalue.Rows != rValue.Rows)
    {
      throw new Error("HeightMap instances must have the same dimensions to perform this operation.");  
    }

    let result: HeightMap = new HeightMap();
    
    let numRows: number = lvalue.Rows;
    let numCols: number = lvalue.Columns;
    result.Init(numCols, numRows);

    let size: number = numRows * numCols;
    for (let i: number = 0; i < size; ++i)
    {
      result._m_heightMatrix[i] = lvalue._m_heightMatrix[i] + rValue._m_heightMatrix[i];
    }

    return result;
  }

  public static Substract(lvalue: HeightMap, rValue: HeightMap): HeightMap
  {
    if (lvalue.Columns != rValue.Columns || lvalue.Rows != rValue.Rows)
    {
      throw new Error("HeightMap instances must have the same dimensions to perform this operation.");  
    }

    let result: HeightMap = new HeightMap();
    
    let numRows: number = lvalue.Rows;
    let numCols: number = lvalue.Columns;
    result.Init(numCols, numRows);

    let size: number = numRows * numCols;
    for (let i: number = 0; i < size; ++i)
    {
      result._m_heightMatrix[i] = lvalue._m_heightMatrix[i] - rValue._m_heightMatrix[i];
    }
    
    return result;
  }

  public static SaturateByAddition(
    lvalue: HeightMap,
    rValue: HeightMap,
    min: number,
    max: number
  ): HeightMap
  {
    if (lvalue.Columns != rValue.Columns || lvalue.Rows != rValue.Rows)
    {
      throw new Error("HeightMap instances must have the same dimensions to perform this operation.");  
    }

    let result: HeightMap = new HeightMap();
    
    let numRows: number = lvalue.Rows;
    let numCols: number = lvalue.Columns;
    result.Init(numCols, numRows);

    let size: number = numRows * numCols;
    for (let i: number = 0; i < size; ++i)
    {
      let value: number = lvalue._m_heightMatrix[i] + rValue._m_heightMatrix[i];
      result._m_heightMatrix[i] = Math.min(Math.max(value,min),max);
    }
    
    return result;
  }

  /**
   * Initialize this HeightMap with the given size.
   * 
   * @param columns Number of columns.
   * @param rows Number of rows.
   */
  public Init(columns: number, rows: number): void
  {
    if (columns <= 0)
    {
      throw new Error("Columns cannot be less than zero.");
    }

    if (rows <= 0)
    {
      throw new Error("Rows cannot be less than zero.");
    }

    this._m_columns = columns;
    this._m_rows = rows;
    
    let size: number = columns * rows;
    this._m_heightMatrix = new Array(size);
    for (let i = 0; i < size; ++i)
    {
      this._m_heightMatrix[i] = 0;
    }
  }

  /**
   * Get the value of a cell in this HeightMap.
   * 
   * @param column The column index.
   * @param row The row index.
   * 
   * @returns The value in the given coordinates.
   */
  public Get(column: number, row: number): number
  {
    this.AssertCoordinates(column, row);
    return this._m_heightMatrix[this._m_columns * row + column];
  }

  /**
   * Set the value of a cell in this HeightMap.
   * 
   * @param column The column index.
   * @param row The row index.
   * @param value The new value of the cell.
   */
  public Set(column: number, row: number, value: number): void
  {
    this.AssertCoordinates(column, row);
    this._m_heightMatrix[this._m_columns * row + column] = value; 
  }

  /**
   * Check that the coordinates provided are permitted by the current dimensions
   * of this HeightMap.
   * 
   * @param column The column index.
   * @param row The row index.
   */
  private AssertCoordinates(column: number, row: number): void
  {
    if (column >= this._m_columns || 0 > column)
    {
      throw new Error("Invalid column value.");
    }

    if (row >= this._m_rows || 0 > row)
    {
      throw new Error("Invalid row value.");
    }
  }
}