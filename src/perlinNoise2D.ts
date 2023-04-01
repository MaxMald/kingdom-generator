export class PerlinNoise2D
{
  private _m_noiseSeed: number[];

  private _m_width: number;

  private _m_height: number;

  public get Width()
  {
    return this._m_width;
  }

  public get Height()
  {
    return this._m_height;
  }

  public Init(width: number, height: number)
  {
    this._m_width = width;
    this._m_height = height;

    let size: number = width * height;
    this._m_noiseSeed = new Array(size);
    for (let i = 0; i < size; ++i)
    {
      this._m_noiseSeed[i] = Math.random();
    }
  }

  public GeneratePerlinNoise(
    width: number,
    height: number,
    numOctaves: number,
    scalingBias: number
  ): number[]
  {
    if (0 >= numOctaves)
    {
      throw new Error("Number of octaves must be a greater than zero.");  
    }

    if (0 >= scalingBias)
    {
      throw new Error("Scaling bias must be greater than zero.")  
    }

    if (0 > width || 0 > height)
    {
      throw new Error("Invalid dimensions.");  
    }

    let result: number[] = new Array(width * height);
    for (let x: number = 0; x < width; ++x)
    {
      for (let y: number = 0; y < height; ++y)
      {
        let noise: number = 0.0;
        let scaleAcc: number = 0.0;
        let scale = 1.0;

        for (let oct: number = 0; oct < numOctaves; ++oct)
        {
          let pitch: number = Math.floor(this._m_width / Math.pow(2, oct));
          
          let pX1: number = Math.floor(x / pitch) * pitch;
          let pY1: number = Math.floor(y / pitch) * pitch;
          let pX2: number = (pX1 + pitch) % width;
          let pY2: number = (pY1 + pitch) % height;

          let blendX: number = (x - pX1) / pitch;
          let blendY: number = (y - pY1) / pitch;

          let a = (1.0 - blendX) * this._m_noiseSeed[pY1 * width + pX1] + blendX * this._m_noiseSeed[pY1 * width + pX2];
          let b = (1.0 - blendX) * this._m_noiseSeed[pY2 * width + pX1] + blendX * this._m_noiseSeed[pY2 * width + pX2];
          
          noise += (blendY * (b - a) + a) * scale;          
          scaleAcc += scale;
          scale /= scalingBias;
        }

        result[width * y + x] = noise / scaleAcc;
      }
    }

    return result;
  }
}