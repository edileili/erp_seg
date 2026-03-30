import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { Permission, PermissionService } from '../services/permission.service';

@Directive({ selector: '[hasPermission]', standalone: true})
export class HasPermissionDirective implements OnInit {
  private requiredPermissions: Permission[] = [];

  @Input() set hasPermission(permissions: Permission[]) {
    this.requiredPermissions = permissions;
  }
  @Input() hasPermissionMode: 'all' | 'any' = 'any';

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    const hasAccess = this.hasPermissionMode === 'all'
      ? this.permissionService.hasAllPermissions(this.requiredPermissions)
      : this.permissionService.hastAnyPermission(this.requiredPermissions);

    if (hasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
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
