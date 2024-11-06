import { Vector2 } from "./math/vector2";
import { TerrainType } from "./terrainType";

/**
 * Represents a single tile in the Map.
 */
export class MapTile
{
  /**
   * The TerrainType of this MapTile.
   */
  private _m_terrainType: TerrainType;

  /**
   * The coordinates of this MapTile.
   */
  private _m_coordinates: Vector2;

  /**
   * The Image of the tile.
   */
  private _m_image: Phaser.GameObjects.Image;

  /**
   * Gets the TerrainType of this MapTile.
   * 
   * @returns TerrainType.
   */
  public get TerrainType()
  {
    return this._m_terrainType;
  }

  /**
   * Gets the position of the image of this MapTile.
   * 
   * @returns The position of the image of this MapTile.
   */
  public get Position()
  {
    return new Vector2(
      this._m_image.x,
      this._m_image.y
    );
  }

  /**
   * Get the coordinates of this MapTile.
   *
   * @returns A copy of the Vector2 member that represents the coordinates of
   * this MapTile.
   */
  public get Coordinates()
  {
    return this._m_coordinates.Copy();
  }

  /**
   * Initialize this MapTile.
   * 
   * @param coordinates The coordinates of this MapTile.
   * @param terrainType The TerrainType of this MapTile.
   * @param image The Imange that represents this MapTile.
   */
  public Init(
    coordinates: Vector2,
    terrainType: TerrainType,
    image: Phaser.GameObjects.Image
  )
  {
    this._m_coordinates = coordinates;
    this._m_terrainType = terrainType;
    this._m_image = image;
  }
}