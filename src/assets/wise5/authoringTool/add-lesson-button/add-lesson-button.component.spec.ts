import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddLessonButtonComponent } from './add-lesson-button.component';
import { TeacherProjectService } from '../../services/teacherProjectService';
import { StudentTeacherCommonServicesModule } from '../../../../app/student-teacher-common-services.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('AddLessonButtonComponent', () => {
  let component: AddLessonButtonComponent;
  let fixture: ComponentFixture<AddLessonButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddLessonButtonComponent, StudentTeacherCommonServicesModule],
      providers: [
        TeacherProjectService,
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([])
      ]
    });
    fixture = TestBed.createComponent(AddLessonButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
