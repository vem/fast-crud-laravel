import * as api from "./api";
import { CreateCrudOptionsProps, CreateCrudOptionsRet } from "@fast-crud/fast-crud";

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

  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
      form: {
        display: "flex"
      },
      columns: {
        name: {
          title: "姓名",
          type: "text",
          search: { show: true }
        },
        order: {
          title: "字段排序",
          type: "text",
          form: {
            order: 0
          }
        },
        intro: {
          title: "跨列",
          search: { show: true },
          type: ["textarea", "colspan"],
          form: {
            // flex模式控制跨列,需要手动配置如下，通过colspan可以简化
            // col: { span: 24 },
          }
        }
      }
    }
  };
}
