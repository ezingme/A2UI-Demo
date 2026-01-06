import React from 'react';
import { UINode } from '../../types';
import { ComponentRegistry } from './Registry';

interface RendererProps {
  node: UINode | null;
}

export const DynamicRenderer: React.FC<RendererProps> = ({ node }) => {
  if (!node) return null;

  const Component = ComponentRegistry[node.type];

  if (!Component) {
    // Silently fail for unknown types during streaming (e.g., partial strings like "conta")
    // instead of showing a flashing error box.
    return null;
  }

  // If the node has children, recursively render them
  // We pass children as React children to the component
  const children = node.children?.map((child, index) => (
    <DynamicRenderer key={index} node={child} />
  ));

  return (
    <Component node={node}>
      {children}
    </Component>
  );
};