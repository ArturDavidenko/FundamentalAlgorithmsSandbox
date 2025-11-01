export function bfs(start: string, graph: Map<string, string[]>): string[] {
  const visited = new Set<string>();
  const result: string[] = [];
  const queue: string[] = [start];
  
  while (queue.length > 0) {
    const node = queue.shift()!;
    
    if (!visited.has(node)) {
      visited.add(node);
      result.push(node);
      
      const neighbors = graph.get(node) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }
  }
  
  return result;
}