HandleResults = new Mongo.Collection('HandleResults');

NameCheck = new Mongo.Collection("NameCheck");
DocNum = new Mongo.Collection("DocNum");
Feedback = new Mongo.Collection("Feedback");

NameCheck.attachSchema(new SimpleSchema({
  userId: {
    type: String,
    label: '用户ID',
    optional: true
  },
  productType: {
    type: String,
    label: '预先核名',
    optional: true,
    autoValue: function() {
      return 'check';
    }
  },
  docId: {
    type: String,
    label: "当前文档的ID",
    optional: true
  },
  company: {
    type: Object,
    label: "公司基本信息",
    optional: true
  },
  "company.companyZone": {
    type: String,
    label: '注册区域',
    optional: true,
    autoform: {
      type: 'select',
      firstOption: false,
      options: function() {
        return [
          {label: '虹口', value: '虹口'},
          {label: '浦东', value: '浦东'}
        ]
      }
    }
  },
  "company.companyType": {
    type: String,
    label: '公司类型',
    optional: true,
    autoform: {
      type: 'select',
      firstOption: false,
      options: function() {
        return [
          {label: '有限责任公司', value: '有限责任公司'},
          {label: '有限合伙', value: '有限合伙'}
        ]
      }
    }
  },    
  "company.companyName": {
    type: String,
    label: '公司名称（必填）'
  },
  'company.alternativeName': {
    type: Array,
    minCount: 0,
    maxCount: 10,
    label: "备选企业字号",
    optional: true
  },
  "company.alternativeName.$": {
    type: Object,
    optional: true
  },
  "company.alternativeName.$.name": {
    type: String,
    label: "备选字号",
    optional: true
  },
  'company.moneyAmount': {
    type: Number,
    label: '注册资本(单位：万元，必填)' 
  },
  'company.businessScope': {
    type: String,
    label: '经营范围',
    optional: true,
    min: 0,
    max: 1000, 
    autoform: {
      rows: 5
    }
  },
  "addressFlag": {
    type: String,
    label: '公司地址',
    optional: true,   
    autoform: {
      type: 'select',
      firstOption: false,
      options: function() {
        return [
          {label: '开业啦提供地址', value: '开业啦提供地址'},
          {label: '自己提供地址', value: '自己提供地址'}
        ]
      }
    }    
  },
  'companyAddress': {
    type: String,
    label: '地 址',
    optional: true   
  },
  holders: {
    type: Array,
    minCount: 0,
    maxCount: 10,
    label: "股东信息（必填）",
  },
  "holders.$": {
    type: Object,
    label: '添加股东'
  },
  "holders.$.holderName": {
    type: String,
    label: "股东名称或姓名"
  },
  "holders.$.holderID": {
    type: String,
    label: "证照号码",
    min: 18,
    max: 18
  },

  "authorizationFlag": {
    type: String,
    label: '是否需要开业啦代理',
    autoform: {
      type: 'select',
      firstOption: false,
      options: function() {
        return [
          {label: '是', value: '是'},
          {label: '否', value: '否'}
        ]
      }
    }
  },
  'createTime': {
    type: Date,
    label: "创建日期",
    optional: true,
    autoValue: function() {
      return (new Date());
    }
  }
}));

NameCheck.helpers({
  "informationType": function() {
    return "核名信息";
  },
  "createTimeL": function() {
    if(this.createTime) {
      return moment(this.createTime).format("YYYY年MM月DD日HH时mm分")
    } else {
      return moment(new Date()).format("YYYY年MM月DD日HH时mm分")
    }
  }  
})










