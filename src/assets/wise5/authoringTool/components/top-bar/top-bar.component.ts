'use strict';

import { Component, Input, OnInit } from '@angular/core';
import { getAvatarColorForWorkgroupId } from '../../../common/workgroup/workgroup';
import { ConfigService } from '../../../services/configService';
import { SessionService } from '../../../services/sessionService';
import { TeacherProjectService } from '../../../services/teacherProjectService';
import { Router } from '@angular/router';
import { ProjectLocale } from '../../../../../app/domain/projectLocale';
import { Language } from '../../../../../app/domain/language';
import { Subscription } from 'rxjs';
import { TeacherDataService } from '../../../services/teacherDataService';
import { NotifyAuthorService } from '../../../services/notifyAuthorService';

@Component({
  selector: 'at-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  avatarColor: any;
  contextPath: string;
  protected hasTranslations: boolean;
  @Input() logoPath: string;
  @Input() projectId: number;
  projectInfo: string;
  protected projectLocale: ProjectLocale;
  @Input() projectTitle: string;
  @Input() runId: number;
  @Input() runCode: string;
  private subscriptions = new Subscription();
  userInfo: any;
  workgroupId: number;

  constructor(
    private configService: ConfigService,
    private dataService: TeacherDataService,
    private notifyAuthorService: NotifyAuthorService,
    private projectService: TeacherProjectService,
    private router: Router,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.workgroupId = this.configService.getWorkgroupId();
    if (this.workgroupId == null) {
      this.workgroupId = 100 * Math.random();
    }
    this.avatarColor = getAvatarColorForWorkgroupId(this.workgroupId);
    this.userInfo = this.configService.getMyUserInfo();
    this.contextPath = this.configService.getContextPath();
    this.subscriptions.add(
      this.projectService.projectSaved$.subscribe(() => this.updateTranslationModel())
    );
  }

  private updateTranslationModel(): void {
    this.projectLocale = this.projectService.getLocale();
    this.hasTranslations = this.projectLocale.hasTranslations();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnChanges() {
    if (this.projectId) {
      this.projectInfo = this.getProjectInfo();
      this.updateTranslationModel();
    } else {
      this.hasTranslations = false;
    }
  }

  private getProjectInfo(): string {
    let projectInfo = $localize`ID: ${this.projectId}`;
    if (this.runId) {
      projectInfo += ` | ` + $localize`Run ID: ${this.runId} | Access Code: ${this.runCode}`;
    }
    return projectInfo;
  }

  protected previewProject(): void {
    let previewUrl = this.configService.getConfigParam('previewProjectURL');
    const nodeId = this.dataService.getCurrentNodeId();
    if (nodeId != null) {
      previewUrl += `/${nodeId}`;
    }
    window.open(previewUrl);
  }

  protected showHelp(): void {
    window.open(
      'https://docs.google.com/document/d/1G8lVtiUlGXLRAyFOvkEdadHYhJhJLW4aor9dol2VzeU',
      '_blank'
    );
  }

  protected switchToGradingView(): void {
    if (/unit\/(\d*)\/node\/(\w*)$/.test(this.router.url)) {
      this.router.navigate([
        '/teacher/manage/unit',
        this.runId,
        'node',
        this.router.url.match(/\/node\/(\w+)$/)[1]
      ]);
    } else {
      this.router.navigate(['/teacher/manage/unit', this.runId]);
    }
  }

  protected goHome(): void {
    this.notifyAuthorService.editEnd(this.projectId).then(() => {
      this.sessionService.goHome();
    });
  }

  protected logOut(): void {
    this.sessionService.logOut();
  }

  protected changeLanguage(language: Language): void {
    this.projectService.setCurrentLanguage(language);
    this.projectService.uiChanged();
  }
}
