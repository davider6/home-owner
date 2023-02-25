import { TestBed } from "@angular/core/testing";

import { ManageFilesServiceService } from "./manage-files-service.service";

describe("ManageFilesServiceService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: ManageFilesServiceService = TestBed.get(
      ManageFilesServiceService
    );
    expect(service).toBeTruthy();
  });
});
