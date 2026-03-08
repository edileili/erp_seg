import { TestBed } from '@angular/core/testing';

import { HasPermissionDirective } from './has-permission.directive';

describe('HasPermissionDirective', () => {
  let service: HasPermissionDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HasPermissionDirective);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
