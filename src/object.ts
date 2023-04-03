export class Agent
{
  private static ID = 0;
  private _m_id: number;
  private _m_radius: number;
  private _m_position: Phaser.Math.Vector2;

  public get Radius()
  {
    return this._m_radius;
  }

  public get Position()
  {
    return this._m_position;
  }

  public get Id()
  {
    return this._m_id;
  }

  public constructor()
  {
    this._m_id = ++Agent.ID;
  }

  public Init(position: Phaser.Math.Vector2, radius: number)
  {
    this._m_position = position;
    this._m_radius = radius;
  }

  public SetRadius(radius: number)
  {
    this._m_radius = radius;
  }

  public SetPosition(position: Phaser.Math.Vector2)
  {
    this._m_position = position;
  }
}