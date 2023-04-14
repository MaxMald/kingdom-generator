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
   * Gets the TerrainType of this MapTile.
   * 
   * @returns TerrainType.
   */
  public get TerrainType()
  {
    return this._m_terrainType;
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
   */
  public Init(coordinates: Vector2, terrainType: TerrainType)
  {
    this._m_coordinates = coordinates;
    this._m_terrainType = terrainType;
  }
}