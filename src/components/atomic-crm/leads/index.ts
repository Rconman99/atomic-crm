import { LeadList } from "./LeadList";
import { LeadCreate } from "./LeadCreate";
import { LeadEdit } from "./LeadEdit";
import { LeadShow } from "./LeadShow";

export default {
  list: LeadList,
  create: LeadCreate,
  edit: LeadEdit,
  show: LeadShow,
  recordRepresentation: (record: { first_name: string; last_name: string }) =>
    `${record.first_name} ${record.last_name}`,
};
