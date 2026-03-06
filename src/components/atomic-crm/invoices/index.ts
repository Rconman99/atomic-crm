import { InvoiceList } from "./InvoiceList";
import { InvoiceCreate } from "./InvoiceCreate";
import { InvoiceEdit } from "./InvoiceEdit";
import { InvoiceShow } from "./InvoiceShow";

export default {
  list: InvoiceList,
  create: InvoiceCreate,
  edit: InvoiceEdit,
  show: InvoiceShow,
  recordRepresentation: (record: { invoice_number: string }) =>
    record.invoice_number,
};
