/** @module utils/utilsTest */

import React from "react";
import { shallow, mount } from "enzyme";
import { Provider } from "react-redux";

/**
 * @function findByTestAttr
 * @description Returns node(s) with given data-test attribute.
 * @param {ShallowWrapper} wrapper - Enzyme shallow wrapper.
 * @param {string} val - Value of data-test attribute.
 * @param {bool} firstOnly - flag to return only first found
 * @returns {ShallowWrapper}
 */
export const findByTestAttr = (wrapper, val, firstOnly = false) => {
  if (firstOnly) return wrapper.find(`[data-test="${val}"]`).first();
  return wrapper.find(`[data-test="${val}"]`);
};

/**
 * @function findByName
 * @description Returns node(s) with given data-test attribute.
 * @param {ShallowWrapper} wrapper - Enzyme shallow wrapper.
 * @param {string} val - Value of name attribute.
 * @param {bool} firstOnly - flag to return only first found
 * @returns {ShallowWrapper}
 */
export const findByName = (wrapper, val, firstOnly = false) => {
  if (firstOnly) return wrapper.find(`[name="${val}"]`).first();
  return wrapper.find(`[name="${val}"]`);
};

/**
 * @function commonSetup
 * @description wraps component in Enzyme mounted wrapper
 * @param {React.Component} Component - component being wrapped
 * @param {Object} props - component props
 * @param {Boolean} useMount - flag to determine if wrapper is mounted (true) or shallow (false)
 * @param {Object} store - mock store
 * @returns {Wrapper}
 */
export const commonSetup = (
  Component,
  props,
  useMount = false,
  store = null
) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  const component = <Component {...props} />;
  return useMount
    ? mount(store ? <Provider store={store}>{component}</Provider> : component)
    : shallow(component);
};
