/** @module setupTests  */

/* eslint-disable import/no-extraneous-dependencies */
import Enzyme from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";
import "react-app-polyfill/ie9";
import "react-app-polyfill/stable";

Enzyme.configure({ adapter: new EnzymeAdapter() });
