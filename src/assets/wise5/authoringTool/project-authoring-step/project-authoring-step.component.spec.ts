import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectAuthoringStepComponent } from './project-authoring-step.component';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { TeacherDataService } from '../../services/teacherDataService';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { TeacherWebSocketService } from '../../services/teacherWebSocketService';
import { ClassroomStatusService } from '../../services/classroomStatusService';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NodeIconAndTitleComponent } from '../choose-node-location/node-icon-and-title/node-icon-and-title.component';
import { NodeIconComponent } from '../../vle/node-icon/node-icon.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

const nodeId1 = 'nodeId1';
const node = { id: nodeId1 };

describe('ProjectAuthoringStepComponent', () => {
  let component: ProjectAuthoringStepComponent;
  let fixture: ComponentFixture<ProjectAuthoringStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NodeIconComponent, NodeIconAndTitleComponent, ProjectAuthoringStepComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatDialogModule,
        MatIconModule,
        StudentTeacherCommonServicesModule
      ],
      providers: [
        ClassroomStatusService,
        TeacherDataService,
        TeacherProjectService,
        TeacherWebSocketService
      ]
    });
    fixture = TestBed.createComponent(ProjectAuthoringStepComponent);
    component = fixture.componentInstance;
    component.item = node;
    const idToNode = {};
    idToNode[nodeId1] = node;
    TestBed.inject(TeacherProjectService).idToNode = idToNode;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});