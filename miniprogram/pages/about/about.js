const { colleges, schoolLinks, dataVersion, dataSourceNote } = require("../../shared/fujian-art-data");

Page({
  data: {
    dataVersion,
    dataSourceNote,
    collegeCount: colleges.length,
    linkCount: Object.keys(schoolLinks).length,
  },
});
