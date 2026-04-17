import moment from "moment";

export default {
  default: (date: Date | string | number) =>
    moment(date).format("YYYY-MM-DD HH:mm:ss"),
  log: () => moment().format("YYYY-MM-DD HH:mm:ss"),
};
