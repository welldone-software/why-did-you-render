'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _isString = _interopDefault(require('lodash/isString'));
var _reduce = _interopDefault(require('lodash/reduce'));
var _has = _interopDefault(require('lodash/has'));
var _keys = _interopDefault(require('lodash/keys'));
var _isFunction = _interopDefault(require('lodash/isFunction'));
var _isRegExp = _interopDefault(require('lodash/isRegExp'));
var _isDate = _interopDefault(require('lodash/isDate'));
var _isPlainObject = _interopDefault(require('lodash/isPlainObject'));
var _isArray = _interopDefault(require('lodash/isArray'));

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var diffTypes = {
  'different': 'different',
  'deepEquals': 'deepEquals',
  'date': 'date',
  'regex': 'regex',
  'reactElement': 'reactElement',
  'function': 'function'
};

var _diffTypesDescription;
var moreInfoUrl = 'https://goo.gl/hnfMPb';
var diffTypesDescriptions = (_diffTypesDescription = {}, _defineProperty(_diffTypesDescription, diffTypes.different, 'different objects.'), _defineProperty(_diffTypesDescription, diffTypes.deepEquals, 'different objects that are equal by value.'), _defineProperty(_diffTypesDescription, diffTypes.date, 'different date objects with the same value.'), _defineProperty(_diffTypesDescription, diffTypes.regex, 'different regular expressions with the same value.'), _defineProperty(_diffTypesDescription, diffTypes.reactElement, 'different React elements with the same displayName.'), _defineProperty(_diffTypesDescription, diffTypes.function, 'different functions with the same name.'), _diffTypesDescription);

function shouldLog(reason, Component, options) {
  if (options.logOnDifferentValues) {
    return true;
  }

  if (Component.whyDidYouRender && Component.whyDidYouRender.logOnDifferentValues) {
    return true;
  }

  var hasDifferentValues = reason.propsDifferences && reason.propsDifferences.some(function (diff) {
    return diff.diffType === diffTypes.different;
  }) || reason.stateDifferences && reason.stateDifferences.some(function (diff) {
    return diff.diffType === diffTypes.different;
  });
  return !hasDifferentValues;
}

function logDifference(Component, displayName, prefixMessage, propsOrSate, differences, values, options) {
  if (differences && differences.length > 0) {
    options.consoleLog(_defineProperty({}, displayName, Component), "".concat(prefixMessage, " of ").concat(propsOrSate, " changes:"));
    differences.forEach(function (_ref) {
      var pathString = _ref.pathString,
          diffType = _ref.diffType,
          prevValue = _ref.prevValue,
          nextValue = _ref.nextValue;
      options.consoleGroup("%c".concat(propsOrSate, ".%c").concat(pathString, "%c"), 'color:blue;', 'color:red;', 'color:black;');
      options.consoleLog("".concat(diffTypesDescriptions[diffType], " (more info at ").concat(moreInfoUrl, ")"));
      options.consoleLog("prev '".concat(pathString, "':"), prevValue, ' !== ', nextValue, ":next '".concat(pathString, "'"));
      options.consoleGroupEnd();
    });
  } else if (differences) {
    options.consoleLog(_defineProperty({}, displayName, Component), "".concat(prefixMessage, " the ").concat(propsOrSate, " object itself changed but it's values are all equal."), propsOrSate === 'props' ? 'This could of been avoided by making the component pure, or by preventing it\'s father from re-rendering.' : 'This usually means this component called setState when no changes in it\'s state actually occurred.', "more info at ".concat(moreInfoUrl));
    options.consoleLog("prev ".concat(propsOrSate, ":"), values.prev, ' !== ', values.next, ":next ".concat(propsOrSate));
  }
}

function defaultNotifier(updateInfo) {
  var Component = updateInfo.Component,
      displayName = updateInfo.displayName,
      prevProps = updateInfo.prevProps,
      prevState = updateInfo.prevState,
      nextProps = updateInfo.nextProps,
      nextState = updateInfo.nextState,
      reason = updateInfo.reason,
      options = updateInfo.options;

  if (!shouldLog(reason, Component, options)) {
    return;
  }

  options.consoleGroup("%c".concat(displayName), 'color: #058;');
  var prefixMessage = 'Re-rendered because';

  if (reason.propsDifferences) {
    logDifference(Component, displayName, prefixMessage, 'props', reason.propsDifferences, {
      prev: prevProps,
      next: nextProps
    }, options);
    prefixMessage = 'And because';
  }

  if (reason.stateDifferences) {
    logDifference(Component, displayName, prefixMessage, 'state', reason.stateDifferences, {
      prev: prevState,
      next: nextState
    }, options);
  }

  if (!reason.propsDifferences && !reason.stateDifferences) {
    options.consoleLog(_defineProperty({}, displayName, Component), 'Re-rendered although props and state objects are the same.', 'This usually means there was a call to this.forceUpdate() inside the component.', "more info at ".concat(moreInfoUrl));
  }

  options.consoleGroupEnd();
}

var emptyFn = function emptyFn() {};

function normalizeOptions() {
  var userOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var consoleGroup = console.group;
  var consoleGroupEnd = console.groupEnd;

  if (userOptions.collapseGroups) {
    consoleGroup = console.groupCollapsed;
  } else if (userOptions.onlyLogs) {
    consoleGroup = console.log;
    consoleGroupEnd = emptyFn;
  }

  return _objectSpread({
    include: null,
    exclude: null,
    notifier: defaultNotifier,
    onlyLogs: false,
    consoleLog: console.log,
    consoleGroup: consoleGroup,
    consoleGroupEnd: consoleGroupEnd,
    logOnDifferentValues: false
  }, userOptions);
}

function getDisplayName(type) {
  return _isString(type) ? type : type.displayName || type.name;
}

var hasElementType = typeof Element !== 'undefined'; // copied from https://github.com/facebook/react/packages/shared/ReactSymbols.js

var hasSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE$1 = hasSymbol ? Symbol.for('react.element') : 0xeac7;

var isReactElement = function isReactElement(object) {
  return object.$$typeof === REACT_ELEMENT_TYPE$1;
}; // end


function trackDiff(a, b, diffsAccumulator, pathString, diffType) {
  diffsAccumulator.push({
    diffType: diffType,
    pathString: pathString,
    prevValue: a,
    nextValue: b
  });
  return diffType !== diffTypes.different;
}

function accumulateDeepEqualDiffs(a, b, diffsAccumulator) {
  var pathString = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

  if (a === b) {
    return true;
  }

  if (!a || !b) {
    return trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different);
  }

  if (_isArray(a) && _isArray(b)) {
    var length = a.length;

    if (length !== b.length) {
      return trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different);
    }

    var allChildrenDeepEqual = true;

    for (var i = length; i-- !== 0;) {
      if (!accumulateDeepEqualDiffs(a[i], b[i], diffsAccumulator, "".concat(pathString, "[").concat(i, "]"))) {
        allChildrenDeepEqual = false;
      }
    }

    return allChildrenDeepEqual ? trackDiff(a, b, diffsAccumulator, pathString, diffTypes.deepEquals) : trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different);
  }

  if (_isDate(a) && _isDate(b)) {
    return a.getTime() === b.getTime() ? trackDiff(a, b, diffsAccumulator, pathString, diffTypes.date) : trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different);
  }

  if (_isRegExp(a) && _isRegExp(b)) {
    return a.toString() === b.toString() ? trackDiff(a, b, diffsAccumulator, pathString, diffTypes.regex) : trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different);
  }

  if (hasElementType && a instanceof Element && b instanceof Element) {
    return trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different);
  }

  if (isReactElement(a) && isReactElement(b)) {
    return a.type === b.type ? trackDiff(a, b, diffsAccumulator, pathString, diffTypes.reactElement) : trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different);
  }

  if (_isFunction(a) && _isFunction(b)) {
    return a.name === b.name ? trackDiff(a, b, diffsAccumulator, pathString, diffTypes.function) : trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different);
  }

  if (_isPlainObject(a) && _isPlainObject(b)) {
    var keys = _keys(a);

    var _length = keys.length;

    if (_length !== _keys(b).length) {
      return trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different);
    }

    for (var _i = _length; _i-- !== 0;) {
      if (!_has(b, keys[_i])) {
        return trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different);
      }
    }

    var _allChildrenDeepEqual = true;

    for (var _i2 = _length; _i2-- !== 0;) {
      var key = keys[_i2];

      if (!accumulateDeepEqualDiffs(a[key], b[key], diffsAccumulator, "".concat(pathString, ".").concat(key))) {
        _allChildrenDeepEqual = false;
      }
    }

    return _allChildrenDeepEqual ? trackDiff(a, b, diffsAccumulator, pathString, diffTypes.deepEquals) : trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different);
  }

  return trackDiff(a, b, diffsAccumulator, pathString, diffTypes.different);
}

function calculateDeepEqualDiffs(a, b, initialPathString) {
  try {
    var diffs = [];
    accumulateDeepEqualDiffs(a, b, diffs, initialPathString);
    return diffs;
  } catch (error) {
    if (error.message && error.message.match(/stack|recursion/i) || error.number === -2146828260) {
      // warn on circular references, don't crash.
      // browsers throw different errors name and messages:
      // chrome/safari: "RangeError", "Maximum call stack size exceeded"
      // firefox: "InternalError", too much recursion"
      // edge: "Error", "Out of stack space"
      // eslint-disable-next-line no-console
      console.warn('Warning: why-did-you-render couldn\'t handle circular references in props.', error.name, error.message);
      return false;
    }

    throw error;
  }
}

var emptyObject = {};
function findObjectsDifferences(userPrevObj, userNextObj) {
  if (userPrevObj === userNextObj) {
    return false;
  }

  var prevObj = userPrevObj || emptyObject;
  var nextObj = userNextObj || emptyObject;

  var keysOfBothObjects = _keys(_objectSpread({}, prevObj, nextObj));

  return _reduce(keysOfBothObjects, function (result, key) {
    var deepEqualDiffs = calculateDeepEqualDiffs(prevObj[key], nextObj[key], key);

    if (deepEqualDiffs) {
      result = _toConsumableArray(result || []).concat(_toConsumableArray(deepEqualDiffs));
    }

    return result;
  }, []);
}

function getUpdateReason(prevProps, prevState, nextProps, nextState) {
  return {
    propsDifferences: findObjectsDifferences(prevProps, nextProps, 'props'),
    stateDifferences: findObjectsDifferences(prevState, nextState, 'state')
  };
}

function getUpdateInfo(_ref) {
  var Component = _ref.Component,
      prevProps = _ref.prevProps,
      prevState = _ref.prevState,
      nextProps = _ref.nextProps,
      nextState = _ref.nextState,
      options = _ref.options;
  var displayName = getDisplayName(Component);
  return {
    Component: Component,
    displayName: displayName,
    prevProps: prevProps,
    prevState: prevState,
    nextProps: nextProps,
    nextState: nextState,
    options: options,
    reason: getUpdateReason(prevProps, prevState, nextProps, nextState)
  };
}

function shouldInclude(displayName, options) {
  return options.include && options.include.length > 0 && options.include.some(function (regex) {
    return regex.test(displayName);
  });
}

function shouldExclude(displayName, options) {
  return options.exclude && options.exclude.length > 0 && options.exclude.some(function (regex) {
    return regex.test(displayName);
  });
}

function shouldTrack(Component, displayName, options) {
  if (shouldExclude(displayName, options)) {
    return false;
  }

  return !!(Component.whyDidYouRender || shouldInclude(displayName, options));
}

var patchClassComponent = function patchClassComponent(Component, options) {
  var PatchedComponent =
  /*#__PURE__*/
  function (_Component) {
    _inherits(PatchedComponent, _Component);

    function PatchedComponent() {
      _classCallCheck(this, PatchedComponent);

      return _possibleConstructorReturn(this, _getPrototypeOf(PatchedComponent).apply(this, arguments));
    }

    _createClass(PatchedComponent, [{
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps, prevState, snapshot) {
        options.notifier(getUpdateInfo({
          Component: Component,
          prevProps: prevProps,
          prevState: prevState,
          nextProps: this.props,
          nextState: this.state,
          options: options
        }));

        if (typeof Component.prototype.componentDidUpdate === 'function') {
          Component.prototype.componentDidUpdate.call(this, prevProps, prevState, snapshot);
        }
      }
    }]);

    return PatchedComponent;
  }(Component);

  PatchedComponent.displayName = getDisplayName(Component);
  return PatchedComponent;
};

var patchFunctionalComponent = function patchFunctionalComponent(Fn, React, options) {
  var PatchedComponent =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(PatchedComponent, _React$Component);

    function PatchedComponent() {
      _classCallCheck(this, PatchedComponent);

      return _possibleConstructorReturn(this, _getPrototypeOf(PatchedComponent).apply(this, arguments));
    }

    _createClass(PatchedComponent, [{
      key: "render",
      value: function render() {
        return Fn(this.props);
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        options.notifier(getUpdateInfo({
          Component: Fn,
          prevProps: prevProps,
          nextProps: this.props,
          options: options
        }));
      }
    }]);

    return PatchedComponent;
  }(React.Component);

  PatchedComponent.displayName = getDisplayName(Fn);
  return PatchedComponent;
};

function createPatchedComponent(componentsMapping, Component, React, options) {
  if (Component.prototype && typeof Component.prototype.render === 'function') {
    return patchClassComponent(Component, options);
  }

  return patchFunctionalComponent(Component, React, options);
}

function getPatchedComponent(componentsMapping, Component, React, options) {
  if (componentsMapping.has(Component)) {
    return componentsMapping.get(Component);
  }

  var PatchedComponent = createPatchedComponent(componentsMapping, Component, React, options);
  componentsMapping.set(Component, PatchedComponent);
  return PatchedComponent;
}

function whyDidYouRender(React, userOptions) {
  var options = normalizeOptions(userOptions);
  var origCreateElement = React.createElement;
  var componentsMapping = new Map();

  React.createElement = function (componentNameOrComponent) {
    var isShouldTrack = typeof componentNameOrComponent === 'function' && shouldTrack(componentNameOrComponent, getDisplayName(componentNameOrComponent), options);

    for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    if (!isShouldTrack) {
      return origCreateElement.apply(React, [componentNameOrComponent].concat(rest));
    }

    var PatchedComponent = getPatchedComponent(componentsMapping, componentNameOrComponent, React, options);
    return origCreateElement.apply(React, [PatchedComponent].concat(rest));
  };

  React.__REVERT_WHY_DID_YOU_RENDER__ = function () {
    React.createElement = origCreateElement;
    delete React.__REVERT_WHY_DID_YOU_RENDER__;
    componentsMapping.clear();
  };

  return React;
}

module.exports = whyDidYouRender;
