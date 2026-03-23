export interface PolicyVariable {
  name: string;
  type: 'number' | 'boolean' | 'string' | 'date' | 'enum';
  enumValues?: string[];
  unit?: string;
  description: string;
  sourceRef: string;
  required: boolean;
}
