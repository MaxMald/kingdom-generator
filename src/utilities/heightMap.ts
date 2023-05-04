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
    let size: number = numRows * numCols;
    result.Init(numCols, numRows, new Array(size));
    
    for (let i: number = 0; i < size; ++i)
    {
      result._m_heightMatrix[i] = Math.min(1.0, lvalue._m_heightMatrix[i] + rValue._m_heightMatrix[i]);
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
    let size: number = numRows * numCols;
    result.Init(numCols, numRows, new Array(size));
    
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
    let size: number = numRows * numCols;
    result.Init(numCols, numRows, new Array(size));
    
    for (let i: number = 0; i < size; ++i)
    {
      let value: number = lvalue._m_heightMatrix[i] + rValue._m_heightMatrix[i];
      result._m_heightMatrix[i] = Math.min(Math.max(value,min),max);
    }
    
    return result;
  }

  public static ApplyMinimumMask(target: HeightMap, minimumMask: HeightMap)
  {
    if (target.Columns != minimumMask.Columns || target.Rows != minimumMask.Rows)
    {
      throw new Error("HeightMap instances must have the same dimensions to perform this operation.");  
    }

    let size: number = target.Rows * target.Columns;
    for (let i: number = 0; i < size; ++i)
    {
      target._m_heightMatrix[i] = Math.max(target._m_heightMatrix[i], minimumMask._m_heightMatrix[i]);
    }
  }

  public static Mask(target: HeightMap, mask: HeightMap, invert: boolean = false) : HeightMap
  {
    if (target.Columns != mask.Columns || target.Rows != mask.Rows)
    {
      throw new Error("HeightMap instances must have the same dimensions to perform this operation.");  
    }

    let result: HeightMap = new HeightMap();    
    let numRows: number = target.Rows;
    let numCols: number = target.Columns;
    let size: number = target.Rows * target.Columns;
    result.Init(numCols, numRows, new Array(size));

    if (invert)
    {
      for (let i: number = 0; i < size; ++i)
      {
        result._m_heightMatrix[i] = target._m_heightMatrix[i] * ( 1.0 - mask._m_heightMatrix[i]);
      }
    }
    else
    {
      for (let i: number = 0; i < size; ++i)
      {
        result._m_heightMatrix[i] = target._m_heightMatrix[i] * mask._m_heightMatrix[i];
      }
    }
    return result;
  }

  public static Cut(target: HeightMap, mask: HeightMap, threshold: number, greater: boolean) : HeightMap
  {
    if (target.Columns != mask.Columns || target.Rows != mask.Rows)
    {
      throw new Error("HeightMap instances must have the same dimensions to perform this operation.");  
    }

    let result: HeightMap = new HeightMap();    
    let numRows: number = target.Rows;
    let numCols: number = target.Columns;
    let size: number = target.Rows * target.Columns;
    result.Init(numCols, numRows, new Array(size));
    for (let i: number = 0; i < size; ++i)
    {
      if (greater)
      {
        if (mask._m_heightMatrix[i] > threshold)
        {
          result._m_heightMatrix[i] = target._m_heightMatrix[i];   
        }
        else
        {
          result._m_heightMatrix[i] = 0.0;
        }
      }
      else
      {
        if (mask._m_heightMatrix[i] < threshold)
        {
          result._m_heightMatrix[i] = target._m_heightMatrix[i];   
        }
        else
        {
          result._m_heightMatrix[i] = 0.0;
        }
      }      
    }

    return result;
  }

  /**
   * Initialize this HeightMap with the given size.
   * 
   * @param columns Number of columns.
   * @param rows Number of rows.
   * @param values Array of values.
   */
  public Init(columns: number, rows: number, values: number[]): void
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
    this._m_heightMatrix = values;
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
   * Member-wise addition.
   *  
   * @param rValue Right value.
   *  
   * @returns This HeightMap.
   */
  public Add(rValue: HeightMap) : HeightMap
  {
    if (this.Columns != rValue.Columns || this.Rows != rValue.Rows)
    {
      throw new Error("HeightMap instances must have the same dimensions to perform this operation.");  
    }

    let size: number = this.Columns * this.Rows;
    
    for (let i: number = 0; i < size; ++i)
    {
      this._m_heightMatrix[i] = Math.max(
        0.0,
        Math.min(
          1.0,
          this._m_heightMatrix[i] + rValue._m_heightMatrix[i]
        )
      );
    }

    return this;
  }

  /**
   * Reduce to 0, the components of this matrix whose position in the comparison
   * matrix has a value less or equal than the threshold value.
   *
   * @param comparisonMap The matrix where the value will be evaluated against
   * the threshold.
   * @param threshold The threshold. Any number under the threshold will be
   * reduced to zero.
   * 
   * @returns This HeightMap.
   */
  public Cut(comparisonMap: HeightMap, threshold: number): HeightMap
  {
    if (this.Columns != comparisonMap.Columns || this.Rows != comparisonMap.Rows)
    {
      throw new Error("HeightMap instances must have the same dimensions to perform this operation.");  
    }

    let size: number = this.Rows * this.Columns;
    for (let i: number = 0; i < size; ++i)
    {
      if (comparisonMap._m_heightMatrix[i] <= threshold)
      {
        comparisonMap._m_heightMatrix[i] = 0.0;   
      }
    }
    return this;
  }

  /**
   * Round the values to 1.0 or 0.0 according to the given threshold. If the
   * value is greater than the threshold, it will become a 1.0, otherwise it
   * will be reduced to 0.0.
   *
   * @param threshold Threshold value.
   * 
   * @returns This HeightMap.
   */
  public RoundValues(threshold: number) : HeightMap
  {
    let size = this._m_columns * this._m_rows;
    for (let i = 0; i < size; ++i)
    {
      this._m_heightMatrix[i] = (this._m_heightMatrix[i] > threshold ? 1.0 : 0.0);  
    }
    return this;
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