import * as api from "./api";
import {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  dict,
  DelReq,
  EditReq,
  UserPageQuery,
  UserPageRes,
} from "@fast-crud/fast-crud";

export default function ({ crudExpose }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const pageRequest = async (query: UserPageQuery): Promise<UserPageRes> => {
    return await api.GetList(query);
  };
  const editRequest = async ({ form, row }: EditReq) => {
    if (form.id == null) {
      form.id = row.id;
    }
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }: DelReq) => {
    return await api.DelObj(row.id);
  };
  const addRequest = async ({ form }: AddReq) => {
    return await api.AddObj(form);
  };

  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      columns: {
        input_field: {
          title: "输入框",
          type: "text"
        },
        number_field: {
          title: "数字",
          type: "number"
        },
        select_single_field: {
          title: "单选",
          type: "dict-select",
          dict: dict({
            data: [
              { value: "sz", label: "深圳", color: "success" },
              { value: "gz", label: "广州" },
              { value: "wh", label: "武汉" },
              { value: "sh", label: "上海" },
              { value: "hz", label: "杭州" },
              { value: "bj", label: "北京", color: "danger" }
            ]
          })
        },
        select_multiple_field: {
          title: "多选",
          type: "dict-select",
          form: {
            component: {
              multiple: true
            },
          },
          dict: dict({
            data: [
              { value: "sz", label: "深圳", color: "success" },
              { value: "gz", label: "广州" },
              { value: "wh", label: "武汉" },
              { value: "sh", label: "上海" },
              { value: "hz", label: "杭州" },
              { value: "bj", label: "北京", color: "danger" }
            ]
          }),
          valueBuilder({ row }) {
            //value构建，就是把后台传过来的值转化为前端组件所需要的值
            //在pageRequest之后执行转化，然后将转化后的数据放到table里面显示
            row.select_multiple_field = JSON.parse(row.select_multiple_field)
            //  ↑↑↑↑↑ 注意这里是row，不是form
          },
          valueResolve({ form }) {
            //value解析，就是把组件的值转化为后台所需要的值
            //在form表单点击保存按钮后，提交到后台之前执行转化
            form.select_multiple_field = JSON.stringify(form.select_multiple_field)
            //  ↑↑↑↑↑ 注意这里是form，不是row
          },
        },
      }
    }
  };
}
