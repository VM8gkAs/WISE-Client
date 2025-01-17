import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddComponentButtonComponent } from './add-component-button.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateComponentService } from '../../../services/createComponentService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { ChooseNewComponent } from '../../../../../app/authoring-tool/add-component/choose-new-component/choose-new-component.component';
import { of } from 'rxjs';
import { Node } from '../../../common/Node';
import { provideRouter } from '@angular/router';

class MockTeacherProjectService {
  saveProject() {}
}
class MockCreateComponentService {
  create() {}
}
let loader: HarnessLoader;
describe('AddComponentButtonComponent', () => {
  let component: AddComponentButtonComponent;
  let fixture: ComponentFixture<AddComponentButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddComponentButtonComponent],
      providers: [
        { provide: CreateComponentService, useClass: MockCreateComponentService },
        { provide: TeacherProjectService, useClass: MockTeacherProjectService },
        provideRouter([])
      ]
    });
    fixture = TestBed.createComponent(AddComponentButtonComponent);
    component = fixture.componentInstance;
    component.node = { id: 'node1' } as Node;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  describe('clicking on the button', () => {
    it('shows add component dialog, create selected component, and save project', async () => {
      const dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue({
        afterClosed: () => of({ action: 'create', componentType: 'OpenResponse' })
      } as any);
      const projectService = TestBed.inject(TeacherProjectService);
      const createComponentSpy = spyOn(TestBed.inject(CreateComponentService), 'create');
      const saveProjectSpy = spyOn(projectService, 'saveProject');
      await (await loader.getHarness(MatButtonHarness)).click();
      expect(dialogSpy).toHaveBeenCalledWith(ChooseNewComponent, {
        data: null,
        width: '80%'
      });
      expect(createComponentSpy).toHaveBeenCalled();
      expect(saveProjectSpy).toHaveBeenCalled();
    });
  });
});
