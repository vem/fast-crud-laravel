import * as api from "./api";
import { CreateCrudOptionsProps, CreateCrudOptionsRet, utils } from "@fast-crud/fast-crud";

console.log("utils", utils);

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

  const shortcuts = [
    {
      text: "今天",
      value: [new Date(), new Date()]
    },
    {
      text: "昨天",
      value: () => {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        return [date, date];
      }
    },
    {
      text: "前一周",
      value: () => {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        return [date, new Date()];
      }
    }
  ];

  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
      table: {
        scroll: { x: 1700 }
      },
      rowHandle: { fixed: "right" },
      form: {
        wrapper: {
          width: "70%"
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
        timestamp: {
          title: "时间戳",
          type: "datetime",
          search: {
            show: true,
            width: 185,
            component: {}
          }
        },
        humanize: {
          type: ["datetime", "time-humanize"],
          title: "人性化时间",
          column: {
            component: {
              options: {
                largest: 2
              }
            }
          }
        },
        datetime: {
          title: "日期时间",
          type: "datetime",
          search: {
            show: true,
            col: {
              span: 6
            },
            //查询显示范围选择
            component: {
              type: "datetimerange"
            }
          },
          form: {
            component: {
              //输入输出值格式化
              valueFormat: "YYYY-MM-DD HH:mm:ss"
            }
          }
        },
        format: {
          title: "格式化",
          type: "datetime",
          form: {
            component: {
              //显示格式化
              format: "YYYY年MM月DD日 HH:mm",
              //输入值格式
              valueFormat: "YYYY-MM-DD HH:mm:ss"
            }
          },
          column: {
            width: 180,
            component: {
              // 显示格式化，行展示组件使用的dayjs，
              format: "YYYY年MM月DD日 HH:mm"
            }
          }
        },
        date: {
          title: "仅日期",
          type: "date",
          form: {
            component: {
              //输入输出值格式化
              valueFormat: "YYYY-MM-DD HH:mm:ss",
              on: {
                change(context) {
                  console.log("change", context);
                }
              }
            }
          }
        },
        disabledDate: {
          title: "禁用日期",
          type: "date",
          form: {
            component: {
              disabledDate(time) {
                return time.getTime() < Date.now();
              }
            }
          }
        },
        time: {
          title: "仅时间",
          type: "time"
        },
        month: {
          title: "月份",
          type: "month"
        },
        week: {
          title: "星期",
          type: "week",
          form: {
            component: {
              format: "YYYY-w[周]",
              valueFormat: "YYYY-MM-DD HH:mm:ss" //输入值的格式
            }
          }
        },
        //element 不支持季度选择
        // quarter: {
        //   title: "季度",
        //   type: "quarter",
        //   form: {
        //     component: {
        //       valueFormat: "YYYY-MM-DD HH:mm:ss" //输入值的格式
        //     }
        //   }
        // },
        year: {
          title: "年份",
          type: "year"
        },
        daterange: {
          title: "日期范围",
          type: "daterange",
          search: { show: true, width: 300, col: { span: 8 } },
          valueBuilder({ row, key }) {
            if (!utils.strings.hasEmpty(row.daterangeStart, row.daterangeEnd)) {
              row[key] = [row.daterangeStart, row.daterangeEnd];
            }
          },
          form: {
            component: {
              shortcuts: shortcuts
            }
          }
        },
        datetimerange: {
          title: "日期时间范围",
          type: "datetimerange",
          valueBuilder({ row, key }) {
            if (!utils.strings.hasEmpty(row.datetimerangeStart, row.datetimerangeEnd)) {
              row[key] = [row.datetimerangeStart, row.datetimerangeEnd];
            }
          },
          valueResolve({ form, key }) {
            const row = form;
            if (row[key] != null && !utils.strings.hasEmpty(row[key])) {
              row.datetimerangeStart = row[key][0];
              row.datetimerangeEnd = row[key][1];
            } else {
              row.datetimerangeStart = null;
              row.datetimerangeEnd = null;
            }
          }
        }
      }
    }
  };
}
