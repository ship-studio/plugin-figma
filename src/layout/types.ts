// Stub file -- types will be implemented in GREEN phase
export interface LayoutNode {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  width?: number;
  height?: number;
  widthMode?: string;
  heightMode?: string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  preserveRatio?: boolean;
  constraints?: any;
  autoLayout?: AutoLayoutProps;
  positioning?: string;
  textContent?: string;
  componentRef?: ComponentRef;
  repeatCount?: number;
  children?: LayoutNode[];
}

export interface AutoLayoutProps {
  flexDirection: 'row' | 'column';
  justifyContent: string;
  alignItems: string;
  gap: number;
  padding: { top: number; right: number; bottom: number; left: number };
  flexWrap: 'wrap' | 'nowrap';
  rowGap?: number;
}

export interface ComponentRef {
  componentId: string;
  componentName: string;
  description?: string;
  isRemote: boolean;
  source: 'local' | 'library';
  variantProperties?: Record<string, string | boolean>;
  overrides?: any[];
}

export interface ExtractionResult {
  rootNodes: LayoutNode[];
  nodeCount: number;
  truncated: boolean;
}
