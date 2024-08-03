import * as api from "./api";
import { CreateCrudOptionsProps, CreateCrudOptionsRet, dict } from "@fast-crud/fast-crud";

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
  const statusDict = dict({
    data: [
      { value: "1", label: "开启", color: "success" },
      { value: "2", label: "停止", color: null },
      { value: "0", label: "关闭", color: null }
    ]
  });

  const remoteDict = dict({
    url: "/mock/dicts/OpenStatusEnum",
    immediate: false
  });
  // remoteDict.loadDict();

  return {
    remoteDict,
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
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
        status: {
          title: "本地字典",
          search: { show: false },
          dict: statusDict,
          type: "dict-select"
        },
        remote: {
          title: "远程字典",
          search: { show: true },
          dict: remoteDict,
          type: "dict-select"
        },
        modifyDict: {
          title: "动态修改字典",
          search: { show: false },
          type: "text",
          form: {
            component: {
              name: "el-switch"
            },
            valueChange({ form }) {
              console.log("changed", form.modifyDict);
              remoteDict.url = form.modifyDict
                ? "/mock/dicts/moreOpenStatusEnum?remote"
                : "/mock/dicts/OpenStatusEnum?remote";
              // 由于remoteDict.cloneable =false,所以全局公用一个实例，修改会影响全部地方
              remoteDict.reloadDict();
            }
          },
          column: {
            component: {
              name: "el-switch",
              on: {
                // 注意：必须要on前缀
                onChange({ $event }) {
                  remoteDict.url = $event
                    ? "/mock/dicts/moreOpenStatusEnum?remote"
                    : "/mock/dicts/OpenStatusEnum?remote";
                  remoteDict.reloadDict();
                }
              }
            }
          }
        }
      }
    }
  };
}
