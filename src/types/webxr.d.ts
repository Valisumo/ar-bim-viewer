// WebXR type definitions
declare global {
  interface Navigator {
    xr?: XRSystem;
  }

  interface XRSystem {
    isSessionSupported(mode: XRSessionMode): Promise<boolean>;
    requestSession(mode: XRSessionMode, options?: XRSessionInit): Promise<XRSession>;
  }

  interface XRSession extends EventTarget {
    end(): Promise<void>;
    requestReferenceSpace(type: XRReferenceSpaceType): Promise<XRReferenceSpace>;
    requestAnimationFrame(callback: XRFrameRequestCallback): number;
    cancelAnimationFrame(id: number): void;
    inputSources: XRInputSourceArray;
    renderState: XRRenderState;
    updateRenderState(state?: XRRenderStateInit): void;
    
    onend: ((this: XRSession, ev: XRSessionEvent) => any) | null;
    oninputsourceschange: ((this: XRSession, ev: XRInputSourcesChangeEvent) => any) | null;
    onselect: ((this: XRSession, ev: XRInputSourceEvent) => any) | null;
    onselectstart: ((this: XRSession, ev: XRInputSourceEvent) => any) | null;
    onselectend: ((this: XRSession, ev: XRInputSourceEvent) => any) | null;
    onsqueeze: ((this: XRSession, ev: XRInputSourceEvent) => any) | null;
    onsqueezestart: ((this: XRSession, ev: XRInputSourceEvent) => any) | null;
    onsqueezeend: ((this: XRSession, ev: XRInputSourceEvent) => any) | null;
    onvisibilitychange: ((this: XRSession, ev: XRSessionEvent) => any) | null;
  }

  interface XRFrame {
    session: XRSession;
    getViewerPose(referenceSpace: XRReferenceSpace): XRViewerPose | null;
    getPose(space: XRSpace, baseSpace: XRSpace): XRPose | null;
  }

  interface XRViewerPose extends XRPose {
    views: ReadonlyArray<XRView>;
  }

  interface XRPose {
    transform: XRRigidTransform;
    emulatedPosition: boolean;
  }

  interface XRRigidTransform {
    position: DOMPointReadOnly;
    orientation: DOMPointReadOnly;
    matrix: Float32Array;
    inverse: XRRigidTransform;
  }

  interface XRView {
    eye: XREye;
    projectionMatrix: Float32Array;
    transform: XRRigidTransform;
    recommendedViewportScale?: number;
    requestViewportScale(scale: number): void;
  }

  interface XRReferenceSpace extends XRSpace {
    getOffsetReferenceSpace(originOffset: XRRigidTransform): XRReferenceSpace;
    onreset: ((this: XRReferenceSpace, ev: XRReferenceSpaceEvent) => any) | null;
  }

  interface XRSpace extends EventTarget {}

  interface XRInputSourceArray extends Array<XRInputSource> {
    [Symbol.iterator](): IterableIterator<XRInputSource>;
  }

  interface XRInputSource {
    handedness: XRHandedness;
    targetRayMode: XRTargetRayMode;
    targetRaySpace: XRSpace;
    gripSpace?: XRSpace;
    gamepad?: Gamepad;
    profiles: ReadonlyArray<string>;
    hand?: XRHand;
  }

  interface XRRenderState {
    depthNear: number;
    depthFar: number;
    inlineVerticalFieldOfView?: number;
    baseLayer?: XRWebGLLayer;
  }

  interface XRRenderStateInit {
    depthNear?: number;
    depthFar?: number;
    inlineVerticalFieldOfView?: number;
    baseLayer?: XRWebGLLayer;
  }

  interface XRWebGLLayer extends XRLayer {
    antialias: boolean;
    ignoreDepthValues: boolean;
    framebuffer: WebGLFramebuffer | null;
    framebufferWidth: number;
    framebufferHeight: number;
    getViewport(view: XRView): XRViewport;
    
    constructor(session: XRSession, context: WebGLRenderingContext | WebGL2RenderingContext, layerInit?: XRWebGLLayerInit);
  }

  interface XRLayer extends EventTarget {}

  interface XRViewport {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  interface XRWebGLLayerInit {
    antialias?: boolean;
    depth?: boolean;
    stencil?: boolean;
    alpha?: boolean;
    ignoreDepthValues?: boolean;
    framebufferScaleFactor?: number;
  }

  // Events
  interface XRSessionEvent extends Event {
    session: XRSession;
  }

  interface XRInputSourceEvent extends Event {
    frame: XRFrame;
    inputSource: XRInputSource;
  }

  interface XRInputSourcesChangeEvent extends Event {
    session: XRSession;
    added: ReadonlyArray<XRInputSource>;
    removed: ReadonlyArray<XRInputSource>;
  }

  interface XRReferenceSpaceEvent extends Event {
    referenceSpace: XRReferenceSpace;
    transform?: XRRigidTransform;
  }

  // Enums
  type XRSessionMode = 'inline' | 'immersive-vr' | 'immersive-ar';
  type XRReferenceSpaceType = 'viewer' | 'local' | 'local-floor' | 'bounded-floor' | 'unbounded';
  type XREye = 'left' | 'right' | 'none';
  type XRHandedness = 'left' | 'right' | 'none';
  type XRTargetRayMode = 'gaze' | 'tracked-pointer' | 'screen';

  interface XRSessionInit {
    optionalFeatures?: string[];
    requiredFeatures?: string[];
    domOverlay?: {
      root: Element;
    };
  }

  type XRFrameRequestCallback = (time: DOMHighResTimeStamp, frame: XRFrame) => void;

  interface XRHand extends Map<XRHandJoint, XRJointSpace> {
    [Symbol.iterator](): IterableIterator<[XRHandJoint, XRJointSpace]>;
    entries(): IterableIterator<[XRHandJoint, XRJointSpace]>;
    keys(): IterableIterator<XRHandJoint>;
    values(): IterableIterator<XRJointSpace>;
    get(joint: XRHandJoint): XRJointSpace | undefined;
  }

  interface XRJointSpace extends XRSpace {
    jointName: XRHandJoint;
  }

  type XRHandJoint = 
    | 'wrist'
    | 'thumb-metacarpal' | 'thumb-phalanx-proximal' | 'thumb-phalanx-distal' | 'thumb-tip'
    | 'index-finger-metacarpal' | 'index-finger-phalanx-proximal' | 'index-finger-phalanx-intermediate' | 'index-finger-phalanx-distal' | 'index-finger-tip'
    | 'middle-finger-metacarpal' | 'middle-finger-phalanx-proximal' | 'middle-finger-phalanx-intermediate' | 'middle-finger-phalanx-distal' | 'middle-finger-tip'
    | 'ring-finger-metacarpal' | 'ring-finger-phalanx-proximal' | 'ring-finger-phalanx-intermediate' | 'ring-finger-phalanx-distal' | 'ring-finger-tip'
    | 'pinky-finger-metacarpal' | 'pinky-finger-phalanx-proximal' | 'pinky-finger-phalanx-intermediate' | 'pinky-finger-phalanx-distal' | 'pinky-finger-tip';
}

export {};
