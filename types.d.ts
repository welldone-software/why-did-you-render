import * as React from 'react';

export interface HookDifference {
  pathString: string;
  diffType: string;
  prevValue: any;
  nextValue: any;
}

export interface ReasonForUpdate {
  hookDifferences: HookDifference[];
  propsDifferences: boolean;
  stateDifferences: boolean;
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

export type WhyDidYouRenderComponentMember = WhyDidYouRenderOptions|boolean

export type Notifier = (options: UpdateInfo) => void

declare function whyDidYouRender(react: typeof React, options?: WhyDidYouRenderOptions): typeof React;

declare namespace whyDidYouRender {
  export const defaultNotifier: Notifier;
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
