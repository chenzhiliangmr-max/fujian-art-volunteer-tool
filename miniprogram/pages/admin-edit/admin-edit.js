const { getCurrentUser, isAdmin } = require("../../shared/auth");
const { upsertCollege } = require("../../shared/data-store");

const EMPTY_FORM = {
  id: "",
  school: "",
  province: "福建",
  level: "公办",
  year: 2025,
  info: "",
  subject: "both",
  min: "",
  max: "",
  status: "待复核",
  tags: "public,plan",
};

Page({
  data: {
    form: EMPTY_FORM,
    subjectOptions: [
      { label: "不限/待分", value: "both" },
      { label: "历史", value: "history" },
      { label: "物理", value: "physics" },
    ],
  },

  onLoad() {
    if (!isAdmin()) {
      wx.showToast({ title: "无管理员权限", icon: "none" });
      wx.navigateBack();
      return;
    }
    const editing = wx.getStorageSync("editingCollege");
    if (!editing) return;
    this.setData({
      form: {
        ...EMPTY_FORM,
        ...editing,
        tags: Array.isArray(editing.tags) ? editing.tags.join(",") : editing.tags,
        min: editing.min == null ? "" : editing.min,
        max: editing.max == null ? "" : editing.max,
      },
    });
  },

  onInput(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({ [`form.${field}`]: event.detail.value });
  },

  setSubject(event) {
    this.setData({ "form.subject": event.currentTarget.dataset.subject });
  },

  save() {
    const form = this.data.form;
    if (!form.school || !form.info) {
      wx.showToast({ title: "请填写院校和专业信息", icon: "none" });
      return;
    }
    upsertCollege(form, getCurrentUser());
    wx.showToast({ title: "已保存" });
    wx.navigateBack();
  },
});
