import * as React from 'react';

export type UpdateDiffType =
  | 'different'
  | 'deepEquals'
  | 'date'
  | 'regex'
  | 'reactElement'
  | 'function'
  | 'same';

export interface ObjectDifference {
  pathString: string;
  diffType: UpdateDiffType;
  prevValue: any;
  nextValue: any;
}

export interface HookDifference {
  pathString: string;
  diffType: UpdateDiffType;
  prevValue: any;
  nextValue: any;
}

export interface OwnerHookDifference {
  hookName: string;
  differences: ObjectDifference[] | false;
}

export interface OwnerDifferences {
  propsDifferences: ObjectDifference[] | false;
  stateDifferences: ObjectDifference[] | false;
  hookDifferences: OwnerHookDifference;
}

export interface ReasonForUpdate {
  hookDifferences: ObjectDifference[] | false;
  propsDifferences: ObjectDifference[] | false;
  stateDifferences: ObjectDifference[] | false;
  ownerDifferences: OwnerDifferences | false;
}

export interface UpdateInfo {
  Component: React.Component;
  displayName: string;
  prevProps: any;
  prevState: any;
  nextProps: any;
  nextState: any;
  prevHook: any;
  nextHook: any;
  reason: ReasonForUpdate;
  options: WhyDidYouRenderOptions;
  hookName?: string;
}

export type ExtraHookToTrack = [any, string];

export interface WhyDidYouRenderOptions {
  include?: RegExp[];
  exclude?: RegExp[];
  trackAllPureComponents?: boolean;
  trackHooks?: boolean;
  logOwnerReasons?: boolean;
  trackExtraHooks?: Array<ExtraHookToTrack>;
  logOnDifferentValues?: boolean;
  hotReloadBufferMs?: number;
  onlyLogs?: boolean;
  collapseGroups?: boolean;
  titleColor?: string;
  diffNameColor?: string;
  diffPathColor?: string;
  notifier?: Notifier;
  customName?: string;
}

export type WhyDidYouRenderComponentMember = WhyDidYouRenderOptions | boolean;

export type Notifier = (options: UpdateInfo) => void;

export interface OwnerData {
  Component: React.ComponentType;
  displayName: string;
  props: object;
  state: object | null;
  hooks: unknown[];
  additionalOwnerData?: unknown;
}

export interface WdyrStore {
  React: typeof import('react');
  componentsMap: WeakMap<React.ComponentType, unknown>;
  hooksPerRender: unknown[];
  options: WhyDidYouRenderOptions;
  origCloneElement: typeof React.cloneElement;
  origCreateElement: typeof React.createElement;
  origCreateFactory: typeof React.createFactory;
  ownerDataMap: WeakMap<object, OwnerData>;
}

declare function whyDidYouRender(
  react: typeof React,
  options?: WhyDidYouRenderOptions
): typeof React;

declare namespace whyDidYouRender {
  export const defaultNotifier: Notifier;
  export const wdyrStore: WdyrStore;
  export const storeOwnerData: unknown;
  export const getWDYRType: unknown;
}

export default whyDidYouRender;

declare module 'react' {
  interface FunctionComponent<P = {}> {
    whyDidYouRender?: WhyDidYouRenderComponentMember;
  }

  interface VoidFunctionComponent<P = {}> {
    whyDidYouRender?: WhyDidYouRenderComponentMember;
  }

  interface ExoticComponent<P = {}> {
    whyDidYouRender?: WhyDidYouRenderComponentMember;
  }

  namespace Component {
    const whyDidYouRender: WhyDidYouRenderComponentMember;
  }

  /* not supported.
  see https://github.com/microsoft/TypeScript/issues/33892
  and https://github.com/microsoft/TypeScript/issues/34516
  and https://github.com/microsoft/TypeScript/issues/32185

  // interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> {
  //   static whyDidYouRender?: WhyDidYouRenderComponentMember;
  // }
  */
}
