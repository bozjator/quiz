import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';

export class AppHttpService {
  protected readonly http: HttpClient;

  private readonly apiUrl = 'http://localhost:3000'; // TODO: Move to environment variable
  private readonly apiUrlAndBasePath;

  constructor(private readonly basePath: string) {
    this.http = inject(HttpClient);
    this.apiUrlAndBasePath = `${this.apiUrl}/${this.basePath}`;
  }

  protected url(uri: string, omitSlash?: boolean): string {
    const slash = omitSlash ? '' : '/';
    return uri.length > 0 ? `${this.apiUrlAndBasePath}${slash}${uri}` : this.apiUrlAndBasePath;
  }

  /**
   * Converts an object into HttpParams.
   *
   * @param query The object to be converted to HttpParams.
   * @returns HttpParams instance with the query parameters.
   */
  toHttpParams(query: any): HttpParams {
    let params = new HttpParams();

    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        const value = query[key];

        if (Array.isArray(value)) {
          value.forEach((val) => {
            params = params.append(key, val.toString());
          });
        } else if (value !== null && value !== undefined) {
          params = params.set(key, value.toString());
        }
      }
    }

    return params;
  }
}
