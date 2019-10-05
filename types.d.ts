/// <reference types="react" />

declare namespace WhyDidYouRender {

  interface HookDifference {
    pathString: string;
    diffType: string;
    prevValue: any;
    nextValue: any;
  }

  interface ReasonForUpdate {
    hookDifferences: HookDifference[];
    propsDifferences: boolean;
    stateDifferences: boolean;
  }

  interface UpdateInfo {
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

  interface WhyDidYouRenderOptions {
    include?: RegExp[];
    exclude?: RegExp[];
    trackHooks?: boolean;
    logOnDifferentValues?: boolean;
    hotReloadBufferMs?: number;
    onlyLogs?: boolean;
    collapseGroups?: boolean;
    titleColor?: string;
    diffNameColor?: string;
    diffPathColor?: string;
    notifier?: (options: UpdateInfo) => void;
  }

  type WhyDidYouRenderComponentMember = WhyDidYouRenderOptions|boolean
}

declare module '@welldone-software/why-did-you-render' {
  export import ReasonForUpdate = WhyDidYouRender.ReasonForUpdate;
  export import UpdateInfo = WhyDidYouRender.UpdateInfo;
  export import WhyDidYouRenderOptions = WhyDidYouRender.WhyDidYouRenderOptions;
  export import HookDifference = WhyDidYouRender.HookDifference;

  export default function whyDidYouRender(react: typeof React, options?: WhyDidYouRenderOptions): typeof React;
}

declare namespace React {
  interface FunctionComponent<P = {}> {
    whyDidYouRender?: WhyDidYouRender.WhyDidYouRenderComponentMember;
  }
  namespace Component {
    const whyDidYouRender: WhyDidYouRender.WhyDidYouRenderComponentMember;
  }
}
