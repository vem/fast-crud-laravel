import mockUtil from "/src/mock/base";
const options: any = {
  name: "DebugSelect",
  idGenerator: 0
};
const list = [];
options.list = list;
const mock = mockUtil.buildMock(options);
export default mock;
