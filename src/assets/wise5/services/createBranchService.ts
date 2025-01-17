import { Injectable } from '@angular/core';
import { TeacherProjectService } from './teacherProjectService';
import { AuthorBranchParams } from '../common/AuthorBranchParams';
import { Transition } from '../common/Transition';
import { AuthorBranchService } from './authorBranchService';

@Injectable()
export class CreateBranchService extends AuthorBranchService {
  constructor(protected projectService: TeacherProjectService) {
    super(projectService);
  }

  createBranch(params: AuthorBranchParams): Promise<void> {
    const branchNode = this.projectService.getNode(params.branchStepId);
    const nodeIdBranchNodeTransitionsTo =
      branchNode.transitionLogic.transitions.length > 0
        ? branchNode.transitionLogic.transitions[0].to
        : '';
    branchNode.transitionLogic.transitions = [];
    const newNodeIds = this.createNewNodeIds(params.pathCount);
    this.createPathSteps(params, branchNode, newNodeIds);
    const mergeStep: any =
      params.mergeStepId === ''
        ? this.createMergeStep(newNodeIds, nodeIdBranchNodeTransitionsTo)
        : this.projectService.getNode(params.mergeStepId);
    this.setPathStepTransitions(newNodeIds, mergeStep.id);
    this.setBranchNodeTransitionLogic(branchNode, params.criteria);
    if (params.mergeStepId === '') {
      newNodeIds.push(mergeStep.id);
    }
    this.addNewNodeIdsToParentGroup(params.branchStepId, newNodeIds);
    return this.projectService.saveProject();
  }

  private createNewNodeIds(pathCount: number): string[] {
    const newNodeIds = [];
    for (let i = 0; i < pathCount; i++) {
      newNodeIds.push(this.projectService.getNextAvailableNodeId(newNodeIds));
    }
    return newNodeIds;
  }

  private createPathSteps(params: AuthorBranchParams, branchNode: any, newNodeIds: string[]): void {
    for (let i = 0; i < newNodeIds.length; i++) {
      this.createPathStep(params, branchNode, newNodeIds[i], i);
    }
  }

  private createMergeStep(newNodeIds: string[], nodeIdBranchNodeTransitionsTo: string): any {
    const mergeStepNode = this.projectService.createNode($localize`Merge Step`);
    mergeStepNode.id = this.projectService.getNextAvailableNodeId(newNodeIds);
    if (nodeIdBranchNodeTransitionsTo !== '') {
      mergeStepNode.transitionLogic.transitions = [new Transition(nodeIdBranchNodeTransitionsTo)];
    }
    this.projectService.addNode(mergeStepNode);
    this.projectService.addApplicationNode(mergeStepNode);
    this.projectService.setIdToNode(mergeStepNode.id, mergeStepNode);
    return mergeStepNode;
  }

  private addNewNodeIdsToParentGroup(branchStepId: string, newNodeIds: string[]): void {
    const parentGroup = this.projectService.getParentGroup(branchStepId);
    parentGroup.ids.splice(parentGroup.ids.indexOf(branchStepId) + 1, 0, ...newNodeIds);
  }
}
