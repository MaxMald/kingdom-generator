import { Agent } from "../object";

export class SteeringForce
{
  public static ObjectAvoidance(
    agent: Agent,
    maxForce: number,
    objects: Agent[]
  ): Phaser.Math.Vector2
  {
    let force = new Phaser.Math.Vector2(0, 0);
    let numObjects = objects.length;
    for (let i = 0; i < numObjects; ++i)
    {
      let object = objects[i];
      if (object.Id == agent.Id)
      {
        continue;
      }

      let toAgent = new Phaser.Math.Vector2(agent.Position.x - object.Position.x, agent.Position.y - object.Position.y);
      let distanceToAgent = toAgent.length();
      if (distanceToAgent < (agent.Radius + object.Radius))
      {
        let forceScale = 1 - distanceToAgent / (agent.Radius + object.Radius);
        force = force.add(toAgent.setLength(maxForce * forceScale));
      }
    }

    return force;
  }
}