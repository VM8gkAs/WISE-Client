import '../lib/jquery/jquery-global';
import * as angular from 'angular';
import { downgradeComponent, downgradeInjectable } from '@angular/upgrade/static';
import '../common-angular-js-module';
import { CopyProjectService } from '../services/copyProjectService';
import { DeleteNodeService } from '../services/deleteNodeService';
import { MilestoneService } from '../services/milestoneService';
import { MoveNodesService } from '../services/moveNodesService';
import { TeacherProjectService } from '../services/teacherProjectService';
import { SpaceService } from '../services/spaceService';
import { StudentStatusService } from '../services/studentStatusService';
import { TeacherDataService } from '../services/teacherDataService';
import { TeacherWebSocketService } from '../services/teacherWebSocketService';
import { StepToolsComponent } from '../common/stepTools/step-tools.component';

import '../classroomMonitor/classroom-monitor.module';
import '../authoringTool/authoring-tool.module';

angular
  .module('teacher', ['common', 'angular-inview', 'authoringTool', 'classroomMonitor', 'ngAnimate'])
  .factory('CopyProjectService', downgradeInjectable(CopyProjectService))
  .factory('DeleteNodeService', downgradeInjectable(DeleteNodeService))
  .factory('MilestoneService', downgradeInjectable(MilestoneService))
  .factory('MoveNodesService', downgradeInjectable(MoveNodesService))
  .factory('ProjectService', downgradeInjectable(TeacherProjectService))
  .factory('SpaceService', downgradeInjectable(SpaceService))
  .factory('StudentStatusService', downgradeInjectable(StudentStatusService))
  .factory('TeacherDataService', downgradeInjectable(TeacherDataService))
  .factory('TeacherWebSocketService', downgradeInjectable(TeacherWebSocketService))
  .directive(
    'stepTools',
    downgradeComponent({ component: StepToolsComponent }) as angular.IDirectiveFactory
  )
  .config([
    '$stateProvider',
    ($stateProvider) => {
      $stateProvider
        .state('root', {
          url: '/teacher',
          abstract: true
        })
        .state('sink', {
          url: '/*path',
          template: ''
        });
    }
  ]);
