import { IFCLoader } from 'web-ifc-three/IFCLoader';
import * as THREE from 'three';

export interface IFCProperty {
  name: string;
  value: any;
  type?: string;
}

export interface IFCElement {
  expressID: number;
  type: string;
  name?: string;
  properties: IFCProperty[];
  geometry?: THREE.BufferGeometry;
  material?: THREE.Material;
}

export class IFCHelper {
  private loader: IFCLoader;

  constructor() {
    this.loader = new IFCLoader();
    this.loader.ifcManager.setWasmPath('/wasm/');
  }

  async loadIFC(url: string): Promise<THREE.Group> {
    try {
      const model = await this.loader.loadAsync(url);
      return model;
    } catch (error) {
      console.error('Error loading IFC file:', error);
      throw error;
    }
  }

  async getElementProperties(modelID: number, expressID: number): Promise<IFCElement | null> {
    try {
      const properties = await this.loader.ifcManager.getItemProperties(modelID, expressID);
      
      return {
        expressID,
        type: properties.constructor.name,
        name: properties.Name?.value || 'Unknown',
        properties: this.flattenProperties(properties)
      };
    } catch (error) {
      console.error('Error getting element properties:', error);
      return null;
    }
  }

  async getAllElementsOfType(modelID: number, type: number): Promise<number[]> {
    try {
      return await this.loader.ifcManager.getAllItemsOfType(modelID, type, false);
    } catch (error) {
      console.error('Error getting elements of type:', error);
      return [];
    }
  }

  async getElementGeometry(modelID: number, expressID: number): Promise<THREE.BufferGeometry | null> {
    try {
      // Note: Direct geometry access may not be available in current web-ifc-three
      // This is a placeholder implementation
      console.warn('getElementGeometry: Direct geometry access not implemented');
      return null;
    } catch (error) {
      console.error('Error getting element geometry:', error);
      return null;
    }
  }

  private flattenProperties(obj: any, prefix = ''): IFCProperty[] {
    const properties: IFCProperty[] = [];
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const propName = prefix ? `${prefix}.${key}` : key;
        
        if (value && typeof value === 'object' && value.value !== undefined) {
          properties.push({
            name: propName,
            value: value.value,
            type: value.type || typeof value.value
          });
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
          properties.push(...this.flattenProperties(value, propName));
        } else if (value !== null && value !== undefined) {
          properties.push({
            name: propName,
            value: value,
            type: typeof value
          });
        }
      }
    }
    
    return properties;
  }

  dispose(): void {
    this.loader.ifcManager.dispose();
  }
}

export const ifcHelper = new IFCHelper();
