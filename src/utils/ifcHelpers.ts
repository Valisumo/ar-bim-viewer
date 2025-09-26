import * as THREE from 'three';
import * as OBC from '@thatopen/components';

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
  private components: OBC.Components;
  private ifcLoader: OBC.IfcLoader;
  private fragmentsManager: OBC.FragmentsManager;
  constructor() {
    this.components = new OBC.Components();
    this.ifcLoader = this.components.get(OBC.IfcLoader);
    this.fragmentsManager = this.components.get(OBC.FragmentsManager);

    this.setupIFCLoader();
  }

  private async setupIFCLoader() {
    try {
      // Configure WASM path for IFC loading
      this.ifcLoader.settings.wasm = {
        path: "https://unpkg.com/web-ifc@0.0.69/",
        absolute: true,
      };

      // Initialize fragments manager with worker
      const githubUrl = "https://thatopen.github.io/engine_fragment/resources/worker.mjs";
      const fetchedUrl = await fetch(githubUrl);
      const workerBlob = await fetchedUrl.blob();
      const workerFile = new File([workerBlob], "worker.mjs", { type: "text/javascript" });
      const workerUrl = URL.createObjectURL(workerFile);

      this.fragmentsManager.init(workerUrl);
    } catch (error) {
      console.error('Error setting up IFC loader:', error);
    }
  }

  async loadIFC(url: string): Promise<THREE.Group> {
    try {
      // Fetch the IFC file
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Load IFC using That Open components
      const model = await this.ifcLoader.load(uint8Array, false, "model");

      // Create a THREE.Group to hold the loaded model
      const group = new THREE.Group();
      group.add(model as any); // Type assertion needed as FragmentsModel may not directly extend Object3D

      return group;
    } catch (error) {
      console.error('Error loading IFC file:', error);
      throw error;
    }
  }

  async getElementProperties(modelID: string, expressID: number): Promise<IFCElement | null> {
    try {
      // Note: Properties access in @thatopen/components requires different approach
      // This is a placeholder - properties are typically accessed through fragments
      console.warn('getElementProperties: Properties access not fully implemented for @thatopen/components yet');
      return {
        expressID,
        type: 'Unknown',
        name: 'Unknown',
        properties: []
      };
    } catch (error) {
      console.error('Error getting element properties:', error);
      return null;
    }
  }

  async getAllElementsOfType(modelID: string, type: number): Promise<number[]> {
    try {
      // Note: Element type queries in @thatopen/components work differently
      // This is a placeholder implementation
      console.warn('getAllElementsOfType: Element type queries not fully implemented for @thatopen/components yet');
      return [];
    } catch (error) {
      console.error('Error getting elements of type:', error);
      return [];
    }
  }

  async getElementGeometry(modelID: string, expressID: number): Promise<THREE.BufferGeometry | null> {
    try {
      // Note: Direct geometry access in @thatopen/components is through fragments
      // This is a simplified approach - geometry is handled by the fragments system
      console.warn('getElementGeometry: Direct geometry access not available in @thatopen/components');
      return null;
    } catch (error) {
      console.error('Error getting element geometry:', error);
      return null;
    }
  }

  dispose(): void {
    // Clean up components
    this.components.dispose();
  }
}

export const ifcHelper = new IFCHelper();
