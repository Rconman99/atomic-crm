import * as React from "react";
import { LeadShow } from "./LeadShow";

const LeadList = React.lazy(() => import("./LeadList"));

export default {
  list: LeadList,
  show: LeadShow,
};
