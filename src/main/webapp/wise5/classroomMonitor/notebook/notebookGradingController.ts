'use strict';

import ConfigService from '../../services/configService';
import NotebookService from '../../services/notebookService';
import TeacherDataService from '../../services/teacherDataService';

class NotebookGradingController {
  canViewStudentNames: boolean;
  colspan: number;
  isExpandAll: boolean = false;
  notebookConfig: any;
  notesEnabled: boolean = false;
  reportEnabled: boolean = false;
  reportTitle: string = '';
  showAllNotes: boolean = false;
  showAllReports: boolean = false;
  teacherWorkgroupId: number;
  workgroups: any[];
  workgroupInViewById: any = {};
  workVisibilityById: any = {};

  static $inject = ['ConfigService', 'NotebookService', 'TeacherDataService'];

  constructor(
    private ConfigService: ConfigService,
    private NotebookService: NotebookService,
    private TeacherDataService: TeacherDataService
  ) {
    this.teacherWorkgroupId = this.ConfigService.getWorkgroupId();
    this.workgroups = this.ConfigService.getClassmateUserInfos();
    this.notebookConfig = this.NotebookService.getStudentNotebookConfig();
    this.notesEnabled = this.notebookConfig.itemTypes.note.enabled;
    this.reportEnabled = this.notebookConfig.itemTypes.report.enabled;
    this.reportTitle = this.notebookConfig.itemTypes.report.notes[0].title;
    this.colspan = this.getColspan();
    for (let i = 0; i < this.workgroups.length; i++) {
      let workgroup = this.workgroups[i];
      workgroup.notes = this.NotebookService.getPrivateNotebookItems(workgroup.workgroupId);
      const reportId = this.notebookConfig.itemTypes.report.notes[0].reportId;
      workgroup.report = this.NotebookService.getLatestNotebookReportItemByReportId(reportId, workgroup.workgroupId);
    }
    this.setWorkgroupsById();

    // save event when notebook grading view is displayed
    const context = 'ClassroomMonitor',
      nodeId = null,
      componentId = null,
      componentType = null,
      category = 'Navigation',
      event = 'notebookViewDisplayed',
      data = {};
    this.TeacherDataService.saveEvent(
      context,
      nodeId,
      componentId,
      componentType,
      category,
      event,
      data
    );
  }

  getColspan() {
    let colspan = 4;
    if (this.notesEnabled) {
      if (this.reportEnabled) {
        colspan = 5;
      } else {
        colspan = 3;
      }
    }
    return colspan;
  }

  setWorkgroupsById() {
    for (const workgroup of this.workgroups) {
      this.workVisibilityById[workgroup.workgroupId] = false;
      this.workgroupInViewById[workgroup.workgroupId] = false;
      // this.updateWorkgroup(id, true);
    }
  }

  expandAll() {
    for (const workgroup of this.workgroups) {
      const workgroupId = workgroup.workgroupId;
      if (this.workgroupInViewById[workgroupId]) {
        this.workVisibilityById[workgroupId] = true;
      }
    }
    this.isExpandAll = true;
  }

  collapseAll() {
    for (const workgroup of this.workgroups) {
      this.workVisibilityById[workgroup.workgroupId] = false;
    }
    this.isExpandAll = false;
  }

  onUpdateExpand(workgroupId, isExpanded) {
    this.workVisibilityById[workgroupId] = isExpanded;
  }

  viewNotes(workgroupId) {
    alert(workgroupId);
  }

  viewReport(workgroupId) {
    alert(workgroupId);
  }

  getCurrentPeriod() {
    return this.TeacherDataService.getCurrentPeriod();
  }
  getNotebookConfigForWorkgroup(workgroupId) {
    if (
      this.ConfigService.isRunOwner(workgroupId) ||
      this.ConfigService.isRunSharedTeacher(workgroupId)
    ) {
      return this.NotebookService.getTeacherNotebookConfig();
    } else {
      return this.NotebookService.getStudentNotebookConfig();
    }
  }

  toggleWorkgroupNotebook(workgroup) {
    const workgroupId = workgroup.workgroupId;
    this.workVisibilityById[workgroupId] = !this.workVisibilityById[workgroupId];
  }

  isWorkgroupShown(workgroup) {
    return this.TeacherDataService.isWorkgroupShown(workgroup);
  }

  workgroupInView(workgroupId, inview) {
    this.workgroupInViewById[workgroupId] = inview;
    if (this.isExpandAll && inview) {
      this.workVisibilityById[workgroupId] = true;
    }
  }
}

export default NotebookGradingController;
