import vleModule from '../../../vle/vle';

let GraphService;
let studentDataWithTrial = {};

describe('GraphService', () => {
  beforeEach(angular.mock.module(vleModule.name));

  beforeEach(inject(_GraphService_ => {
    GraphService = _GraphService_;
  }));

  describe('hasSeriesData()', () => {
    shouldReturnFalseWhenSeriesIsNull();
    shouldReturnFalseWhenSeriesDataIsEmpty();
    shouldReturnTrueWhenSeriesHasData();
  });

  describe('hasTrialData()', () => {
    beforeEach(() => {
      studentDataWithTrial = {
        trials: [
          {
            series: [
              {
                data: [
                  [1, 5],
                  [2, 10]
                ]
              }
            ]
          }
        ]
      };
    });

    shouldReturnFalseWhenTrialsIsNull();
    shouldReturnFalseWhenThereIsNoSeriesInAnyTrial();
    shouldReturnTrueWhenThereIsASeriesInATrialWithData();
  });

  describe('componentStateHasStudentWork()', () => {
    shouldReturnFalseWhenTheComponentStateDoesNotHaveStudentWork();
    shouldReturnTrueWhenTheComponentStateHasStudentWork();
  });

  describe('isStudentChangedAxisLimit()', () => {
    shouldReturnFalseWhenTheStudentHasNotChangedTheAxisLimit();
    shouldReturnTrueWhenTheStudentHasChangedTheAxisLimit();
  });
});

function shouldReturnFalseWhenSeriesIsNull() {
  it('should return false when series is null', () => {
    const studentData = {};
    expect(GraphService.hasSeriesData(studentData)).toBeFalsy();
  });
}

function shouldReturnFalseWhenSeriesDataIsEmpty() {
  it('should return false when series data is empty', () => {
    const studentData = {
      series: [{}]
    };
    expect(GraphService.hasSeriesData(studentData)).toBeFalsy();
  });
}

function shouldReturnTrueWhenSeriesHasData() {
  it('should return true when series has data', () => {
    const studentData = {
      series: [
        {
          data: [[0, 10]]
        }
      ]
    };
    expect(GraphService.hasSeriesData(studentData)).toBeTruthy();
  });
}

function shouldReturnFalseWhenTrialsIsNull() {
  it('should return false when trials is null', () => {
    studentDataWithTrial.trials = null;
    expect(GraphService.hasTrialData(studentDataWithTrial)).toBeFalsy();
  });
}

function shouldReturnFalseWhenThereIsNoSeriesInAnyTrial() {
  it('should return false when there is no series in any trial', () => {
    for (let trial of studentDataWithTrial.trials) {
      trial.series = [];
    }
    expect(GraphService.hasTrialData(studentDataWithTrial)).toBeFalsy();
  });
}

function shouldReturnTrueWhenThereIsASeriesInATrialWithData() {
  it('should return true when there is a series in a trial with data', () => {
    expect(GraphService.hasTrialData(studentDataWithTrial)).toBeTruthy();
  });
}

function shouldReturnFalseWhenTheComponentStateDoesNotHaveStudentWork() {
  it('should return false when the component state does not have student work', () => {
    const componentState = {
      studentData: {
        trials: [
          {
            series: [
              {
                data: []
              }
            ]
          }
        ]
      }
    };
    const componentContent = {};
    expect(GraphService.componentStateHasStudentWork(componentState, componentContent)).toBeFalsy();
  });
}

function shouldReturnTrueWhenTheComponentStateHasStudentWork() {
  it('should return true when the component state has student work', () => {
    const componentState = {
      studentData: {
        trials: [
          {
            series: [
              {
                data: [[0, 10]]
              }
            ]
          }
        ]
      }
    };
    const componentContent = {};
    expect(
      GraphService.componentStateHasStudentWork(componentState, componentContent)
    ).toBeTruthy();
  });
}

function shouldReturnFalseWhenTheStudentHasNotChangedTheAxisLimit() {
  it('should return false when the student has not changed the axis limit', () => {
    const componentState = {
      studentData: {
        xAxis: { min: 0, max: 10 },
        yAxis: { min: 0, max: 10 }
      }
    };
    const componentContent = {
      xAxis: { min: 0, max: 10 },
      yAxis: { min: 0, max: 10 }
    };
    expect(GraphService.isStudentChangedAxisLimit(componentState, componentContent)).toBeFalsy();
  });
}

function shouldReturnTrueWhenTheStudentHasChangedTheAxisLimit() {
  it('should return true when the student has changed the axis limit', () => {
    const componentState = {
      studentData: {
        xAxis: { min: 0, max: 20 },
        yAxis: { min: 0, max: 20 }
      }
    };
    const componentContent = {
      xAxis: { min: 0, max: 10 },
      yAxis: { min: 0, max: 10 }
    };
    expect(GraphService.isStudentChangedAxisLimit(componentState, componentContent)).toBeTruthy();
  });
}
