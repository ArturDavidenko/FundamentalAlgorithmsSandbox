export function dfs(start: string, graph: Map<string, string[]>): string[] {
  const visited = new Set<string>();
  const result: string[] = [];
  
  function traverse(node: string) {
    if (visited.has(node)) return;
    
    visited.add(node);
    result.push(node);
    
    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      traverse(neighbor);
    }
  }
  
  traverse(start);
  return result;
}