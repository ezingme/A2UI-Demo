// The component types our A2UI engine supports
export enum ComponentType {
  CONTAINER = 'container',
  TEXT = 'text',
  BUTTON = 'button',
  CARD = 'card',
  METRIC = 'metric',
  CHART = 'chart',
  ALERT = 'alert',
  IMAGE = 'image',
  DIVIDER = 'divider'
}

// Universal props structure
export interface ComponentProps {
  label?: string;
  title?: string;
  content?: string;
  onClick?: string; // Action ID
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'bar' | 'line' | 'pie';
  data?: any[]; // For charts
  src?: string; // For images
  className?: string; // Tailwind classes override
  direction?: 'row' | 'column'; // For containers
  gap?: number;
}

// The recursive node structure
export interface UINode {
  id?: string;
  type: ComponentType;
  props?: ComponentProps;
  children?: UINode[];
}

// Message structure for the chat
export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string; // Text content
  uiData?: UINode; // The parsed UI tree if applicable
  isStreaming?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}