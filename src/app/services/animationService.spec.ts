import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AnnotationService } from '../../assets/wise5/services/annotationService';
import { ConfigService } from '../../assets/wise5/services/configService';
import { ProjectService } from '../../assets/wise5/services/projectService';
import { StudentAssetService } from '../../assets/wise5/services/studentAssetService';
import { TagService } from '../../assets/wise5/services/tagService';
import { AnimationService } from '../../assets/wise5/components/animation/animationService';
import { SessionService } from '../../assets/wise5/services/sessionService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

let service: AnimationService;

describe('AnimationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        AnimationService,
        AnnotationService,
        ConfigService,
        ProjectService,
        SessionService,
        StudentAssetService,
        TagService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    service = TestBed.get(AnimationService);
  });
  createComponent();
  isCompleted();
  componentStateHasStudentWork();
});

function createComponent() {
  it('should create an animation component', () => {
    const component = service.createComponent();
    expect(component.type).toEqual('Animation');
    expect(component.widthInPixels).toEqual(600);
    expect(component.widthInUnits).toEqual(60);
    expect(component.heightInPixels).toEqual(200);
    expect(component.heightInUnits).toEqual(20);
    expect(component.dataXOriginInPixels).toEqual(0);
    expect(component.dataYOriginInPixels).toEqual(80);
    expect(component.coordinateSystem).toEqual('screen');
    expect(component.objects).toEqual([]);
  });
}

function isCompleted() {
  function expectIsCompleted(componentStates: any[], expectedResult: boolean) {
    expect(service.isCompleted({}, componentStates, [], {})).toEqual(expectedResult);
  }
  it('should check is completed when it is not completed', () => {
    expectIsCompleted([], false);
  });
  it('should check is completed when it is completed', () => {
    expectIsCompleted([{}], true);
  });
}

function componentStateHasStudentWork() {
  function expectComponentStateHasStudentWork(componentState: any, expectedResult: boolean) {
    expect(service.componentStateHasStudentWork(componentState, {})).toEqual(expectedResult);
  }
  it('should check if a component state has student work when it does not have student work', () => {
    expectComponentStateHasStudentWork({}, false);
  });
  it('should check if a component state has student work when it does have student work', () => {
    expectComponentStateHasStudentWork({ studentData: {} }, true);
  });
}
