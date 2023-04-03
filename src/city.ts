import { Agent } from "./object";

export class City extends Agent
{
  private _m_innerRadius: number;

  public get InnerRadius()
  {
    return this._m_innerRadius;
  }

  public SetInnerRadius(innerRadius: number)
  {
    this._m_innerRadius = innerRadius;
  }
}