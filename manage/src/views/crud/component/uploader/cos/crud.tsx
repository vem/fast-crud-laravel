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
        file: {
          title: "腾讯云",
          type: "file-uploader",
          form: {
            component: {
              uploader: {
                type: "cos"
              }
            }
          }
        },
        pictureCard: {
          title: "照片墙",
          type: "image-uploader",
          form: {
            component: {
              uploader: {
                type: "cos"
              }
            }
          }
        },
        cropper: {
          title: "裁剪",
          type: "cropper-uploader",
          form: {
            component: {
              uploader: {
                type: "cos"
              }
            }
          }
        }
      }
    }
  };
}
