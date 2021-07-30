import { NgModule } from '@angular/core';
import { ComponentStateInfoComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/component-state-info/component-state-info.component';
import { EditComponentAnnotationsComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/edit-component-annotations/edit-component-annotations.component';
import { EditComponentCommentComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/edit-component-comment/edit-component-comment.component';
import { EditComponentScoreComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/edit-component-score/edit-component-score.component';
import { GradingEditComponentMaxScoreComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/grading-edit-component-max-score/grading-edit-component-max-score.component';
import { ManagePeriodComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/manage-period/manage-period.component';
import { ManageStudentsComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/manage-students/manage-students.component';
import { ManageStudentsLegacyComponent } from '../../assets/wise5/classroomMonitor/manageStudents/manage-students-legacy.component';
import { ManageTeamComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/manage-team/manage-team.component';
import { ManageTeamsComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/manage-teams/manage-teams.component';
import { ManageUserComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/manage-user/manage-user.component';
import { MoveUserConfirmDialogComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/move-user-confirm-dialog/move-user-confirm-dialog.component';
import { WorkgroupInfoComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeGrading/workgroupInfo/workgroup-info.component';
import { NavItemScoreComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/nodeProgress/navItemScore/nav-item-score.component';
import { SelectPeriodComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/select-period/select-period.component';
import { WorkgroupNodeScoreComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/shared/workgroupNodeScore/workgroup-node-score.component';
import { ViewComponentRevisionsComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/view-component-revisions/view-component-revisions.component';
import { WorkgroupComponentGradingComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/workgroup-component-grading/workgroup-component-grading.component';
import { AlertStatusCornerComponent } from '../classroom-monitor/alert-status-corner/alert-status-corner.component';
import { ComponentNewWorkBadgeComponent } from '../classroom-monitor/component-new-work-badge/component-new-work-badge.component';
import { ComponentSelectComponent } from '../classroom-monitor/component-select/component-select.component';
import { MilestonesComponent } from '../classroom-monitor/milestones/milestones.component';
import { NavItemProgressComponent } from '../classroom-monitor/nav-item-progress/nav-item-progress.component';
import { StatusIconComponent } from '../classroom-monitor/status-icon/status-icon.component';
import { StepInfoComponent } from '../classroom-monitor/step-info/step-info.component';
import { WorkgroupNodeStatusComponent } from '../classroom-monitor/workgroup-node-status/workgroup-node-status.component';
import { WorkgroupSelectAutocompleteComponent } from '../classroom-monitor/workgroup-select/workgroup-select-autocomplete/workgroup-select-autocomplete.component';
import { WorkgroupSelectDropdownComponent } from '../classroom-monitor/workgroup-select/workgroup-select-dropdown/workgroup-select-dropdown.component';
import { AngularJSModule } from '../common-hybrid-angular.module';
import { ComponentGradingModule } from './component-grading.module';
import { MilestoneReportDataComponent } from './milestone/milestone-report-data/milestone-report-data.component';
import { ChangeTeamPeriodDialogComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/change-team-period-dialog/change-team-period-dialog.component';
import { ManageShowStudentInfoComponent } from '../../assets/wise5/classroomMonitor/classroomMonitorComponents/manageStudents/manage-show-student-info/manage-show-student-info.component';

@NgModule({
  declarations: [
    AlertStatusCornerComponent,
    ChangeTeamPeriodDialogComponent,
    ComponentNewWorkBadgeComponent,
    ComponentSelectComponent,
    ComponentStateInfoComponent,
    EditComponentAnnotationsComponent,
    EditComponentCommentComponent,
    EditComponentScoreComponent,
    GradingEditComponentMaxScoreComponent,
    ManagePeriodComponent,
    ManageShowStudentInfoComponent,
    ManageStudentsComponent,
    ManageStudentsLegacyComponent,
    ManageTeamComponent,
    ManageTeamsComponent,
    ManageUserComponent,
    MilestonesComponent,
    MilestoneReportDataComponent,
    MoveUserConfirmDialogComponent,
    NavItemProgressComponent,
    SelectPeriodComponent,
    StatusIconComponent,
    StepInfoComponent,
    ViewComponentRevisionsComponent,
    WorkgroupComponentGradingComponent,
    WorkgroupInfoComponent,
    WorkgroupNodeScoreComponent,
    WorkgroupSelectAutocompleteComponent,
    WorkgroupSelectDropdownComponent,
    NavItemScoreComponent,
    WorkgroupNodeStatusComponent
  ],
  imports: [AngularJSModule, ComponentGradingModule]
})
export class ClassroomMonitorModule {}
