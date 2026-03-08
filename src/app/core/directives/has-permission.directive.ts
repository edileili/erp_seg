import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { Permission, PermissionService } from '../services/permission.service';

@Directive({ selector: '[hasPermission]', standalone: true})
export class HasPermissionDirective {
  @Input() hasPermission!: Permission | Permission[];
  @Input() hasPermissionMode: 'all' | 'any' = 'any';

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    const permissions = Array.isArray(this.hasPermission)
      ? this.hasPermission : [this.hasPermission];
    
      const hasAccess = this.hasPermissionMode === 'all'
        ? this.permissionService.hasAllPermissions(permissions)
        : this.permissionService.hastAnyPermission(permissions);

    this.viewContainer.clear();
    if(hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

}
