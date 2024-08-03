import * as api from "./api";
import { CreateCrudOptionsProps, CreateCrudOptionsRet, dict } from "@fast-crud/fast-crud";
import moment from "moment";

export default function ({ expose }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const pageRequest = async (query) => {
    return await api.GetList(query);
  };
  const editRequest = async ({ form, row }) => {
    if (form.id == null) {
      form.id = row.id;
    }
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }) => {
    return await api.DelObj(row.id);
  };

  const addRequest = async ({ form }) => {
    return await api.AddObj(form);
  };
  const radioDict = dict({
    url: "/mock/dicts/OpenStatusEnum?single"
  });
  return {
    radioDict,
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
      rowHandle: {
        width: 550,
        buttons: {
          edit: { dropdown: true },
          remove: { dropdown: true }
        }
      },
      columns: {
        id: {
          title: "ID",
          key: "id",
          type: "number",
          column: {
            width: 50
          },
          form: {
            show: false
          }
        },
        like: {
          title: "like",
          type: "number",
          search: { show: false }
        },
        createDate: {
          title: "时间",
          type: "datetime",
          column: {
            align: "left",
            width: 300
          },
          valueBuilder({ key, row }) {
            row[key] = moment(row[key]);
          }
        },
        updateDate: {
          title: "修改时间",
          type: "datetime",
          column: {
            show: false
          },
          valueBuilder({ key, row }) {
            row[key] = moment(row[key]);
          }
        }
      }
    }
  };
}
