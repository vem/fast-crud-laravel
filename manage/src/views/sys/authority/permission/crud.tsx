import * as api from "./api";
import { CreateCrudOptionsProps, CreateCrudOptionsRet, dict } from "@fast-crud/fast-crud";

export default function ({ expose }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const pageRequest = async (query) => {
    const list = await api.GetTree();

    return {
      offset: 0,
      records: list,
      total: 10000,
      limit: 10000
    };
  };

  async function afterChange() {
    await permissionTreeDict.reloadDict();
  }
  const editRequest = async ({ form, row }) => {
    form.id = row.id;
    const ret = await api.UpdateObj(form);
    await afterChange();
    return ret;
  };
  const delRequest = async ({ row }) => {
    const ret = await api.DelObj(row.id);
    await afterChange();
    return ret;
  };

  const addRequest = async ({ form }) => {
    const ret = await api.AddObj(form);
    await afterChange();
    return ret;
  };
  const permissionTreeDict = dict({
    url: "/sys/authority/permission/tree",
    isTree: true,
    value: "id",
    label: "title",
    async onReady({ dict }) {
      dict.setData([{ id: -1, title: "根节点", children: dict.data }]);
    }
  });
  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
      actionbar: {
        show: false
      },
      toolbar: {
        show: false
      },
      table: {
        show: false
        // scroll: { fixed: true }
      },
      rowHandle: {
        fixed: "right"
      },
      search: {
        show: false
      },
      pagination: {
        show: false,
        pageSize: 100000
      },
      columns: {
        id: {
          title: "id",
          type: "number",
          form: { show: false }, // 表单配置
          column: {
            width: 120,
            sortable: "custom"
          }
        },
        title: {
          title: "权限名称",
          type: "text",
          form: {
            rules: [
              { required: true, message: "请输入权限名称" },
              { max: 50, message: "最大50个字符" }
            ],
            component: {
              placeholder: "权限名称"
            }
          },
          column: {
            width: 200
          }
        },

        permission: {
          title: "权限代码",
          type: "text",
          column: {
            width: 170
          },
          form: {
            rules: [
              { required: true, message: "请输入权限代码" },
              { max: 100, message: "最大100个字符" }
            ],
            component: {
              placeholder: "例如:sys:user:view"
            }
          }
        },
        sort: {
          title: "排序",
          type: "number",
          column: {
            width: 100
          },
          form: {
            value: 100,
            rules: [{ required: true, type: "number", message: "排序号必填" }]
          }
        },
        parentId: {
          title: "父节点",
          type: "dict-tree",
          column: {
            width: 100
          },
          dict: permissionTreeDict,
          form: {
            value: -1,
            component: {
              multiple: false,
              defaultExpandAll: true,
              dict: { cache: false },
              props: {
                props: {
                  value: "id",
                  label: "title"
                }
              }
            }
          }
        }
      }
    }
  };
}
