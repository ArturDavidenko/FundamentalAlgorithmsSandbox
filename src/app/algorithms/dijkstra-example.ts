export function dijkstra(
  start: string, 
  end: string, 
  graph: Map<string, {node: string, weight: number, time: number}[]>,
  useTime: boolean = false
): string[] {
  const distances = new Map<string, number>();
  const previous = new Map<string, string>();
  const unvisited = new Set<string>();
  
  graph.forEach((_, node) => {
    distances.set(node, Infinity);
    unvisited.add(node);
  });
  distances.set(start, 0);
  
  while (unvisited.size > 0) {
    let current = Array.from(unvisited).reduce((min, node) => 
      distances.get(node)! < distances.get(min)! ? node : min
    );
    
    if (current === end) break;
    unvisited.delete(current);
    
    const neighbors = graph.get(current) || [];
    for (const neighbor of neighbors) {
      const cost = distances.get(current)! + (useTime ? neighbor.time : neighbor.weight);
      if (cost < distances.get(neighbor.node)!) {
        distances.set(neighbor.node, cost);
        previous.set(neighbor.node, current);
      }
    }
  }
  
  const path: string[] = [];
  let current: string | undefined = end;
  while (current) {
    path.unshift(current);
    current = previous.get(current);
  }
  
  return path[0] === start ? path : [];
}