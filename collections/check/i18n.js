// language translations
// Global messages
SimpleSchema._globalMessages = {
  required: "[label] 是必填项",
  minString: "[label] 至少需要 [min] 个字符",
  maxString: "[label] 不可超过 [max] 个字符",
  minNumber: "[label] 至少需要 [min]",
  maxNumber: "[label] 不可超过 [max]",
  minDate: "[label] 必须在 [min] 之后",
  maxDate: "[label] 必须在 [max] 之前",
  minCount: "必须小于 [minCount]",
  maxCount: "不可大于 [maxCount]",
  noDecimal: "[label] 必须是整数",
  notAllowed: "[value] 不是一个允许的值",
  expectedString: "[label] 必须是一个字符串",
  expectedNumber: "[label] 必须是一个数字",
  expectedBoolean: "[label] 必须是一个布尔型",
  expectedArray: "[label] 必须是一个数组",
  expectedObject: "[label] 必须是一个对象",
  expectedConstructor: "[label] 必须是一个 [type]",
  regEx: [
    {msg: "[label] 错误正则表达式"},
    {exp: SimpleSchema.RegEx.Email, msg: "[label] 必须是一个合法的 EMAIL 地址"},
    {exp: SimpleSchema.RegEx.WeakEmail, msg: "[label] 必须是一个合法的 EMAIL 地址"},
    {exp: SimpleSchema.RegEx.Domain, msg: "[label] 必须是一个合法域名"},
    {exp: SimpleSchema.RegEx.WeakDomain, msg: "[label] 必须是一个合法域名"},
    {exp: SimpleSchema.RegEx.IP, msg: "[label] 必须是合法的IPV4或IPV6地址"},
    {exp: SimpleSchema.RegEx.IPv4, msg: "[label] 必须是合法的IPV4地址"},
    {exp: SimpleSchema.RegEx.IPv6, msg: "[label] m必须是合法的IPV6地址"},
    {exp: SimpleSchema.RegEx.Url, msg: "[label] 必须是一个合法的URL"},
    {exp: SimpleSchema.RegEx.Id, msg: "[label] 必须是一个合法的ID"}
  ],
  keyNotInSchema: "[label] 不被schema接受"
};    
