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
          type: "text",
          search: { show: true },
        },
        number_field: {
          title: "数字",
          type: "number",
          search: { show: true },
          column: { sortable: "custom" },
        },
        select_single_field: {
          title: "单选",
          type: "dict-select",
          search: { show: true },
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
          search: { show: true },
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
        cascading_field: {
          title: "级联",
          type: "dict-cascader",
          search: { show: true },
          dict: dict({
            isTree: true,
            url: "/mock/dicts/cascaderData?single"
          }),
          valueBuilder({ row }) {
            //value构建，就是把后台传过来的值转化为前端组件所需要的值
            //在pageRequest之后执行转化，然后将转化后的数据放到table里面显示
            row.cascading_field = JSON.parse(row.cascading_field)
            //  ↑↑↑↑↑ 注意这里是row，不是form
          },
          valueResolve({ form }) {
            //value解析，就是把组件的值转化为后台所需要的值
            //在form表单点击保存按钮后，提交到后台之前执行转化
            form.cascading_field = JSON.stringify(form.cascading_field)
            //  ↑↑↑↑↑ 注意这里是form，不是row
          },
        },
        tree_field: {
          title: "树",
          search: { show: false },
          type: "dict-tree",
          dict: dict({
            isTree: true,
            url: "/mock/dicts/cascaderData?single"
          }),
          form: {
            component: {
              multiple: true,
              "show-checkbox": true
            }
          },
          valueBuilder({ row }) {
            //value构建，就是把后台传过来的值转化为前端组件所需要的值
            //在pageRequest之后执行转化，然后将转化后的数据放到table里面显示
            row.tree_field = JSON.parse(row.tree_field)
            //  ↑↑↑↑↑ 注意这里是row，不是form
          },
          valueResolve({ form }) {
            //value解析，就是把组件的值转化为后台所需要的值
            //在form表单点击保存按钮后，提交到后台之前执行转化
            form.tree_field = JSON.stringify(form.tree_field)
            //  ↑↑↑↑↑ 注意这里是form，不是row
          },
        },
        image_field: {
          title: "图片",
          type: "image-uploader",
          form: {
            component: {
              limit: 1,
              uploader: {
                type: "form",
                action: "sys/crud/baseForm/upload",
              }
            },
            helper: "最大可上传1个文件"
          },
          valueBuilder({ row }) {
            //value构建，就是把后台传过来的值转化为前端组件所需要的值
            //在pageRequest之后执行转化，然后将转化后的数据放到table里面显示
            row.image_field = '/api/storage/' + row.image_field
            //  ↑↑↑↑↑ 注意这里是row，不是form
          },
          valueResolve({ form }) {
            //value解析，就是把组件的值转化为后台所需要的值
            //在form表单点击保存按钮后，提交到后台之前执行转化
            form.image_field = form.image_field.replace('/api/storage/', '')
            //  ↑↑↑↑↑ 注意这里是form，不是row
          },
        },
      }
    }
  };
}
