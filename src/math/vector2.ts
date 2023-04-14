/**
 * A representation of a 2D vector.
 */
export class Vector2
{
  /**
   * The x value.
   */
  public x: number;

  /**
   * The y value.
   */
  public y: number;

  /**
   * Instantiates a new Vector2.
   * 
   * @param x The x value. 
   * @param y The y value.
   */
  public constructor(x? : number, y?: number)
  {
    if (x == undefined && y == undefined)
    {
      this.x = 0;
      this.y = 0;  
    }
    else if (y == undefined)
    {
      this.x = x;
      this.y = x;
    }
    else
    {
      this.x = x;
      this.y = y;
    }
  }

  /**
   * Get a new instance with the values of this Vector2.
   * 
   * @returns New instance with the values of this Vector2. 
   */
  public Copy(): Vector2
  {
    return new Vector2(this.x, this.y);
  }
}