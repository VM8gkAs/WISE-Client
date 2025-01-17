import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { StudentTeacherCommonServicesModule } from '../../../../../app/student-teacher-common-services.module';
import { Component } from '../../../common/Component';
import { ComponentContent } from '../../../common/ComponentContent';
import { NotebookService } from '../../../services/notebookService';

import { ShowMyWorkStudentComponent } from './show-my-work-student.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

class MockService {}

class MockNotebookService {
  notebookUpdated$: any = of({});

  isNotebookEnabled() {
    return false;
  }
}

describe('ShowMyWorkStudentComponent', () => {
  let component: ShowMyWorkStudentComponent;
  let fixture: ComponentFixture<ShowMyWorkStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [ShowMyWorkStudentComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [MatCardModule, StudentTeacherCommonServicesModule],
    providers: [
        { provide: MatDialog, useClass: MockService },
        { provide: NotebookService, useClass: MockNotebookService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMyWorkStudentComponent);
    component = fixture.componentInstance;
    const componentContent = {
      id: 'abc',
      prompt: '',
      showSaveButton: true,
      showSubmitButton: true
    } as ComponentContent;
    component.component = new Component(componentContent, null);
    spyOn(component, 'subscribeToSubscriptions').and.callFake(() => {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
