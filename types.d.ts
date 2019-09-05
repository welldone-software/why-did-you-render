/// <reference types="react" />

declare module NodeJS  {
  interface Global {
    flushConsoleOutput: any
  }
}

declare module '@welldone-software/why-did-you-render' {
  export interface ReasonForUpdate {
    hookDifferences: boolean;
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
    reason: ReasonForUpdate;
    options: WhyDidYouRenderOptions;
  }

  export interface WhyDidYouRenderOptions {
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

  export default function whyDidYouRender(react: typeof React, options?: WhyDidYouRenderOptions): typeof React;
}

declare namespace React {
  interface FunctionComponent<P = {}> {
    whyDidYouRender?: boolean;
  }
}
