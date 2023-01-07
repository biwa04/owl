export type Page = {
  lines: string[];
  sid: string;
  projectID: string;
  title: string;
};

export function newPage(sid: string, projectID: string, lines: string[]): Page {
  return {
    lines: lines,
    sid: sid,
    projectID: projectID,
    title: (new Date()).toISOString(),
  };
}

export interface PageRepository {
  save(page: Page): Promise<Response>;
}

export class ScrapboxRepository implements PageRepository {
  SCRAPBOX_BASE_URL = "https://scrapbox.io";

  save(page: Page) {
    const formData = new FormData();
    formData.append(
      "import-file",
      new Blob([
        JSON.stringify({
          pages: [{
            lines: [page.title].concat(page.lines),
            title: page.title,
          }],
        }),
      ], {
        type: "application/octet-stream",
      }),
    );

    return this.getCSRFToken(page.sid).then((cstfToken) => {
      return fetch(
        `${this.SCRAPBOX_BASE_URL}/api/page-data/import/${page.projectID}.json`,
        {
          method: "POST",
          headers: {
            Cookie: `connect.sid=${page.sid}`,
            Accept: "application/json, text/plain, */*",
            "X-CSRF-TOKEN": cstfToken,
          },
          body: formData,
        },
      );
    });
  }

  getCSRFToken(sid: string): Promise<string> {
    const req = (): Promise<{ csrfToken: string }> =>
      fetch(
        `${this.SCRAPBOX_BASE_URL}/api/users/me`,
        {
          method: "GET",
          headers: {
            Cookie: `connect.sid=${sid}`,
          },
        },
      ).then((x) => x.json());

    const csrfToken = req().then((response) => response.csrfToken);

    return csrfToken;
  }
}
