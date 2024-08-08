import * as api from "./api";
import { CreateCrudOptionsProps, CreateCrudOptionsRet, dict } from "@fast-crud/fast-crud";

export default function ({ expose }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const pageRequest = async (query) => {
    return await api.GetList(query);
  };
  const editRequest = async ({ form, row }) => {
    form.id = row.id;
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
      rowHandle: {
        fixed: "right"
      },
      table: {
        scroll: {
          //使用固定列时需要设置此值，并且大于等于列宽度之和的值
          x: 1400
        }
      },
      columns: {
        id: {
          title: "id",
          form: { show: false }, // 表单配置
          column: {
            width: 70,
            sorter: true
          }
        },
        created_at: {
          title: "创建时间",
          type: "datetime",
          form: { show: false }, // 表单配置
          column: {
            width: 180,
            sorter: true
          }
        },
        // updateTime: {
        //   title: "修改时间",
        //   type: "datetime",
        //   form: { show: false }, // 表单配置
        //   column: {
        //     sortable: "update_time",
        //     width: 180
        //   }
        // },
        username: {
          title: "用户名",
          type: "text",
          search: { show: true }, // 开启查询
          form: {
            rules: [
              { required: true, message: "请输入用户名" },
              { max: 50, message: "最大50个字符" }
            ]
          },
          editForm: { component: { disabled: true } },
          column: {
            sorter: true
          }
        },
        password: {
          title: "密码",
          type: "text",
          key: "password",
          column: {
            show: false
          },
          form: {
            rules: [{ max: 50, message: "最大50个字符" }],
            component: {
              showPassword: true
            },
            helper: "填写则修改密码"
          }
        },
        nickName: {
          title: "昵称",
          type: "text",
          search: { show: true }, // 开启查询
          form: {
            rules: [{ max: 50, message: "最大50个字符" }]
          },
          column: {
            sorter: true
          }
        },
        avatar: {
          title: "头像",
          type: "cropper-uploader",
          column: {
            width: 100,
            component: {
              //设置高度，修复操作列错位的问题
              style: {
                height: "30px",
                width: "auto"
              }
            }
          }
        },
        remark: {
          title: "备注",
          type: "text",
          column: {
            sorter: true
          },
          form: {
            rules: [{ max: 100, message: "最大100个字符" }]
          }
        },
        roles: {
          title: "角色",
          type: "dict-select",
          dict: dict({
            url: "/sys/authority/role/list",
            value: "id",
            label: "name"
          }), // 数据字典
          form: {
            component: { multiple: true },
            valueResolve({ form }) {
              if (form.roles == null) return
              form.roles = JSON.stringify(form.roles)
            },
          },
          column: {
            width: 250,
            sortable: true
          },
          valueBuilder({ value, row, key }) {
            // value构建，就是把后台传过来的值转化为前端组件所需要的值
            // 在pageRequest之后执行转化，然后将转化后的数据放到table里面显示
            if (row[key]) {
              try {
                row[key] = JSON.parse(row[key])
              } catch (e) { }
            }
          },
        }
      }
    }
  };
}
