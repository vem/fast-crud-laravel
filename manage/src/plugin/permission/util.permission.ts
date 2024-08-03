import { usePermissionStore } from "./store.permission";
import { NoPermissionError } from "./errors";
import { ElMessage } from "element-plus";
const util = {
  hasPermissions: (value: string | string[]): boolean => {
    let need: string[] = [];
    if (typeof value === "string") {
      need.push(value);
    } else if (value && value instanceof Array && value.length > 0) {
      need = need.concat(value);
    }
    if (need.length === 0) {
      throw new Error('need permissions! Like "sys:user:view" ');
    }
    const permissionStore = usePermissionStore();
    const userPermissionList = permissionStore.getPermissions;
    return userPermissionList.some((permission) => {
      return need.includes(permission);
    });
  },
  requirePermissions: (value) => {
    if (!util.hasPermissions(value)) {
      ElMessage.error("对不起，您没有权限执行此操作");
      throw new NoPermissionError();
    }
  }
};

export default util;
