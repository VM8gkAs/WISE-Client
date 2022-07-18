import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { ClassroomStatusService } from '../../assets/wise5/services/classroomStatusService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { UtilService } from '../../assets/wise5/services/utilService';
import { SessionService } from '../../assets/wise5/services/sessionService';
import { ComponentServiceLookupServiceModule } from '../../assets/wise5/services/componentServiceLookupServiceModule';

let configService: ConfigService;
let service: ClassroomStatusService;
let http: HttpTestingController;

describe('ClassroomStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ComponentServiceLookupServiceModule, HttpClientTestingModule],
      providers: [
        AnnotationService,
        ConfigService,
        ProjectService,
        SessionService,
        ClassroomStatusService,
        UtilService
      ]
    });
    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ClassroomStatusService);
    configService = TestBed.inject(ConfigService);
  });
  retrieveStudentStatuses();
});

function retrieveStudentStatuses() {
  describe('retrieveStudentStatuses', () => {
    retrieveStudentStatuses_SetStudentStatuses();
  });
}

function retrieveStudentStatuses_SetStudentStatuses() {
  it('retrieve and set student statuses for current run', () => {
    const runId = 1;
    const workgroup2Id = 2;
    const statusPostTimestamp = 12345;
    const workgroupsInRun = [{ workgroupId: workgroup2Id }];
    spyOn(configService, 'getRunId').and.returnValue(runId);
    spyOn(configService, 'getClassmateUserInfos').and.returnValue(workgroupsInRun);
    service.retrieveStudentStatuses();
    http.expectOne(`/api/teacher/run/${runId}/student-status`).flush([
      {
        status: `{"runId": ${runId}, "workgroupId": ${workgroup2Id}}`,
        timestamp: statusPostTimestamp,
        workgroupId: workgroup2Id
      },
      {
        status: -1,
        timestamp: -1,
        workgroupId: -1
      }
    ]);
    expect(configService.getRunId).toHaveBeenCalled();
    expect(configService.getClassmateUserInfos).toHaveBeenCalled();
    expect(service.studentStatuses.length).toEqual(1);
    expect(service.studentStatuses[0].workgroupId).toEqual(workgroup2Id);
    expect(service.studentStatuses[0].postTimestamp).toEqual(statusPostTimestamp);
  });
}
