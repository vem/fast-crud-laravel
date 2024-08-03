import * as api from "./api";
import { requestForMock } from "/src/api/service";
import { CreateCrudOptionsProps, CreateCrudOptionsRet, dict, useUi, utils } from "@fast-crud/fast-crud";
import { ref } from "vue";
import _ from "lodash-es";

function useSearchRemote() {
  let lastFetchId = 0;

  const state = {
    data: ref([]),
    loading: ref(false)
  };

  const fetchUser = _.debounce(async (value?) => {
    console.log("fetching user", value);
    lastFetchId += 1;
    const fetchId = lastFetchId;
    state.data.value = [];
    state.loading.value = true;
    const res = await fetch("https://randomuser.me/api/?results=5");
    const body = await res.json();
    if (fetchId !== lastFetchId) {
      // for fetch callback order
      return;
    }
    const data = body.results.map((user) => ({
      label: `${user.name.first} ${user.name.last}`,
      value: user.login.username
    }));
    state.data.value = data;
    state.loading.value = false;
  }, 800);

  return {
    fetchUser,
    searchState: state
  };
}

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

  const { fetchUser, searchState } = useSearchRemote();

  const cityDicts = dict({
    value: "id",
    label: "text",
    data: [
      { id: "sz", text: "深圳", color: "success" },
      { id: "gz", text: "广州", color: null },
      { id: "bj", text: "北京" },
      { id: "wh", text: "武汉" },
      { id: "sh", text: "上海" }
    ]
  });
  const { ui } = useUi();
  return {
    crudOptions: {
      actionbar: {
        buttons: {
          test: {
            text: "动态增加选项",
            click() {
              cityDicts.data.push({ id: "hz", text: "杭州" });
            }
          }
        }
      },
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
      form: {
        // 单列布局
        col: { span: 24 },
        // 表单label宽度
        labelWidth: "150px"
      },
      rowHandle: {
        fixed: "right",
        align: "center"
      },
      table: {
        scroll: {
          //启用横向滚动条，设置一个大于所有列宽之和的值，一般大于表格宽度
          x: 1400
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
        statusLocal: {
          title: "单选本地",
          type: "dict-select",
          dict: cityDicts,
          form: {
            component: {
              onChange(args) {
                utils.logger.info("onChange", args);
              },
              on: {
                selectedChange({ form, $event }) {
                  // $event就是原始的事件值，也就是选中的 option对象
                  utils.logger.info("onSelectedChange", form, $event);
                  ui.message.info(`你选择了${JSON.stringify($event)}`);
                  // 你还可以将选中的label值赋值给表单里其他字段
                  // context.form.xxxLabel = context.$event.label
                }
              }
            },
            helper: "selected-change事件可以获取选中的option对象"
          }
        },
        statusRemote: {
          title: "单选远程",
          search: {
            show: true,
            rules: null
          },
          type: "dict-select",
          dict: dict({
            url: "/mock/dicts/OpenStatusEnum?simple"
          }),
          form: {
            rules: [{ required: true, message: "请选择一个选项" }]
          }
        },
        filter: {
          title: "本地过滤",
          type: "dict-select",
          dict: dict({
            url: "/mock/dicts/OpenStatusEnum?simple"
          }),
          form: {
            component: {
              showSearch: true,
              //默认的filterOption仅支持value的过滤，label并不会加入查询
              //所以需要自定义filterOption
              filterOption(inputValue, option) {
                return option.label.indexOf(inputValue) >= 0 || option.value.indexOf(inputValue) >= 0;
              }
            }
          }
        },
        search: {
          title: "远程搜索",
          type: "dict-select",
          search: { show: true, component: { style: { width: "240px" } } },
          form: {
            component: {
              name: "fs-dict-select",
              multiple: true,
              filterable: true,
              remote: true,
              "reserve-keyword": true,
              placeholder: "输入远程搜索",
              options: searchState.data,
              remoteMethod: (query) => {
                if (query !== "") {
                  fetchUser();
                } else {
                  searchState.data.value = [];
                }
              },
              loading: searchState.loading
            }
          }
        },
        customDictGetData: {
          title: "自定义字典请求",
          type: "dict-select",
          dict: dict({
            getData({ dict }) {
              // 覆盖全局获取字典请求配置
              console.log(`我是从自定义的getData方法中加载的数据字典`, dict);
              return requestForMock({
                url: "/mock/dicts/OpenStatusEnum?cache",
                method: "get"
              });
            }
          }),
          search: { show: false },
          form: {
            value: "2", //默认值, 注意search也会影响到，需要将search.value=null，取消search的默认值
            helper: "dict.getData可以覆盖全局配置的getRemoteDictFunc"
          },
          column: {
            width: 120,
            component: {
              type: "text" // 不使用tag，纯文本展示
            }
          }
        },
        disabledOptions: {
          title: "禁用某个选项",
          type: "dict-select",
          dict: dict({
            url: "/mock/dicts/OpenStatusEnum?disabledOptions"
          }),
          form: {
            component: {
              dict: {
                // 此处dict配置会覆盖上面dict的属性
                prototype: true, // form表单的dict设置为原型复制，每次初始化时都会重新loadDict
                onReady({ dict }) {
                  console.log("字典请求ready", dict);
                  dict.data[0].disabled = true; // 禁用某个选项， 还可以自己修改选项
                }
              }
            },
            helper: "禁用字典选项"
          },
          column: {
            width: 150
          }
        },
        firstDefault: {
          title: "默认值",
          type: "dict-select",
          dict: dict({
            url: "/mock/dicts/OpenStatusEnum?disabledOptions"
          }),
          form: {
            component: {
              //监听 dict-change事件
              onDictChange({ dict, form, key }) {
                console.log("dict data changed", dict, key);
                if (dict.data != null && form.firstDefault == null) {
                  form.firstDefault = dict.data[0].value;
                }
              }
              // 下面的方法也可以，注意要配置dict.prototype:true
              // dict: {
              //   // 此处dict配置会覆盖上面dict的属性
              //   // form表单的dict设置为原型复制，每次初始化时都会重新loadDict
              //   prototype: true,
              //
              //   onReady({ dict, form }) {
              //     console.log("字典请求ready", dict, form, getComponentRef);
              //     //  prototype= true 才能获取到form表单数据
              //     form.firstDefault = dict.data[0].value;
              //   }
              // }
            },
            helper: "默认选择第一个选项"
          }
        },
        multiple: {
          title: "多选自动染色",
          type: "dict-select",
          form: {
            title: "多选本地",
            value: [],
            component: {
              multiple: true
            },
            rules: [{ required: true, message: "请选择一个选项" }]
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
          column: {
            width: 290,
            component: {
              color: "auto", // 自动染色
              defaultLabel: "未知城市" //无数据字典时的默认文本
            }
          }
        },
        tags: {
          title: "可输入",
          type: "dict-select",
          form: {
            component: {
              multiple: true,
              allowCreate: true,
              filterable: true
            }
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
          })
        },
        statusSimple: {
          title: "普通选择",
          form: {
            helper: "直接使用el-select组件",
            component: {
              name: "el-select",
              slots: {
                default() {
                  return <el-option value={"1"} label={"test"} />;
                }
              }
            }
          }
        }
      }
    }
  };
}
