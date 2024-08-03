import * as api from "./api";
import { requestForMock } from "/src/api/service";
import {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
  EditReq,
  useCompute,
  UserPageQuery,
  UserPageRes
} from "@fast-crud/fast-crud";
import { ElMessage } from "element-plus";
import { computed, ref } from "vue";

const { asyncCompute, compute } = useCompute();
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

  //普通的ref引用，可以动态切换配置
  const showRef = ref(false);
  const showTableRef = ref(true);
  const showTableComputed = computed(() => {
    return showTableRef.value;
  });

  const columnComponentShowRef = ref(true);
  const columnComponentShowComputed = computed(() => {
    return columnComponentShowRef.value;
  });

  return {
    output: {
      showRef,
      showTableRef,
      columnComponentShowRef
    },
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
      table: {
        scroll: {
          x: 1500
        },
        //通过switch动态显隐table
        show: showTableComputed //不仅支持computed，直接传showTableRef也是可以的
      },
      form: {
        labelCol: { span: 8 },
        wrapperCol: { span: 14 }
      },
      rowHandle: {
        fixed: "right",
        align: "center",
        buttons: {
          edit: {
            show: compute(({ row }) => {
              return row.editable;
            })
          },
          remove: {
            show: compute(({ row }) => {
              return row.editable;
            })
          }
        }
      },
      columns: {
        id: {
          title: "ID",
          key: "id",
          type: "number",
          column: {
            width: 50,
            align: "center"
          },
          form: {
            show: false
          }
        },
        refSwitch: {
          title: "ref引用切换",
          type: "text",
          form: {
            // index.vue slot显示
            helper: "点我切换右边的输入框显示"
          }
        },
        ref: {
          title: "根据ref引用显示",
          type: ["text"],
          form: {
            component: {
              show: showRef
            },
            helper: "我会根据showRef进行显隐"
          }
        },
        compute: {
          title: "compute",
          search: { show: false },
          type: "text",
          column: {
            show: columnComponentShowComputed,
            columnSetDisabled: true, //这里采用自定义控制显隐，那么列设置里面就要禁用
            //columnSetShow: false, //直接不在列设置里面显示也行
            component: {
              name: "el-switch"
            }
          },
          form: {
            component: {
              name: "el-switch"
            },
            helper: "点我触发动态计算"
          }
        },
        shower: {
          title: "根据compute显示",
          search: { show: false },
          type: "button",
          form: {
            component: {
              // 这里组件是否显示是通过计算获得的
              show: compute(({ form }) => {
                return form.compute;
              })
            }
          },
          column: {
            width: 250,
            component: {
              // 这里组件是否显示是通过计算获得的
              show: compute(({ row }) => {
                return row.compute;
              })
            }
          }
        },
        remote: {
          title: "asyncCompute",
          search: { show: true },
          type: "text",
          form: {
            component: {
              name: "fs-dict-select",
              placeholder: "异步计算远程获取options",
              // 这里el-select组件的options是通过计算获得的
              options: asyncCompute({
                async asyncFn(watchValue, context) {
                  const url = "/mock/dicts/OpenStatusEnum?remote";
                  return await requestForMock({ url });
                }
              })
            },
            helper: "我的options是异步计算远程获取的,只会获取一次"
          }
        },
        remote2: {
          title: "监听switch触发异步计算",
          search: { show: false },
          type: "text",
          form: {
            component: {
              name: "fs-dict-select",
              placeholder: "异步计算远程获取options",
              // 这里el-select组件的options是通过计算获得的
              options: asyncCompute({
                watch({ form }) {
                  return form.compute;
                },
                async asyncFn(watchValue) {
                  ElMessage.info("监听switch,触发远程获取options");
                  const url = watchValue
                    ? "/mock/dicts/OpenStatusEnum?remote"
                    : "/mock/dicts/moreOpenStatusEnum?remote";
                  return await requestForMock({ url });
                }
              })
            },
            helper: "监听其他属性修改后，触发重新计算"
          },
          column: {
            width: 200
          }
        },
        editable: {
          title: "可编辑",
          search: { show: false },
          type: "text",
          column: {
            fixed: "right",
            component: {
              name: "el-switch"
            }
          },
          form: {
            show: false
          }
        }
      }
    }
  };
}
