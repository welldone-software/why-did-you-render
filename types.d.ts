/// <reference types="react" />

declare namespace WhyDidYouRender {
  interface ReasonForUpdate {
    hookDifferences: boolean;
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
    reason: ReasonForUpdate;
    options: WhyDidYouRenderOptions;
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
}

declare module '@welldone-software/why-did-you-render' {
  export import ReasonForUpdate = WhyDidYouRender.ReasonForUpdate;
  export import UpdateInfo = WhyDidYouRender.UpdateInfo;
  export import WhyDidYouRenderOptions = WhyDidYouRender.WhyDidYouRenderOptions;

  export default function whyDidYouRender(react: typeof React, options?: WhyDidYouRenderOptions): typeof React;
}

declare namespace React {
  interface FunctionComponent<P = {}> {
    whyDidYouRender?: boolean|WhyDidYouRender.WhyDidYouRenderOptions;
  }
  namespace Component {
    export const whyDidYouRender: boolean|WhyDidYouRender.WhyDidYouRenderOptions;
  }
}
