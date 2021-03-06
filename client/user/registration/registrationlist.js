var optionsObject = {
  columns: [
    {
      title: '填写文档编号',
      data: 'docId'
    },
    {
      title: '公司名称',
      data: 'company.companyName'
    },
    {
      title: '信息类型',
      data: 'informationType'
    },
    {
      title: '注册区域',
      data: 'company.companyZone'
    },
    {
      title: '填写时间',
      data: 'createTimeL'
    },
    {
      title: '操作',
      className: 'text-center',
      render: function(cellData, renderType, currentRow) {
        var html = '<a href="/user/registration/' + currentRow.docId +   '" class="viewCompany"><input type="button" value="查看" class="btn btn-primary"></a>'
         + '<button type="button" data-docid="' + currentRow.docId + '"class="btn btn-danger companyitem">删除</button>'
        return html; 
      }

    }
  ]
}

var dataTableData = function (userId) {
    var userId = Session.get('userId');
    return Company.find({userId: userId}).fetch(); // or .map()
};

Template.companyList.helpers({
    reactiveDataFunction: function () {
      var userId = Session.get('userId');
        return dataTableData;
    },
    optionsObject: optionsObject // see below
});

Template.companyList.events({
  "click .companyitem": function(event) {
    var userId = Meteor.userId();
    var docId = $(event.currentTarget).attr("data-docid");
    if(userId && docId) {
      var options = {
        userId: userId,
        docId: docId
      };
      Meteor.call("deleteCompany", options);
    }
  }
})



